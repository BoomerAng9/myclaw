/**
 * Cinematic Pipeline Module — ACHEEVY Video & Visual Intelligence
 * 
 * Orchestrates multi-backend video and cinematic content generation.
 * Scripter_Ang produces structured storyboards → this module renders them.
 * 
 * SUPPORTED BACKENDS:
 *   1. Veo (Google Gemini) — AI video generation from text prompts
 *   2. Imagen 3 (Google) — High-fidelity image generation for stills/thumbnails
 *   3. Remotion — Programmatic React-based video composition
 *   4. Wan 2.5 / Seedance 2.0 — External high-fidelity rendering (webhook-driven)
 * 
 * ROUTING: Picker_Ang decides backend via capability+cost analysis.
 *   Quick preview → Veo. Branded template → Remotion. Cinematic quality → Wan 2.5.
 */

import { randomBytes } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';

// =========================================================================
// Types
// =========================================================================

export interface CinematicScene {
  sceneId: string;
  /** Scene description / visual direction */
  description: string;
  /** Dialogue or voice-over text */
  voiceover?: string;
  /** Duration in seconds */
  durationSec: number;
  /** Visual style instructions */
  style?: string;
  /** Camera direction (e.g., "slow zoom in", "aerial pan left") */
  camera?: string;
  /** Background music mood */
  musicMood?: string;
}

export interface CinematicRequest {
  /** High-level prompt or content to generate cinematic from */
  prompt: string;
  /** Pre-built scene array (skip script generation if provided) */
  scenes?: CinematicScene[];
  /** What type of cinematic output */
  outputType: 'storyboard' | 'video_preview' | 'thumbnail_grid' | 'full_render';
  /** Target rendering backend */
  backend?: 'veo' | 'imagen' | 'remotion' | 'wan25' | 'seedance' | 'auto';
  /** Visual style preset */
  style?: 'cinematic_dark' | 'corporate' | 'anime' | 'documentary' | 'custom';
  /** Custom style instructions (when style is 'custom') */
  customStyle?: string;
  /** Output aspect ratio */
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:3';
  /** Target duration in seconds (for video outputs) */
  targetDurationSec?: number;
  /** Number of thumbnail images (for thumbnail_grid) */
  thumbnailCount?: number;
}

export interface CinematicResponse {
  success: boolean;
  /** Generated storyboard (always present) */
  storyboard: {
    title: string;
    scenes: CinematicScene[];
    totalDurationSec: number;
    renderingTarget: string;
  };
  /** Generated media outputs */
  outputs: CinematicOutput[];
  /** Which backend was used */
  backend: string;
  /** Processing metadata */
  meta: {
    tokensUsed?: number;
    durationMs: number;
    model: string;
    estimatedCost?: string;
  };
}

export interface CinematicOutput {
  type: 'video' | 'image' | 'storyboard_json' | 'remotion_bundle';
  url: string;
  label: string;
  mimeType: string;
  sceneId?: string;
}

// =========================================================================
// Configuration
// =========================================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID || '';
const GCP_LOCATION = process.env.GCP_LOCATION || 'us-central1';
const GCP_ACCESS_TOKEN = process.env.GCP_ACCESS_TOKEN || '';

const CINEMATIC_OUTPUT_DIR = process.env.CINEMATIC_OUTPUT_DIR || path.join(process.cwd(), 'generated_cinematic');
const CINEMATIC_SERVE_PATH = '/generated_cinematic';

// Webhook endpoints for external renderers
const WAN25_WEBHOOK_URL = process.env.WAN25_WEBHOOK_URL || '';
const SEEDANCE_WEBHOOK_URL = process.env.SEEDANCE_WEBHOOK_URL || '';

// Ensure output directory exists
if (!fs.existsSync(CINEMATIC_OUTPUT_DIR)) {
  fs.mkdirSync(CINEMATIC_OUTPUT_DIR, { recursive: true });
}

// =========================================================================
// STEP 1: Storyboard Generation (Gemini 3.1 Pro)
// =========================================================================

/**
 * Uses Gemini 3.1 Pro to generate a structured scene-by-scene storyboard
 * from a freeform prompt. Returns typed CinematicScene[].
 */
async function generateStoryboard(
  prompt: string,
  style: string = 'cinematic_dark',
  targetDurationSec: number = 60,
  aspectRatio: string = '16:9'
): Promise<{ title: string; scenes: CinematicScene[]; tokensUsed: number }> {

  const sceneCount = Math.max(3, Math.ceil(targetDurationSec / 8));

  const systemPrompt = `You are the ACHEEVY Cinematic Director. You produce structured storyboards for AI video generation pipelines.

OUTPUT FORMAT (strict JSON, no markdown):
{
  "title": "string",
  "scenes": [
    {
      "sceneId": "scene_01",
      "description": "Visual description of what appears on screen",
      "voiceover": "Narration text for this scene",
      "durationSec": 8,
      "style": "${style}",
      "camera": "Camera movement instruction",
      "musicMood": "ambient | dramatic | upbeat | none"
    }
  ]
}

RULES:
- Generate exactly ${sceneCount} scenes
- Total duration must be approximately ${targetDurationSec} seconds
- Aspect ratio: ${aspectRatio}
- Style: ${style} — apply consistently across all scenes
- Each scene description must be vivid enough for an AI image/video model to render
- Camera directions should be specific: "slow dolly forward", "aerial establishing shot", "close-up rack focus"
- Include smooth transitions between scenes
- First scene must be an establishing shot. Last scene must be a closing/summary shot.`;

  if (!GEMINI_API_KEY) {
    return {
      title: 'ACHEEVY Cinematic Preview',
      scenes: generateFallbackStoryboard(prompt, sceneCount, style),
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
          contents: [{
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nGenerate a cinematic storyboard for:\n${prompt}` }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      console.error('[Cinematic] Gemini storyboard generation failed:', await response.text());
      return {
        title: 'ACHEEVY Cinematic Preview',
        scenes: generateFallbackStoryboard(prompt, sceneCount, style),
        tokensUsed: 0
      };
    }

    const data = await response.json() as any;
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const tokensUsed = data.usageMetadata?.totalTokenCount || 0;

    try {
      const parsed = JSON.parse(rawText);
      return {
        title: parsed.title || 'ACHEEVY Cinematic',
        scenes: (parsed.scenes || []).map((s: any, i: number) => ({
          sceneId: s.sceneId || `scene_${String(i + 1).padStart(2, '0')}`,
          description: s.description || '',
          voiceover: s.voiceover || '',
          durationSec: s.durationSec || 8,
          style: s.style || style,
          camera: s.camera || 'static',
          musicMood: s.musicMood || 'ambient'
        })),
        tokensUsed
      };
    } catch {
      return {
        title: 'ACHEEVY Cinematic Preview',
        scenes: generateFallbackStoryboard(prompt, sceneCount, style),
        tokensUsed
      };
    }
  } catch (error: any) {
    console.error('[Cinematic] Storyboard generation error:', error.message);
    return {
      title: 'ACHEEVY Cinematic Preview',
      scenes: generateFallbackStoryboard(prompt, sceneCount, style),
      tokensUsed: 0
    };
  }
}

// =========================================================================
// STEP 2: Imagen 3 — Stills & Thumbnail Generation
// =========================================================================

/**
 * Generates images from scene descriptions using Imagen 3 via Vertex AI.
 * Used for thumbnails, stills, and storyboard visualization.
 */
async function generateSceneImage(
  sceneDescription: string,
  style: string,
  aspectRatio: string = '16:9',
  outputLabel: string = 'scene'
): Promise<CinematicOutput | null> {

  const imageId = randomBytes(6).toString('hex');
  const outputFilename = `${outputLabel}_${imageId}.png`;
  const outputPath = path.join(CINEMATIC_OUTPUT_DIR, outputFilename);

  if (!GCP_ACCESS_TOKEN || !GCP_PROJECT_ID) {
    // Fallback: save the prompt as a text directive
    const directivePath = path.join(CINEMATIC_OUTPUT_DIR, `${outputLabel}_${imageId}.txt`);
    fs.writeFileSync(directivePath, `[IMAGEN 3 DIRECTIVE]\nStyle: ${style}\nAspect: ${aspectRatio}\n\n${sceneDescription}`, 'utf-8');
    return {
      type: 'image',
      url: `${CINEMATIC_SERVE_PATH}/${outputLabel}_${imageId}.txt`,
      label: `${outputLabel} (directive)`,
      mimeType: 'text/plain'
    };
  }

  try {
    // Vertex AI Imagen 3 endpoint
    const endpoint = `https://${GCP_LOCATION}-aiplatform.googleapis.com/v1/projects/${GCP_PROJECT_ID}/locations/${GCP_LOCATION}/publishers/google/models/imagen-3.0-generate-002:predict`;

    const imagenResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GCP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        instances: [{
          prompt: `${style} style. ${sceneDescription}. Professional cinematic quality, ${aspectRatio} aspect ratio.`
        }],
        parameters: {
          sampleCount: 1,
          aspectRatio: aspectRatio.replace(':', ':'),
          safetyFilterLevel: 'block_few',
          personGeneration: 'allow_all'
        }
      })
    });

    if (!imagenResponse.ok) {
      const errText = await imagenResponse.text();
      console.error('[Cinematic] Imagen 3 error:', errText);
      return null;
    }

    const imagenData = await imagenResponse.json() as any;
    const b64Image = imagenData.predictions?.[0]?.bytesBase64Encoded;

    if (b64Image) {
      const imageBuffer = Buffer.from(b64Image, 'base64');
      fs.writeFileSync(outputPath, imageBuffer);
      return {
        type: 'image',
        url: `${CINEMATIC_SERVE_PATH}/${outputFilename}`,
        label: outputLabel,
        mimeType: 'image/png'
      };
    }

    return null;
  } catch (error: any) {
    console.error('[Cinematic] Imagen generation failed:', error.message);
    return null;
  }
}

// =========================================================================
// STEP 3: Veo — AI Video Generation
// =========================================================================

/**
 * Generates short video clips from scene descriptions using Veo (Gemini Video).
 * Each scene becomes a ~5-8 second video clip.
 */
async function generateSceneVideo(
  sceneDescription: string,
  style: string,
  durationSec: number = 8,
  aspectRatio: string = '16:9'
): Promise<CinematicOutput | null> {

  const videoId = randomBytes(6).toString('hex');

  if (!GCP_ACCESS_TOKEN || !GCP_PROJECT_ID) {
    // Fallback: save render directive
    const directivePath = path.join(CINEMATIC_OUTPUT_DIR, `veo_directive_${videoId}.json`);
    fs.writeFileSync(directivePath, JSON.stringify({
      engine: 'veo',
      prompt: sceneDescription,
      style,
      durationSec,
      aspectRatio,
      timestamp: new Date().toISOString()
    }, null, 2), 'utf-8');

    return {
      type: 'video',
      url: `${CINEMATIC_SERVE_PATH}/veo_directive_${videoId}.json`,
      label: 'Veo Render Directive',
      mimeType: 'application/json'
    };
  }

  try {
    // Vertex AI Veo endpoint
    const endpoint = `https://${GCP_LOCATION}-aiplatform.googleapis.com/v1/projects/${GCP_PROJECT_ID}/locations/${GCP_LOCATION}/publishers/google/models/veo-002:predictLongRunning`;

    const veoResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GCP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        instances: [{
          prompt: `${style} cinematic. ${sceneDescription}. Professional film quality.`
        }],
        parameters: {
          aspectRatio,
          durationSeconds: Math.min(durationSec, 8), // Veo max per clip
          numberOfVideos: 1,
          personGeneration: 'allow_all',
          conditioningOptions: {
            answer: 'accept'
          }
        }
      })
    });

    if (!veoResponse.ok) {
      const errText = await veoResponse.text();
      console.error('[Cinematic] Veo error:', errText);
      return null;
    }

    const veoData = await veoResponse.json() as any;
    
    // Veo returns a long-running operation
    const operationName = veoData.name;
    if (operationName) {
      // Store operation reference for polling
      const opRefPath = path.join(CINEMATIC_OUTPUT_DIR, `veo_op_${videoId}.json`);
      fs.writeFileSync(opRefPath, JSON.stringify({
        operationName,
        status: 'RUNNING',
        sceneDescription,
        createdAt: new Date().toISOString()
      }, null, 2), 'utf-8');

      return {
        type: 'video',
        url: `${CINEMATIC_SERVE_PATH}/veo_op_${videoId}.json`,
        label: `Veo Render (${operationName.split('/').pop()})`,
        mimeType: 'application/json',
      };
    }

    // If immediate result (unlikely for video)
    const videoUri = veoData.predictions?.[0]?.videoUri;
    if (videoUri) {
      return {
        type: 'video',
        url: videoUri,
        label: 'Generated Video',
        mimeType: 'video/mp4'
      };
    }

    return null;
  } catch (error: any) {
    console.error('[Cinematic] Veo generation failed:', error.message);
    return null;
  }
}

// =========================================================================
// STEP 4: Remotion Bundle Generation
// =========================================================================

/**
 * Generates a Remotion-compatible composition JSON that the frontend
 * or a renderMedia() call can consume to produce programmatic video.
 */
function generateRemotionBundle(
  storyboard: { title: string; scenes: CinematicScene[] },
  aspectRatio: string = '16:9'
): CinematicOutput {
  
  const bundleId = randomBytes(6).toString('hex');
  const bundleFilename = `remotion_bundle_${bundleId}.json`;
  const bundlePath = path.join(CINEMATIC_OUTPUT_DIR, bundleFilename);

  const [w, h] = aspectRatio === '9:16' ? [1080, 1920] 
    : aspectRatio === '1:1' ? [1080, 1080] 
    : aspectRatio === '4:3' ? [1440, 1080] 
    : [1920, 1080];

  const fps = 30;
  let currentFrame = 0;

  const composition = {
    id: `acheevy-cinematic-${bundleId}`,
    width: w,
    height: h,
    fps,
    durationInFrames: storyboard.scenes.reduce((sum, s) => sum + (s.durationSec * fps), 0),
    title: storyboard.title,
    sequences: storyboard.scenes.map((scene, i) => {
      const frameDuration = scene.durationSec * fps;
      const sequence = {
        id: scene.sceneId,
        from: currentFrame,
        durationInFrames: frameDuration,
        type: 'scene' as const,
        props: {
          description: scene.description,
          voiceover: scene.voiceover || '',
          camera: scene.camera || 'static',
          musicMood: scene.musicMood || 'ambient',
          style: scene.style || 'cinematic_dark',
          transitionIn: i === 0 ? 'fade_from_black' : 'crossfade',
          transitionOut: i === storyboard.scenes.length - 1 ? 'fade_to_black' : 'crossfade',
          transitionDuration: fps // 1 second transitions
        }
      };
      currentFrame += frameDuration;
      return sequence;
    }),
    metadata: {
      generatedBy: 'ACHEEVY Cinematic Pipeline',
      generatedAt: new Date().toISOString(),
      renderEngine: 'remotion',
      version: '1.0.0'
    }
  };

  fs.writeFileSync(bundlePath, JSON.stringify(composition, null, 2), 'utf-8');

  return {
    type: 'remotion_bundle',
    url: `${CINEMATIC_SERVE_PATH}/${bundleFilename}`,
    label: `Remotion Composition (${storyboard.scenes.length} scenes, ${Math.round(currentFrame / fps)}s)`,
    mimeType: 'application/json'
  };
}

// =========================================================================
// STEP 5: External Renderer Webhook Dispatch (Wan 2.5 / Seedance)
// =========================================================================

/**
 * Dispatches a storyboard to an external high-fidelity renderer
 * via webhook. Results arrive asynchronously.
 */
async function dispatchToExternalRenderer(
  storyboard: { title: string; scenes: CinematicScene[] },
  backend: 'wan25' | 'seedance'
): Promise<CinematicOutput | null> {

  const webhookUrl = backend === 'wan25' ? WAN25_WEBHOOK_URL : SEEDANCE_WEBHOOK_URL;
  
  if (!webhookUrl) {
    const dispatchId = randomBytes(6).toString('hex');
    const directivePath = path.join(CINEMATIC_OUTPUT_DIR, `${backend}_dispatch_${dispatchId}.json`);
    fs.writeFileSync(directivePath, JSON.stringify({
      backend,
      status: 'QUEUED_NO_WEBHOOK',
      storyboard,
      message: `Configure ${backend === 'wan25' ? 'WAN25_WEBHOOK_URL' : 'SEEDANCE_WEBHOOK_URL'} to enable external rendering.`,
      timestamp: new Date().toISOString()
    }, null, 2), 'utf-8');

    return {
      type: 'video',
      url: `${CINEMATIC_SERVE_PATH}/${backend}_dispatch_${dispatchId}.json`,
      label: `${backend.toUpperCase()} Dispatch (webhook not configured)`,
      mimeType: 'application/json'
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'acheevy-cinematic-pipeline',
        storyboard,
        callbackUrl: process.env.CINEMATIC_CALLBACK_URL || '',
        priority: 'normal'
      })
    });

    if (!response.ok) {
      console.error(`[Cinematic] ${backend} webhook failed:`, await response.text());
      return null;
    }

    const result = await response.json() as any;
    return {
      type: 'video',
      url: result.statusUrl || result.jobUrl || '#',
      label: `${backend.toUpperCase()} Render Job (${result.jobId || 'submitted'})`,
      mimeType: 'application/json'
    };
  } catch (error: any) {
    console.error(`[Cinematic] ${backend} dispatch failed:`, error.message);
    return null;
  }
}

// =========================================================================
// MAIN ORCHESTRATOR: executeCinematic()
// =========================================================================

/**
 * Primary entry point for the cinematic pipeline.
 * Routes between backends based on outputType and explicit backend selection.
 */
export async function executeCinematic(request: CinematicRequest): Promise<CinematicResponse> {
  const startTime = Date.now();
  const backend = request.backend || 'auto';
  const style = request.customStyle || request.style || 'cinematic_dark';
  const aspectRatio = request.aspectRatio || '16:9';

  console.log(`[Cinematic] Processing ${request.outputType} request (backend: ${backend}, style: ${style})`);

  // ─── Step 1: Generate or use provided storyboard ───
  let storyboard: { title: string; scenes: CinematicScene[]; tokensUsed: number };

  if (request.scenes && request.scenes.length > 0) {
    storyboard = {
      title: 'Custom Storyboard',
      scenes: request.scenes,
      tokensUsed: 0
    };
  } else {
    storyboard = await generateStoryboard(
      request.prompt,
      style,
      request.targetDurationSec || 60,
      aspectRatio
    );
  }

  const totalDuration = storyboard.scenes.reduce((sum, s) => sum + s.durationSec, 0);
  const outputs: CinematicOutput[] = [];

  // ─── Always include the storyboard JSON as an output ───
  const storyboardId = randomBytes(4).toString('hex');
  const storyboardPath = path.join(CINEMATIC_OUTPUT_DIR, `storyboard_${storyboardId}.json`);
  fs.writeFileSync(storyboardPath, JSON.stringify({
    title: storyboard.title,
    scenes: storyboard.scenes,
    totalDurationSec: totalDuration,
    style,
    aspectRatio
  }, null, 2), 'utf-8');

  outputs.push({
    type: 'storyboard_json',
    url: `${CINEMATIC_SERVE_PATH}/storyboard_${storyboardId}.json`,
    label: `Storyboard — ${storyboard.scenes.length} scenes, ${totalDuration}s`,
    mimeType: 'application/json'
  });

  // ─── Route by outputType ───
  const resolvedBackend = resolveBackend(backend, request.outputType);

  switch (request.outputType) {
    case 'storyboard':
      // Storyboard only — already added above
      break;

    case 'thumbnail_grid': {
      const count = request.thumbnailCount || Math.min(storyboard.scenes.length, 6);
      const selectedScenes = storyboard.scenes.slice(0, count);
      
      for (let i = 0; i < selectedScenes.length; i++) {
        const scene = selectedScenes[i];
        const img = await generateSceneImage(
          scene.description,
          style,
          aspectRatio,
          `thumb_${scene.sceneId}`
        );
        if (img) outputs.push(img);
      }
      break;
    }

    case 'video_preview': {
      // Generate video for the first 2-3 key scenes
      const previewScenes = storyboard.scenes.slice(0, 3);
      
      if (resolvedBackend === 'veo') {
        for (const scene of previewScenes) {
          const vid = await generateSceneVideo(scene.description, style, scene.durationSec, aspectRatio);
          if (vid) {
            vid.sceneId = scene.sceneId;
            outputs.push(vid);
          }
        }
      }

      // Also generate Remotion bundle as a fallback/alternative
      outputs.push(generateRemotionBundle({ title: storyboard.title, scenes: previewScenes }, aspectRatio));
      break;
    }

    case 'full_render': {
      switch (resolvedBackend) {
        case 'remotion':
          outputs.push(generateRemotionBundle({ title: storyboard.title, scenes: storyboard.scenes }, aspectRatio));
          break;

        case 'veo':
          for (const scene of storyboard.scenes) {
            const vid = await generateSceneVideo(scene.description, style, scene.durationSec, aspectRatio);
            if (vid) {
              vid.sceneId = scene.sceneId;
              outputs.push(vid);
            }
          }
          // Also generate Remotion bundle for local composition
          outputs.push(generateRemotionBundle({ title: storyboard.title, scenes: storyboard.scenes }, aspectRatio));
          break;

        case 'wan25':
        case 'seedance': {
          const extResult = await dispatchToExternalRenderer(
            { title: storyboard.title, scenes: storyboard.scenes },
            resolvedBackend
          );
          if (extResult) outputs.push(extResult);
          // Always produce Remotion bundle as local fallback
          outputs.push(generateRemotionBundle({ title: storyboard.title, scenes: storyboard.scenes }, aspectRatio));
          break;
        }

        default:
          // Auto: Remotion bundle + thumbnail grid
          outputs.push(generateRemotionBundle({ title: storyboard.title, scenes: storyboard.scenes }, aspectRatio));
          for (const scene of storyboard.scenes.slice(0, 4)) {
            const img = await generateSceneImage(scene.description, style, aspectRatio, `scene_${scene.sceneId}`);
            if (img) outputs.push(img);
          }
      }
      break;
    }
  }

  return {
    success: true,
    storyboard: {
      title: storyboard.title,
      scenes: storyboard.scenes,
      totalDurationSec: totalDuration,
      renderingTarget: resolvedBackend
    },
    outputs,
    backend: resolvedBackend,
    meta: {
      tokensUsed: storyboard.tokensUsed,
      durationMs: Date.now() - startTime,
      model: GEMINI_API_KEY ? 'gemini-3.1-pro' : 'fallback',
      estimatedCost: estimateCost(request.outputType, storyboard.scenes.length, resolvedBackend)
    }
  };
}

// =========================================================================
// Utilities
// =========================================================================

function resolveBackend(requested: string, outputType: string): string {
  if (requested !== 'auto') return requested;

  switch (outputType) {
    case 'storyboard': return 'gemini';
    case 'thumbnail_grid': return 'imagen';
    case 'video_preview': return 'veo';
    case 'full_render': return 'remotion';
    default: return 'remotion';
  }
}

function estimateCost(outputType: string, sceneCount: number, backend: string): string {
  // Rough cost estimates for LUC tracking
  const costs: Record<string, number> = {
    storyboard: 0.01,         // Gemini only
    thumbnail_grid: sceneCount * 0.04,  // Imagen per image
    video_preview: sceneCount * 0.25,   // Veo per clip
    full_render: sceneCount * 0.50      // Full render
  };
  const base = costs[outputType] || 0.10;
  const multiplier = backend === 'wan25' || backend === 'seedance' ? 2.0 : 1.0;
  return `$${(base * multiplier).toFixed(2)}`;
}

function generateFallbackStoryboard(prompt: string, sceneCount: number, style: string): CinematicScene[] {
  const preview = prompt.substring(0, 200);
  const scenes: CinematicScene[] = [];

  const templates = [
    { camera: 'slow aerial establishing shot', music: 'ambient', desc: 'Wide establishing shot revealing the environment' },
    { camera: 'medium dolly forward', music: 'dramatic', desc: 'Key subject introduction with dramatic lighting' },
    { camera: 'close-up with rack focus', music: 'ambient', desc: 'Detail shot of the core concept' },
    { camera: 'tracking shot left to right', music: 'upbeat', desc: 'Dynamic motion revealing context' },
    { camera: 'bird\'s eye rotating', music: 'dramatic', desc: 'Overhead view of the working system' },
    { camera: 'slow zoom in', music: 'ambient', desc: 'Intimate focus on the key outcome' },
    { camera: 'static wide with depth of field', music: 'dramatic', desc: 'Final summary composition' },
    { camera: 'slow pull back to wide', music: 'ambient', desc: 'Closing shot pulling away to reveal the full picture' }
  ];

  for (let i = 0; i < sceneCount; i++) {
    const t = templates[i % templates.length];
    scenes.push({
      sceneId: `scene_${String(i + 1).padStart(2, '0')}`,
      description: `${t.desc}. Context: ${preview}`,
      voiceover: i === 0 ? `Welcome to ${prompt.substring(0, 50)}...` : '',
      durationSec: 8,
      style,
      camera: t.camera,
      musicMood: t.music
    });
  }

  return scenes;
}
