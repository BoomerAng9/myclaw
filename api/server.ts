import express from 'express';
import cors from 'cors';
import { createHash, randomBytes } from 'node:crypto';
import { insforge } from './insforge';
import './telegram_bridge';

// --- MyClaw Internal Types (copied/adapted from governance) ---
interface KYBPayload {
  submissionId: string;
  ownerEmail: string;
  boomerAngName: string;
  outcomeScore: number;
  outcomeLabel: string;
  // ... other fields
}

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3050;

/**
 * KYB Onboarding Bridge
 * This lives on the MYCLAW server. 
 * It catches the local workflow and then logs to the AIMS Central Ledger.
 */
// --- SME_Paperform_Ang Parser ---
const parsePaperformPayload = (body: any): KYBPayload => {
  // If already matches our clean payload
  if (body.ownerEmail && body.boomerAngName) return body;
  
  // If it's a native Paperform webhook
  if (body.data && Array.isArray(body.data.answers)) {
    let email = '';
    let name = '';
    body.data.answers.forEach((ans: any) => {
      const title = (ans.title || '').toLowerCase();
      if (title.includes('email') || title.includes('owner')) email = ans.value;
      if (title.includes('name') || title.includes('boomer')) name = ans.value;
    });
    return {
      submissionId: body.data.submission_id || '',
      ownerEmail: email,
      boomerAngName: name,
      outcomeScore: 0,
      outcomeLabel: 'Pending Review'
    };
  }
  return body;
};

app.post('/v1/kyb-onboard', async (req, res) => {
  try {
    const rawPayload = req.body;
    
    // 1. SME_Paperform_Ang Parsing & Validation
    const payload = parsePaperformPayload(rawPayload);

    if (!payload.ownerEmail || !payload.boomerAngName) {
      return res.status(400).json({ error: 'Missing mandatory identification fields. SME_Paperform_Ang validation failed.' });
    }

    // 2. Generate Local Identifiers
    const inputHash = createHash('sha256').update(JSON.stringify(rawPayload)).digest('hex');
    const serialId = `CLAW-${new Date().getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`;

    // 3. PING THE AIMS SERVER (The Bridge)
    // Here we report the outcome to the central governance brain
    console.log(`[MyClaw Bridge] Reporting registration ${serialId} to AIMS Ledger...`);
    
    let bridged = false;
    let aimsMessage = 'AIMS bridging skipped (no base URL configured)';

    if (process.env.AIMS_API_BASE_URL) {
      try {
        const aimsResponse = await fetch(`${process.env.AIMS_API_BASE_URL}/v1/governed/ledger`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`, 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({ 
            event: 'KYB_REGISTRATION', 
            serialId, 
            inputHash, 
            metadata: payload 
          })
        });

        if (aimsResponse.ok) {
           bridged = true;
           aimsMessage = 'Successfully bridged to AIMS Central Ledger.';
        } else {
           aimsMessage = `AIMS bridge failed with status ${aimsResponse.status}`;
           console.error(`[MyClaw Bridge]`, aimsMessage);
        }
      } catch (e: any) {
         aimsMessage = `AIMS bridge exception: ${e.message}`;
         console.error(`[MyClaw Bridge]`, aimsMessage);
      }
    }

    res.json({
      success: true,
      message: 'MyClaw registration initiated.',
      bridged,
      aimsMessage,
      serialId,
      inputHash
    });
  } catch (error) {
    console.error(`[MyClaw Bridge] Internal error:`, error);
    res.status(500).json({ error: 'MyClaw Internal Server Error' });
  }
});

import { executeNotebookLM, NotebookLMRequest } from './notebooklm';
import * as path from 'node:path';

// The legacy /v1/chat/guide endpoint has been removed.
// Frontend ACHEEVY orchestration is handled locally or via dedicated /v1/acheevy endpoints.
// Media endpoints (NotebookLM, Cinematic) are now strictly internal OpenClaw plugins.

/**
 * ═════════════════════════════════════════════════════════════════
 * DEDICATED NotebookLM REST API Endpoint
 * POST /v1/notebooklm/generate
 * 
 * This is the standalone API-first endpoint for programmatic access.
 * Any Boomer_Ang or external integration can call this directly.
 * ═════════════════════════════════════════════════════════════════
 */
app.post('/v1/notebooklm/generate', async (req, res) => {
  try {
    const { content, contentType, outputType, focusPrompt, length } = req.body as NotebookLMRequest;

    if (!content || !outputType) {
      return res.status(400).json({ error: 'Missing required fields: content, outputType' });
    }

    const result = await executeNotebookLM({
      content,
      contentType: contentType || 'text',
      outputType,
      focusPrompt,
      length: length || 'standard'
    });

    res.json(result);
  } catch (error: any) {
    console.error('[NotebookLM API] Error:', error.message);
    res.status(500).json({ error: 'NotebookLM generation failed.', details: error.message });
  }
});

// Serve generated audio/documents as static files
const audioDir = process.env.AUDIO_OUTPUT_DIR || path.join(process.cwd(), 'generated_audio');
app.use('/generated_audio', express.static(audioDir));

// ═════════════════════════════════════════════════════════════════
// CINEMATIC PIPELINE API
// Supports: Storyboard, Thumbnail Grid, Video Preview, Full Render
// Backends: Veo, Imagen 3, Remotion, Wan 2.5, Seedance
// ═════════════════════════════════════════════════════════════════

import { executeCinematic, CinematicRequest } from './cinematic';

/**
 * POST /v1/cinematic/generate
 * Primary cinematic generation endpoint.
 */
app.post('/v1/cinematic/generate', async (req, res) => {
  try {
    const {
      prompt, scenes, outputType, backend, style,
      customStyle, aspectRatio, targetDurationSec, thumbnailCount
    } = req.body as CinematicRequest;

    if (!prompt && (!scenes || scenes.length === 0)) {
      return res.status(400).json({ error: 'Missing required field: prompt (or scenes array)' });
    }
    if (!outputType) {
      return res.status(400).json({ error: 'Missing required field: outputType (storyboard | thumbnail_grid | video_preview | full_render)' });
    }

    console.log(`[Cinematic API] ${outputType} request — backend: ${backend || 'auto'}, style: ${style || 'cinematic_dark'}`);

    const result = await executeCinematic({
      prompt: prompt || '',
      scenes,
      outputType,
      backend: backend || 'auto',
      style: style || 'cinematic_dark',
      customStyle,
      aspectRatio: aspectRatio || '16:9',
      targetDurationSec: targetDurationSec || 60,
      thumbnailCount
    });

    res.json(result);
  } catch (error: any) {
    console.error('[Cinematic API] Error:', error.message);
    res.status(500).json({ error: 'Cinematic generation failed.', details: error.message });
  }
});

/**
 * POST /v1/cinematic/storyboard
 * Quick endpoint: storyboard-only generation (no rendering).
 */
app.post('/v1/cinematic/storyboard', async (req, res) => {
  try {
    const { prompt, style, targetDurationSec, aspectRatio } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const result = await executeCinematic({
      prompt,
      outputType: 'storyboard',
      style: style || 'cinematic_dark',
      aspectRatio: aspectRatio || '16:9',
      targetDurationSec: targetDurationSec || 60
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: 'Storyboard generation failed.', details: error.message });
  }
});

/**
 * GET /v1/cinematic/poll/:operationId
 * Polls a Veo long-running operation for completion status.
 */
app.get('/v1/cinematic/poll/:operationId', async (req, res) => {
  const { operationId } = req.params;
  const accessToken = process.env.GCP_ACCESS_TOKEN;
  const projectId = process.env.GCP_PROJECT_ID;
  const location = process.env.GCP_LOCATION || 'us-central1';

  if (!accessToken || !projectId) {
    return res.status(503).json({ error: 'GCP credentials not configured.' });
  }

  try {
    const opResponse = await fetch(
      `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/operations/${operationId}`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );

    if (!opResponse.ok) {
      return res.status(opResponse.status).json({ error: await opResponse.text() });
    }

    const opData = await opResponse.json() as any;
    const done = opData.done === true;

    res.json({
      operationId,
      done,
      status: done ? 'COMPLETE' : 'RUNNING',
      result: done ? opData.response : null,
      metadata: opData.metadata || null
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Operation poll failed.', details: error.message });
  }
});

// Serve generated cinematic assets as static files
const cinematicDir = process.env.CINEMATIC_OUTPUT_DIR || path.join(process.cwd(), 'generated_cinematic');
app.use('/generated_cinematic', express.static(cinematicDir));

// --- ACHEEVY Live Dashboard Connection ---
// In a real production setup, this listens to LangGraph events or InsForge Postgres Realtime.
// Here we hold an in-memory execution DAG state to prove the full-stack visualization loop works.
let acheevyState = {
  activeNode: 'idle',
  logs: [] as string[],
  objective: '',
  nodes: {
    acheevy: { status: 'idle', tasks: 14, grade: 'A+' },
    ntntn: { status: 'idle', tasks: 22, grade: 'A+' },
    mim: { status: 'idle', tasks: 18, grade: 'A+' },
    picker: { status: 'idle', tasks: 31, grade: 'A' },
    'sme-notebooklm': { status: 'idle', tasks: 3, grade: 'A' },
    scripter: { status: 'idle', tasks: 5, grade: 'B+' },
    cinematic: { status: 'idle', tasks: 2, grade: 'A' },
    review: { status: 'idle', tasks: 19, grade: 'A+' },
    packaging: { status: 'idle', tasks: 6, grade: 'A+' }
  }
};

app.get('/v1/acheevy/state', (req, res) => {
  res.json(acheevyState);
});

app.post('/v1/acheevy/simulate', (req, res) => {
  const { task, intent } = req.body;
  const targetTask = intent || task;
  if (acheevyState.activeNode !== 'idle' && acheevyState.activeNode !== 'packaging') {
    return res.status(400).json({ error: 'Pipeline already running.' });
  }

  // Reset state
  Object.keys(acheevyState.nodes).forEach(k => {
    (acheevyState.nodes as any)[k].status = 'standby';
  });
  acheevyState.logs = [`[ACHEEVY] Intent received: ${targetTask}`];
  acheevyState.objective = targetTask;
  acheevyState.activeNode = 'acheevy';
  (acheevyState.nodes as any)['acheevy'].status = 'active';

  res.json({ success: true, message: 'Pipeline started.' });

  // Background execution loop simulating the DAG
  let step = 0;
  const sequence = [
    { node: 'ntntn', log: 'NTNTN normalizing intent schemas & extracting parameters...', delay: 2000 },
    { node: 'mim', log: 'MIM checking policy bounds & injecting context...', delay: 2000 },
    { node: 'picker', log: 'Picker_Ang routing task to capability class...', delay: 2500 },
    { node: 'sme-notebooklm', log: 'SME_NotebookLM_Ang generating audio intelligence via Gemini 3.1 Pro...', delay: 3500 },
    { node: 'scripter', log: 'Scripter_Ang composing cinematic storyboard (scene breakdown)...', delay: 4000 },
    { node: 'cinematic', log: 'Cinematic Pipeline rendering via Veo + Imagen 3 + Remotion...', delay: 5000 },
    { node: 'review', log: 'Review / Hone gating output for security & brand tones...', delay: 3000 },
    { node: 'packaging', log: 'BuildSmith Packaging compiling final deploy bundle.', delay: 2000 }
  ];

  const advance = async () => {
    if (step >= sequence.length) {
      if (acheevyState.activeNode !== 'idle') {
        (acheevyState.nodes as any)[acheevyState.activeNode].status = 'complete';
      }
      acheevyState.activeNode = 'idle';
      acheevyState.logs.unshift('[SUCCESS] Pipeline completed successfully.');
      
      // Fuse: Update final state in InsForge
      if (process.env.INSFORGE_URL) {
        try {
           await insforge.from('acheevy_pipeline_runs').insert({
             active_node: 'idle',
             status: 'complete',
             log_message: 'Pipeline completed successfully.'
           });
        } catch(e) {}
      }
      return;
    }

    const current = sequence[step];
    // mark previous complete
    if (acheevyState.activeNode && (acheevyState.nodes as any)[acheevyState.activeNode]) {
      (acheevyState.nodes as any)[acheevyState.activeNode].status = 'complete';
    }

    acheevyState.activeNode = current.node;
    (acheevyState.nodes as any)[current.node].status = 'active';
    acheevyState.logs.unshift(`[${current.node.toUpperCase()}] ${current.log}`);
    
    // increment tasks done for this node loosely
    (acheevyState.nodes as any)[current.node].tasks += 1;

    // Fuse: Update live execution node tracking in InsForge Database
    if (process.env.INSFORGE_URL) {
      try {
         await insforge.from('acheevy_node_logs').insert([
            { node_id: current.node, log_message: current.log }
         ]);
      } catch(e) {}
    }

    step++;
    setTimeout(advance, current.delay);
  };

  setTimeout(advance, 1500); // initial start wait
});

// ═══════════════════════════════════════════════════════════════
// LUC (Ledger Usage Calculator) Gate Endpoint
// ═══════════════════════════════════════════════════════════════
import { LucEngine } from './services/luc-engine';

app.post('/v1/luc/gate', async (req, res) => {
  const { tenantId, serviceKey, amount, actionId } = req.body;

  if (!tenantId || !serviceKey || amount === undefined) {
    return res.status(400).json({ error: 'Missing tenantId, serviceKey, or amount.' });
  }

  try {
    const luc = new LucEngine(tenantId);

    // In production, load from InsForge. For now, load defaults.
    await luc.loadQuotas([
      { key: 'tokens_in', used: 0, limit: 1_000_000, unit: 'tokens' },
      { key: 'tokens_out', used: 0, limit: 500_000, unit: 'tokens' },
      { key: 'voice_minutes', used: 0, limit: 120, unit: 'minutes' },
      { key: 'container_hours', used: 0, limit: 50, unit: 'hours' },
      { key: 'storage_gb', used: 0, limit: 10, unit: 'GB' },
    ]);

    // 1. Estimate
    const estimate = luc.estimate(serviceKey, amount);

    // 2. Gate
    const gate = luc.canExecute(serviceKey, amount);

    if (!gate.allowed) {
      return res.status(403).json({ gate, estimate });
    }

    // 3. Record (only if allowed)
    const record = luc.recordUsage(serviceKey, amount, actionId || 'unknown');

    return res.json({ gate, estimate, record, snapshot: luc.getSnapshot() });
  } catch (err: any) {
    console.error('[LUC Gate] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// Voice-First Full Loop Endpoint
// ═══════════════════════════════════════════════════════════════
import { VoiceVisionBridge } from './services/voice-vision-bridge';

app.post('/v1/voice/loop', async (req, res) => {
  const { audioBase64, provider } = req.body;

  if (!audioBase64) {
    return res.status(400).json({ error: 'Missing audioBase64 payload.' });
  }

  try {
    const bridge = new VoiceVisionBridge({
      provider: provider || 'elevenlabs',
      apiKey: process.env.VOICE_API_KEY || '',
    });

    const audioBuffer = Buffer.from(audioBase64, 'base64');

    const result = await bridge.fullLoop(audioBuffer, async (transcribedText: string) => {
      // Forward the transcribed text to Gemini for reasoning
      const geminiKey = process.env.GEMINI_API_KEY || '';
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: transcribedText }] }],
          }),
        }
      );
      const data = await response.json() as any;
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not process that.';
    });

    return res.json({
      transcription: result.transcription.text,
      response: result.response,
      speechBase64: result.speech.audioBuffer.toString('base64'),
      latencyMs: result.transcription.durationMs + result.speech.durationMs,
    });
  } catch (err: any) {
    console.error('[Voice Loop] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 MyClaw API Server running on port ${PORT}`);
});
