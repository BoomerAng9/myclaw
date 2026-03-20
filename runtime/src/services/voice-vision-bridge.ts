/**
 * Voice-First + Vision-First Bridge
 *
 * The accessibility and interaction layer for Chicken Hawk / SuperClaw.
 * Implements the core loop: STT → LLM Reasoning → TTS
 * Plus delta screenshot ingestion with spoken descriptions.
 *
 * Provider-agnostic: supports Grok Voice, NVIDIA PersonaPlex, ElevenLabs.
 */

// ─── Types ──────────────────────────────────────────────────────

export type VoiceProvider = 'grok' | 'personaplex' | 'elevenlabs';

export interface VoiceConfig {
  provider: VoiceProvider;
  apiKey: string;
  voiceId?: string;       // ElevenLabs-specific voice selection
  language?: string;      // Default: 'en'
  sttModel?: string;      // STT model override
  ttsModel?: string;      // TTS model override
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  durationMs: number;
  provider: VoiceProvider;
}

export interface SpeechResult {
  audioBuffer: Buffer;
  durationMs: number;
  provider: VoiceProvider;
}

export interface DeltaScreenshot {
  imageBuffer: Buffer;
  timestamp: string;
  description?: string;   // Spoken description of what changed
  region?: string;        // e.g. 'full', 'viewport', 'selection'
}

export interface VisionAnalysis {
  description: string;
  changes: string[];
  actionSuggestions: string[];
}

// ─── Provider Adapter Interface ─────────────────────────────────

interface VoiceProviderAdapter {
  transcribe(audioBuffer: Buffer): Promise<TranscriptionResult>;
  synthesize(text: string): Promise<SpeechResult>;
}

// ─── Provider Implementations ───────────────────────────────────

class ElevenLabsAdapter implements VoiceProviderAdapter {
  private apiKey: string;
  private voiceId: string;

  constructor(config: VoiceConfig) {
    this.apiKey = config.apiKey;
    this.voiceId = config.voiceId || 'default';
  }

  async transcribe(audioBuffer: Buffer): Promise<TranscriptionResult> {
    const start = Date.now();
    // ElevenLabs STT endpoint
    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio: audioBuffer.toString('base64'),
        model_id: 'scribe_v1',
      }),
    });
    const data = await response.json() as any;
    return {
      text: data.text || '',
      confidence: data.confidence || 0.9,
      durationMs: Date.now() - start,
      provider: 'elevenlabs',
    };
  }

  async synthesize(text: string): Promise<SpeechResult> {
    const start = Date.now();
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
      }),
    });
    const arrayBuf = await response.arrayBuffer();
    return {
      audioBuffer: Buffer.from(arrayBuf),
      durationMs: Date.now() - start,
      provider: 'elevenlabs',
    };
  }
}

class GrokVoiceAdapter implements VoiceProviderAdapter {
  private apiKey: string;

  constructor(config: VoiceConfig) {
    this.apiKey = config.apiKey;
  }

  async transcribe(audioBuffer: Buffer): Promise<TranscriptionResult> {
    const start = Date.now();
    const response = await fetch('https://api.x.ai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio: audioBuffer.toString('base64'),
        model: 'grok-2-audio',
      }),
    });
    const data = await response.json() as any;
    return {
      text: data.text || '',
      confidence: data.confidence || 0.85,
      durationMs: Date.now() - start,
      provider: 'grok',
    };
  }

  async synthesize(text: string): Promise<SpeechResult> {
    const start = Date.now();
    const response = await fetch('https://api.x.ai/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: text, model: 'grok-2-audio', voice: 'alloy' }),
    });
    const arrayBuf = await response.arrayBuffer();
    return {
      audioBuffer: Buffer.from(arrayBuf),
      durationMs: Date.now() - start,
      provider: 'grok',
    };
  }
}

class PersonaPlexAdapter implements VoiceProviderAdapter {
  private apiKey: string;

  constructor(config: VoiceConfig) {
    this.apiKey = config.apiKey;
  }

  async transcribe(audioBuffer: Buffer): Promise<TranscriptionResult> {
    const start = Date.now();
    // NVIDIA PersonaPlex NIM endpoint
    const response = await fetch('https://integrate.api.nvidia.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio: audioBuffer.toString('base64'),
        model: 'nvidia/personaplex',
      }),
    });
    const data = await response.json() as any;
    return {
      text: data.text || '',
      confidence: 0.9,
      durationMs: Date.now() - start,
      provider: 'personaplex',
    };
  }

  async synthesize(text: string): Promise<SpeechResult> {
    const start = Date.now();
    const response = await fetch('https://integrate.api.nvidia.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: text, model: 'nvidia/personaplex' }),
    });
    const arrayBuf = await response.arrayBuffer();
    return {
      audioBuffer: Buffer.from(arrayBuf),
      durationMs: Date.now() - start,
      provider: 'personaplex',
    };
  }
}

// ─── Main Bridge ────────────────────────────────────────────────

export class VoiceVisionBridge {
  private adapter: VoiceProviderAdapter;
  private config: VoiceConfig;

  constructor(config: VoiceConfig) {
    this.config = config;

    switch (config.provider) {
      case 'elevenlabs':
        this.adapter = new ElevenLabsAdapter(config);
        break;
      case 'grok':
        this.adapter = new GrokVoiceAdapter(config);
        break;
      case 'personaplex':
        this.adapter = new PersonaPlexAdapter(config);
        break;
      default:
        throw new Error(`[VoiceVisionBridge] Unknown provider: ${config.provider}`);
    }

    console.log(`[VoiceVisionBridge] Initialized with provider: ${config.provider}`);
  }

  /**
   * STT: Transcribe raw audio into text for the LLM reasoning layer.
   */
  async transcribe(audioBuffer: Buffer): Promise<TranscriptionResult> {
    console.log(`[VoiceVisionBridge] Transcribing ${audioBuffer.length} bytes via ${this.config.provider}...`);
    const result = await this.adapter.transcribe(audioBuffer);
    console.log(`[VoiceVisionBridge] Transcribed in ${result.durationMs}ms: "${result.text.substring(0, 80)}..."`);
    return result;
  }

  /**
   * TTS: Synthesize LLM reasoning output back into audible speech.
   */
  async speak(text: string): Promise<SpeechResult> {
    console.log(`[VoiceVisionBridge] Synthesizing ${text.length} chars via ${this.config.provider}...`);
    const result = await this.adapter.synthesize(text);
    console.log(`[VoiceVisionBridge] Speech generated in ${result.durationMs}ms (${result.audioBuffer.length} bytes)`);
    return result;
  }

  /**
   * Vision: Analyze a delta screenshot and produce a spoken description.
   * Uses the Gemini vision model to interpret what changed on screen.
   */
  async analyzeDeltaScreenshot(screenshot: DeltaScreenshot): Promise<VisionAnalysis> {
    console.log(`[VoiceVisionBridge] Analyzing delta screenshot (${screenshot.imageBuffer.length} bytes)...`);

    // Send to Gemini 3.1 Pro vision endpoint
    const geminiKey = process.env.GEMINI_API_KEY || '';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `You are the vision layer for a Voice-First AI assistant. Analyze this screenshot and describe what changed on the screen. Be concise and actionable. Previous context: ${screenshot.description || 'none'}`,
              },
              {
                inline_data: {
                  mime_type: 'image/png',
                  data: screenshot.imageBuffer.toString('base64'),
                },
              },
            ],
          }],
        }),
      }
    );

    const data = await response.json() as any;
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to analyze screenshot.';

    return {
      description: rawText,
      changes: [rawText],
      actionSuggestions: [],
    };
  }

  /**
   * Full Loop: STT → Process → TTS
   * Takes raw audio, transcribes it, runs the processor callback,
   * and returns synthesized speech of the result.
   */
  async fullLoop(
    audioBuffer: Buffer,
    processor: (text: string) => Promise<string>
  ): Promise<{ transcription: TranscriptionResult; response: string; speech: SpeechResult }> {
    // 1. STT
    const transcription = await this.transcribe(audioBuffer);

    // 2. LLM Reasoning (via callback)
    const response = await processor(transcription.text);

    // 3. TTS
    const speech = await this.speak(response);

    console.log(`[VoiceVisionBridge] Full loop complete: ${transcription.durationMs + speech.durationMs}ms total latency`);

    return { transcription, response, speech };
  }
}
