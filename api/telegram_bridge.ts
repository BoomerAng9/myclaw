import TelegramBot from 'node-telegram-bot-api';
import fs from 'node:fs';
import path from 'node:path';
import { insforge } from './insforge';

/**
 * OpenClaw / NemoClaw Telegram Bridge
 * 
 * Chicken Hawk uses this to establish the Remote Control Loop.
 * Allows Chicken Hawk to autonomously send MCP updates (like Blender screenshots)
 * and receive interrupts or prompts remotely from the user.
 */

const token = process.env.TELEGRAM_BOT_TOKEN || process.env.Telegram_KEY || '';
let bot: TelegramBot | null = null;

const WORKSPACE_PATH_PATTERN = /\/data\/\.openclaw\/workspace\/[^\s)\]]+/g;
const ARTIFACT_FILENAME_PATTERN = /\b[\w.-]+\.(?:md|pdf|csv|tsv|json|txt|png|jpe?g|webp)\b/gi;
const MAX_TELEGRAM_ATTACHMENTS = 10;

if (token) {
  bot = new TelegramBot(token, { polling: true });

  bot.on('polling_error', (error: Error) => {
    console.error(`[Telegram Bridge] Polling error: ${error.message}`);
  });

  bot.on('webhook_error', (error: Error) => {
    console.error(`[Telegram Bridge] Webhook error: ${error.message}`);
  });

  // Listen for user intercepts/commands
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text) return;

    console.log(`[Chicken Hawk] Telegram Directive from ${chatId}: ${text}`);

    // If Chicken Hawk is currently running a massive parallel loop via GRAMMAR
    // We log the intent into the InsForge Pipeline Tasks so ACHEEVY or Chicken Hawk picks it up
    try {
      if (process.env.INSFORGE_URL) {
        await insforge.from('acheevy_tasks').insert({
          objective: text,
          requested_by: `Telegram_Remote_${chatId}`,
          status: 'drafted',
          assigned_role: 'chicken-hawk'
        });
        
        bot?.sendMessage(chatId, `🦅 [Chicken Hawk] Intent logged to OpenClaw Pipeline: "${text}"`);
      } else {
        bot?.sendMessage(chatId, `🦅 [Chicken Hawk] Running locally. Acknowledged: "${text}"`);
      }
    } catch (error: any) {
      console.error('[Telegram Bridge] Failed to inject task:', error.message);
      await bot?.sendMessage(
        chatId,
        `🦅 [Chicken Hawk] I received your message, but the task pipeline failed: ${error.message}`,
      );
    }
  });

  console.log('[Telegram Bridge] Chicken Hawk Telegram bridge started.');
} else {
  console.warn('[Telegram Bridge] No Telegram token found. Bridge remains offline.');
}

function extractArtifactPaths(statusText: string): string[] {
  const explicitPaths = statusText.match(WORKSPACE_PATH_PATTERN) ?? [];
  const artifactDirs = new Set(explicitPaths.map((artifactPath) => path.dirname(artifactPath)));
  const bareFilenames = statusText.match(ARTIFACT_FILENAME_PATTERN) ?? [];
  const resolvedPaths = new Set<string>();

  for (const artifactPath of explicitPaths) {
    if (fs.existsSync(artifactPath) && fs.statSync(artifactPath).isFile()) {
      resolvedPaths.add(artifactPath);
    }
  }

  for (const filename of bareFilenames) {
    if (path.isAbsolute(filename)) {
      continue;
    }

    for (const artifactDir of artifactDirs) {
      const candidatePath = path.join(artifactDir, filename);
      if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
        resolvedPaths.add(candidatePath);
      }
    }
  }

  return Array.from(resolvedPaths).slice(0, MAX_TELEGRAM_ATTACHMENTS);
}

async function sendArtifacts(chatId: string, artifactPaths: string[]) {
  if (!bot || artifactPaths.length === 0) {
    return;
  }

  for (const artifactPath of artifactPaths) {
    await bot.sendDocument(chatId, artifactPath, {
      caption: `Attachment: ${path.basename(artifactPath)}`,
    });
  }
}

/**
 * Called by Chicken Hawk's "mcp-telegram-bridge" skill
 * when a process (like a Blender render) needs to update the user visually.
 */
export async function pushVisualUpdate(chatId: string, imageBuffer: Buffer, caption: string) {
  if (!bot) return;
  try {
    await bot.sendPhoto(chatId, imageBuffer, { caption });
    console.log(`[Chicken Hawk] Sent visual MCP payload to Telegram ${chatId}`);
  } catch (err: any) {
    console.error(`[Telegram Bridge] Failed to send photo: ${err.message}`);
  }
}

/**
 * Called by Chicken Hawk to send text updates when spinning up 'lil_hawks'
 */
export async function pushStatusUpdate(chatId: string, statusText: string) {
  if (!bot) return;
  try {
    await bot.sendMessage(chatId, statusText);
    await sendArtifacts(chatId, extractArtifactPaths(statusText));
  } catch (err: any) {
    console.error(`[Telegram Bridge] Failed to send update: ${err.message}`);
  }
}

export async function pushArtifactUpdate(chatId: string, statusText: string, artifactPaths: string[]) {
  if (!bot) return;
  try {
    await bot.sendMessage(chatId, statusText);
    await sendArtifacts(chatId, artifactPaths.filter((artifactPath) => fs.existsSync(artifactPath)));
  } catch (err: any) {
    console.error(`[Telegram Bridge] Failed to send artifact update: ${err.message}`);
  }
}
