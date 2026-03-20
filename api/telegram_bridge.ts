import TelegramBot from 'node-telegram-bot-api';
import { insforge } from './insforge';

/**
 * OpenClaw / NemoClaw Telegram Bridge
 * 
 * Chicken Hawk uses this to establish the Remote Control Loop.
 * Allows Chicken Hawk to autonomously send MCP updates (like Blender screenshots)
 * and receive interrupts or prompts remotely from the user.
 */

const token = process.env.TELEGRAM_BOT_TOKEN || '';
let bot: TelegramBot | null = null;

if (token) {
  bot = new TelegramBot(token, { polling: true });

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
    }
  });
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
  } catch (err: any) {
    console.error(`[Telegram Bridge] Failed to send update: ${err.message}`);
  }
}
