/**
 * SME_NotebookLM_Ang — Full NotebookLM Integration Module
 * 
 * This module provides two execution paths for audio/document generation:
 * 
 * PATH A (Primary): Gemini API → Podcast Script Generation → Google Cloud TTS → MP3
 *   - Available NOW with standard Google Cloud credentials
 *   - Uses Gemini to generate a conversational podcast script from source content
 *   - Uses Google Cloud Text-to-Speech to render the script as audio
 *   - Stores output in local filesystem or Cloud Storage
 * 
 * PATH B (Premium): NotebookLM Enterprise Podcast API (Discovery Engine)
 *   - Requires allowlisted Google Cloud project + Discovery Engine API enabled
 *   - Direct REST call to generate podcast from context array
 *   - Returns MP3 natively
 * 
 * ROUTING: Picker_Ang checks for NOTEBOOKLM_ENTERPRISE_ENABLED env.
 *   If true → PATH B. Otherwise → PATH A.
 */

import { randomBytes } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';

// =========================================================================
// Types
// =========================================================================

export interface NotebookLMRequest {
  /** The raw content to process (text, URL, or file path) */
  content: string;
  /** Content type hint */
  contentType: 'text' | 'url' | 'pdf' | 'youtube';
  /** What to generate */
  outputType: 'conversational_audio' | 'briefing_doc' | 'faq';
  /** Optional focus prompt to guide generation */
  focusPrompt?: string;
  /** Desired podcast length */
  length?: 'short' | 'standard';
}

export interface NotebookLMResponse {
  success: boolean;
  /** The generated text content (script, briefing, FAQ) */
  textContent: string;
  /** If audio was generated, the URL/path to the MP3 */
  audioUrl?: string;
  /** Attachment payload for Guide_Ang chat embedding */
  attachment?: {
    type: 'audio' | 'document';
    url: string;
    label: string;
  };
  /** Which execution path was used */
  executionPath: 'gemini_tts' | 'notebooklm_enterprise' | 'fallback';
  /** Processing metadata */
  meta: {
    tokensUsed?: number;
    durationMs: number;
    model?: string;
  };
}

// =========================================================================
// Configuration
// =========================================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID || '';
const GCP_LOCATION = process.env.GCP_LOCATION || 'global';
const NOTEBOOKLM_ENTERPRISE_ENABLED = process.env.NOTEBOOKLM_ENTERPRISE_ENABLED === 'true';
const GCP_ACCESS_TOKEN = process.env.GCP_ACCESS_TOKEN || ''; // OAuth2 access token for GCP APIs

// Output directory for generated audio files
const AUDIO_OUTPUT_DIR = process.env.AUDIO_OUTPUT_DIR || path.join(process.cwd(), 'generated_audio');

// Ensure output directory exists
if (!fs.existsSync(AUDIO_OUTPUT_DIR)) {
  fs.mkdirSync(AUDIO_OUTPUT_DIR, { recursive: true });
}

// =========================================================================
// PATH A: Gemini API + Google Cloud TTS
// =========================================================================

/**
 * Step 1: Use Gemini to generate a podcast-style conversational script
 * from the provided source content.
 */
async function generatePodcastScript(
  content: string,
  focusPrompt?: string,
  length: 'short' | 'standard' = 'standard'
): Promise<{ script: string; tokensUsed: number }> {
  
  const targetMinutes = length === 'short' ? '3-5' : '8-12';
  
  const systemPrompt = `You are a professional podcast script writer. You create engaging, 
conversational two-host podcast scripts from source material. The hosts are named "Alex" and "Jordan". 
They naturally discuss the content, ask each other questions, provide insights, and make the material 
accessible and interesting.

Rules:
- Format each line as: ALEX: [dialogue] or JORDAN: [dialogue]
- Target ${targetMinutes} minutes of spoken content (roughly ${length === 'short' ? '600-900' : '1500-2200'} words)
- Include natural conversational elements (pauses noted as [pause], laughter as [laughs])
- Start with a brief intro and end with a summary/takeaway
- Keep the tone professional but engaging
${focusPrompt ? `- Focus specifically on: ${focusPrompt}` : ''}`;

  const userPrompt = `Generate a podcast script from the following source material:\n\n${content.substring(0, 30000)}`;

  if (!GEMINI_API_KEY) {
    // Fallback: Generate a basic script without Gemini
    console.warn('[SME_NotebookLM_Ang] No GEMINI_API_KEY configured. Using template script.');
    return {
      script: generateFallbackScript(content, focusPrompt),
      tokensUsed: 0
    };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 4096,
            topP: 0.95,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[SME_NotebookLM_Ang] Gemini API error:', errorText);
      return { script: generateFallbackScript(content, focusPrompt), tokensUsed: 0 };
    }

    const data = await response.json() as any;
    const script = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const tokensUsed = data.usageMetadata?.totalTokenCount || 0;

    return { script, tokensUsed };
  } catch (error: any) {
    console.error('[SME_NotebookLM_Ang] Gemini request failed:', error.message);
    return { script: generateFallbackScript(content, focusPrompt), tokensUsed: 0 };
  }
}

/**
 * Step 2: Use Google Cloud Text-to-Speech to render the script as audio.
 * Uses long-form synthesis for scripts that exceed short limits.
 */
async function synthesizeSpeech(
  script: string
): Promise<{ audioPath: string; audioUrl: string }> {

  const audioId = randomBytes(8).toString('hex');
  const outputFilename = `podcast_${audioId}.mp3`;
  const outputPath = path.join(AUDIO_OUTPUT_DIR, outputFilename);

  // If no GCP credentials, save script as text and return a reference
  if (!GCP_ACCESS_TOKEN && !GCP_PROJECT_ID) {
    console.warn('[SME_NotebookLM_Ang] No GCP_ACCESS_TOKEN. Saving script as text file.');
    const textPath = path.join(AUDIO_OUTPUT_DIR, `podcast_${audioId}.txt`);
    fs.writeFileSync(textPath, script, 'utf-8');
    return {
      audioPath: textPath,
      audioUrl: `/generated_audio/podcast_${audioId}.txt`
    };
  }

  try {
    // Extract clean dialogue text (remove host labels for TTS)
    const cleanText = script
      .replace(/^(ALEX|JORDAN):\s*/gm, '')
      .replace(/\[pause\]/g, '...')
      .replace(/\[laughs?\]/g, '')
      .trim();

    // Use long-form audio synthesis for anything over 5000 bytes
    if (Buffer.byteLength(cleanText) > 5000) {
      return await synthesizeLongAudio(cleanText, outputPath, outputFilename);
    }

    // Short-form synthesis
    const ttsResponse = await fetch(
      'https://texttospeech.googleapis.com/v1/text:synthesize',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GCP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: { text: cleanText },
          voice: {
            languageCode: 'en-US',
            name: 'en-US-Neural2-D', // Professional male voice
            ssmlGender: 'MALE'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 1.0,
            pitch: 0.0,
            effectsProfileId: ['headphone-class-device']
          }
        })
      }
    );

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('[SME_NotebookLM_Ang] TTS API error:', errorText);
      // Fallback: save the script text
      fs.writeFileSync(outputPath.replace('.mp3', '.txt'), script, 'utf-8');
      return {
        audioPath: outputPath.replace('.mp3', '.txt'),
        audioUrl: `/generated_audio/podcast_${audioId}.txt`
      };
    }

    const ttsData = await ttsResponse.json() as any;
    const audioBuffer = Buffer.from(ttsData.audioContent, 'base64');
    fs.writeFileSync(outputPath, audioBuffer);

    return {
      audioPath: outputPath,
      audioUrl: `/generated_audio/${outputFilename}`
    };
  } catch (error: any) {
    console.error('[SME_NotebookLM_Ang] TTS synthesis failed:', error.message);
    const textPath = path.join(AUDIO_OUTPUT_DIR, `podcast_${audioId}.txt`);
    fs.writeFileSync(textPath, script, 'utf-8');
    return {
      audioPath: textPath,
      audioUrl: `/generated_audio/podcast_${audioId}.txt`
    };
  }
}

/**
 * Long-form audio synthesis for scripts > 5000 bytes.
 * Uses the v1beta1 synthesizeLongAudio endpoint.
 */
async function synthesizeLongAudio(
  text: string,
  outputPath: string,
  outputFilename: string
): Promise<{ audioPath: string; audioUrl: string }> {
  
  // For long audio, GCP writes to a GCS URI. We'll use local storage if no GCS is configured.
  const gcsOutputUri = process.env.GCS_AUDIO_BUCKET
    ? `gs://${process.env.GCS_AUDIO_BUCKET}/generated_audio/${outputFilename}`
    : null;

  if (!gcsOutputUri) {
    // Split into chunks and synthesize individually, then concatenate
    console.log('[SME_NotebookLM_Ang] No GCS bucket configured. Chunked local synthesis.');
    const chunks = splitTextIntoChunks(text, 4500);
    const audioBuffers: Buffer[] = [];

    for (const chunk of chunks) {
      try {
        const ttsResponse = await fetch(
          'https://texttospeech.googleapis.com/v1/text:synthesize',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${GCP_ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              input: { text: chunk },
              voice: {
                languageCode: 'en-US',
                name: 'en-US-Neural2-D',
                ssmlGender: 'MALE'
              },
              audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: 1.0,
                pitch: 0.0,
                effectsProfileId: ['headphone-class-device']
              }
            })
          }
        );

        if (ttsResponse.ok) {
          const data = await ttsResponse.json() as any;
          audioBuffers.push(Buffer.from(data.audioContent, 'base64'));
        }
      } catch (e) {
        console.error('[SME_NotebookLM_Ang] Chunk synthesis error:', e);
      }
    }

    if (audioBuffers.length > 0) {
      // Simple concatenation of MP3 frames (works for playback)
      const combined = Buffer.concat(audioBuffers);
      fs.writeFileSync(outputPath, combined);
      return { audioPath: outputPath, audioUrl: `/generated_audio/${outputFilename}` };
    }

    // Total fallback
    fs.writeFileSync(outputPath.replace('.mp3', '.txt'), text, 'utf-8');
    return {
      audioPath: outputPath.replace('.mp3', '.txt'),
      audioUrl: `/generated_audio/${outputFilename.replace('.mp3', '.txt')}`
    };
  }

  // Use the official long audio API with GCS output
  try {
    const projectNumber = process.env.GCP_PROJECT_NUMBER || GCP_PROJECT_ID;
    const longAudioResponse = await fetch(
      `https://texttospeech.googleapis.com/v1beta1/projects/${projectNumber}/locations/${GCP_LOCATION}:synthesizeLongAudio`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GCP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'en-US',
            name: 'en-US-Neural2-D',
          },
          audioConfig: {
            audioEncoding: 'LINEAR16',
          },
          outputGcsUri: gcsOutputUri
        })
      }
    );

    if (longAudioResponse.ok) {
      const operationData = await longAudioResponse.json() as any;
      // Long audio returns an operation. We return the GCS URI for now.
      return {
        audioPath: gcsOutputUri,
        audioUrl: gcsOutputUri
      };
    }
  } catch (error: any) {
    console.error('[SME_NotebookLM_Ang] Long audio synthesis failed:', error.message);
  }

  fs.writeFileSync(outputPath.replace('.mp3', '.txt'), text, 'utf-8');
  return {
    audioPath: outputPath.replace('.mp3', '.txt'),
    audioUrl: `/generated_audio/${outputFilename.replace('.mp3', '.txt')}`
  };
}

// =========================================================================
// PATH B: NotebookLM Enterprise Podcast API (Discovery Engine)
// =========================================================================

/**
 * Direct call to the NotebookLM Enterprise Podcast API.
 * This is a standalone API that does NOT require a NotebookLM notebook.
 * It requires:
 *   - A Google Cloud project with Discovery Engine API enabled
 *   - The Podcast API User role (roles/discoveryengine.podcastApiUser)
 *   - Allowlist access from Google Cloud sales
 */
async function generateViaEnterprisePodcastAPI(
  content: string,
  focusPrompt?: string,
  length: 'short' | 'standard' = 'standard'
): Promise<NotebookLMResponse> {

  const startTime = Date.now();

  if (!GCP_ACCESS_TOKEN || !GCP_PROJECT_ID) {
    throw new Error('GCP_ACCESS_TOKEN and GCP_PROJECT_ID are required for Enterprise Podcast API.');
  }

  const endpoint = `https://discoveryengine.googleapis.com/v1alpha/projects/${GCP_PROJECT_ID}/locations/${GCP_LOCATION}:generatePodcast`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GCP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contextInput: {
          contextElements: [
            {
              content: {
                text: content.substring(0, 100000) // 100K token limit
              }
            }
          ]
        },
        prompt: focusPrompt || 'Generate an engaging podcast overview of this content.',
        podcastLength: length === 'short' ? 'SHORT' : 'STANDARD'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Enterprise Podcast API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json() as any;
    
    // The API returns the podcast audio as base64 or a GCS URI
    const audioId = randomBytes(8).toString('hex');
    const outputFilename = `enterprise_podcast_${audioId}.mp3`;
    const outputPath = path.join(AUDIO_OUTPUT_DIR, outputFilename);

    if (data.podcast?.audioContent) {
      const audioBuffer = Buffer.from(data.podcast.audioContent, 'base64');
      fs.writeFileSync(outputPath, audioBuffer);
    } else if (data.podcast?.audioUri) {
      // It's a GCS URI — store the reference
      return {
        success: true,
        textContent: data.podcast?.transcript || 'Enterprise podcast generated.',
        audioUrl: data.podcast.audioUri,
        attachment: {
          type: 'audio',
          url: data.podcast.audioUri,
          label: 'ACHEEVY Enterprise Podcast'
        },
        executionPath: 'notebooklm_enterprise',
        meta: {
          durationMs: Date.now() - startTime,
          model: 'notebooklm-enterprise-podcast-api'
        }
      };
    }

    return {
      success: true,
      textContent: data.podcast?.transcript || 'Enterprise podcast generated.',
      audioUrl: `/generated_audio/${outputFilename}`,
      attachment: {
        type: 'audio',
        url: `/generated_audio/${outputFilename}`,
        label: 'ACHEEVY Enterprise Podcast'
      },
      executionPath: 'notebooklm_enterprise',
      meta: {
        durationMs: Date.now() - startTime,
        model: 'notebooklm-enterprise-podcast-api'
      }
    };
  } catch (error: any) {
    console.error('[SME_NotebookLM_Ang] Enterprise API failed:', error.message);
    throw error;
  }
}

// =========================================================================
// Briefing Document Generation (Gemini-powered)
// =========================================================================

async function generateBriefingDocument(
  content: string,
  focusPrompt?: string
): Promise<{ briefing: string; tokensUsed: number }> {

  if (!GEMINI_API_KEY) {
    return {
      briefing: generateFallbackBriefing(content),
      tokensUsed: 0
    };
  }

  const systemPrompt = `You are an intelligence analyst creating executive briefing documents. 
Generate a structured briefing document from the provided source material.

Format:
# BRIEFING DOCUMENT
## Classification: INTERNAL USE
## Date: ${new Date().toISOString().split('T')[0]}

### EXECUTIVE SUMMARY
[2-3 sentence overview]

### KEY FINDINGS
[Bullet points of critical information]

### DETAILED ANALYSIS
[Structured analysis sections]

### RECOMMENDATIONS
[Action items]

### SOURCES & CONFIDENCE
[Source attribution and confidence level]
${focusPrompt ? `\nFocus specifically on: ${focusPrompt}` : ''}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nSource Material:\n${content.substring(0, 30000)}` }] }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 4096,
          }
        })
      }
    );

    if (!response.ok) {
      return { briefing: generateFallbackBriefing(content), tokensUsed: 0 };
    }

    const data = await response.json() as any;
    const briefing = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const tokensUsed = data.usageMetadata?.totalTokenCount || 0;

    return { briefing, tokensUsed };
  } catch (error: any) {
    console.error('[SME_NotebookLM_Ang] Briefing generation failed:', error.message);
    return { briefing: generateFallbackBriefing(content), tokensUsed: 0 };
  }
}

// =========================================================================
// FAQ Generation (Gemini-powered)
// =========================================================================

async function generateFAQ(
  content: string,
  focusPrompt?: string
): Promise<{ faq: string; tokensUsed: number }> {

  if (!GEMINI_API_KEY) {
    return { faq: '## FAQ\n\n**Q: What is this document about?**\nA: Please configure GEMINI_API_KEY for AI-generated FAQ.', tokensUsed: 0 };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{
                text: `Generate a comprehensive FAQ document with 8-12 questions and answers based on this source material. Format as markdown with ## headers for each Q&A pair.\n${focusPrompt ? `Focus on: ${focusPrompt}\n` : ''}\nSource:\n${content.substring(0, 25000)}`
              }]
            }
          ],
          generationConfig: { temperature: 0.5, maxOutputTokens: 3000 }
        })
      }
    );

    if (!response.ok) {
      return { faq: 'FAQ generation failed.', tokensUsed: 0 };
    }

    const data = await response.json() as any;
    return {
      faq: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
      tokensUsed: data.usageMetadata?.totalTokenCount || 0
    };
  } catch {
    return { faq: 'FAQ generation error.', tokensUsed: 0 };
  }
}

// =========================================================================
// MAIN ORCHESTRATOR: SME_NotebookLM_Ang.execute()
// =========================================================================

/**
 * Main entry point for the NotebookLM integration.
 * Routes between Enterprise API and Gemini+TTS based on configuration.
 */
export async function executeNotebookLM(request: NotebookLMRequest): Promise<NotebookLMResponse> {
  const startTime = Date.now();
  console.log(`[SME_NotebookLM_Ang] Processing ${request.outputType} request via ${NOTEBOOKLM_ENTERPRISE_ENABLED ? 'Enterprise API' : 'Gemini+TTS'}`);

  // If contentType is URL or YouTube, attempt to fetch the content
  let resolvedContent = request.content;
  if (request.contentType === 'url' || request.contentType === 'youtube') {
    resolvedContent = await fetchUrlContent(request.content);
  }

  // ─── PATH B: Enterprise Podcast API ───
  if (NOTEBOOKLM_ENTERPRISE_ENABLED && request.outputType === 'conversational_audio') {
    try {
      return await generateViaEnterprisePodcastAPI(
        resolvedContent,
        request.focusPrompt,
        request.length
      );
    } catch (error: any) {
      console.warn('[SME_NotebookLM_Ang] Enterprise API failed, falling through to Gemini+TTS path.');
    }
  }

  // ─── PATH A: Gemini + TTS ───
  switch (request.outputType) {
    case 'conversational_audio': {
      const { script, tokensUsed } = await generatePodcastScript(
        resolvedContent,
        request.focusPrompt,
        request.length
      );

      const { audioUrl } = await synthesizeSpeech(script);
      const isAudio = audioUrl.endsWith('.mp3');

      return {
        success: true,
        textContent: script,
        audioUrl,
        attachment: {
          type: isAudio ? 'audio' : 'document',
          url: audioUrl,
          label: isAudio
            ? 'ACHEEVY Conversational Briefing (Audio)'
            : 'ACHEEVY Podcast Script (Text)'
        },
        executionPath: GEMINI_API_KEY ? 'gemini_tts' : 'fallback',
        meta: {
          tokensUsed,
          durationMs: Date.now() - startTime,
          model: GEMINI_API_KEY ? 'gemini-3.1-pro + cloud-tts' : 'fallback-template'
        }
      };
    }

    case 'briefing_doc': {
      const { briefing, tokensUsed } = await generateBriefingDocument(
        resolvedContent,
        request.focusPrompt
      );

      // Save briefing to file
      const briefingId = randomBytes(6).toString('hex');
      const briefingFilename = `briefing_${briefingId}.md`;
      const briefingPath = path.join(AUDIO_OUTPUT_DIR, briefingFilename);
      fs.writeFileSync(briefingPath, briefing, 'utf-8');

      return {
        success: true,
        textContent: briefing,
        attachment: {
          type: 'document',
          url: `/generated_audio/${briefingFilename}`,
          label: `Intelligence Briefing — ${new Date().toLocaleDateString()}`
        },
        executionPath: GEMINI_API_KEY ? 'gemini_tts' : 'fallback',
        meta: {
          tokensUsed,
          durationMs: Date.now() - startTime,
          model: GEMINI_API_KEY ? 'gemini-3.1-pro' : 'fallback-template'
        }
      };
    }

    case 'faq': {
      const { faq, tokensUsed } = await generateFAQ(resolvedContent, request.focusPrompt);

      const faqId = randomBytes(6).toString('hex');
      const faqFilename = `faq_${faqId}.md`;
      const faqPath = path.join(AUDIO_OUTPUT_DIR, faqFilename);
      fs.writeFileSync(faqPath, faq, 'utf-8');

      return {
        success: true,
        textContent: faq,
        attachment: {
          type: 'document',
          url: `/generated_audio/${faqFilename}`,
          label: 'Generated FAQ Document'
        },
        executionPath: GEMINI_API_KEY ? 'gemini_tts' : 'fallback',
        meta: {
          tokensUsed,
          durationMs: Date.now() - startTime,
          model: GEMINI_API_KEY ? 'gemini-3.1-pro' : 'fallback-template'
        }
      };
    }

    default:
      return {
        success: false,
        textContent: `Unknown output type: ${request.outputType}`,
        executionPath: 'fallback',
        meta: { durationMs: Date.now() - startTime }
      };
  }
}

// =========================================================================
// Utilities
// =========================================================================

function splitTextIntoChunks(text: string, maxBytes: number): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if (Buffer.byteLength(current + ' ' + sentence) > maxBytes) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current += ' ' + sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  return chunks;
}

async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) return `[Failed to fetch URL: ${url}]`;
    const text = await response.text();
    // Strip HTML tags for basic content extraction
    return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 50000);
  } catch (error: any) {
    console.error('[SME_NotebookLM_Ang] URL fetch failed:', error.message);
    return `[Could not fetch content from ${url}]`;
  }
}

function generateFallbackScript(content: string, focusPrompt?: string): string {
  const preview = content.substring(0, 500).replace(/\n/g, ' ');
  return `ALEX: Welcome to the ACHEEVY Intelligence Briefing. Today we're diving into some fascinating material.

JORDAN: That's right, Alex. ${focusPrompt ? `We're specifically looking at ${focusPrompt}.` : 'Let me give you the overview.'}

ALEX: So here's what stood out to me from the source material: ${preview}...

JORDAN: That's a great starting point. What I find particularly interesting is the practical implications here.

ALEX: Exactly. And when you connect this back to our operational framework, it becomes even more relevant.

JORDAN: Absolutely. For our listeners, the key takeaway is that this content provides actionable intelligence that directly maps to what we're building.

ALEX: Well said. That wraps up today's briefing. Stay sharp, stay governed.

JORDAN: Until next time. This has been the ACHEEVY Intelligence Briefing.`;
}

function generateFallbackBriefing(content: string): string {
  const preview = content.substring(0, 1000);
  return `# BRIEFING DOCUMENT
## Classification: INTERNAL USE
## Date: ${new Date().toISOString().split('T')[0]}
## Generated by: SME_NotebookLM_Ang (Fallback Mode)

### EXECUTIVE SUMMARY
This briefing was generated in fallback mode. Configure GEMINI_API_KEY for AI-powered analysis.

### SOURCE MATERIAL PREVIEW
${preview}

### RECOMMENDATIONS
- Configure GEMINI_API_KEY environment variable for full AI-powered briefing generation.
- Consider enabling NOTEBOOKLM_ENTERPRISE_ENABLED for premium podcast generation.

### CONFIDENCE LEVEL
LOW — Fallback template used. Full analysis requires API credentials.`;
}
