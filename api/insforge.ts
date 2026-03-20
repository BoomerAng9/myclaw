import { createClient } from '@supabase/supabase-js'; // InsForge uses identical APIs to Supabase under the hood

/**
 * InsForge Backend Client
 * The user has opted to use InsForge for the backend database for My Claw.
 * InsForge provides PostgreSQL, Auth, Storage, and Realtime capabilities.
 * 
 * Replace these placeholder URLs and keys with your actual InsForge project credentials
 * found by running `insforge current` in the CLI.
 */

const insforgeUrl = process.env.INSFORGE_URL || 'https://api.insforge.dev/v1/your-project';
const insforgeAnonKey = process.env.INSFORGE_ANON_KEY || 'your-anon-key';

export const insforge = createClient(insforgeUrl, insforgeAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  }
});

export const getInsForgeClient = () => insforge;
