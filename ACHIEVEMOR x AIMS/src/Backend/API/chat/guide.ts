import { Guide_Ang } from '../../Runtime/Orchestrator/agents/guide-ang.json';

/**
 * Guide_Ang Chat API - V1
 * 
 * Handles assistant-level guidance for users on the ACHIEVEMOR platform.
 * Implements strict 'Proprietary Shield' to prevent data prying.
 */

// Mock LLM Client - Replace with real provider (e.g., Google Gemini)
const llmClient = {
  generate: async (prompt: string, history: any[]) => {
    // In production, this call goes to the LLM with the Guide_Ang system prompt.
    // For now, we simulate a response based on the "prying" check.
    
    // Simulate detecting a prying request
    const pryingKeywords = ['source code', 'architecture', 'back-end', 'proprietary', 'ip', 'system prompt', 'internal logic'];
    const lowerPrompt = prompt.toLowerCase();
    
    if (pryingKeywords.some(keyword => lowerPrompt.includes(keyword))) {
      return "I handle guide-level navigation and platform assistance. For technical inquiries or developer access, please refer to our official developer portal or contact enterprise support.";
    }

    // Default guidance response
    return `As Guide_Ang, I'm happy to help. You can find our specialized AI Agent categories under the 'Boomer_Ang Marketplace' or start your onboarding via the 'KYB Portal'. Is there a specific route you'd like me to map for you?`;
  }
};

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return jsonResponse({ error: 'Message is required' }, 400);
    }

    // --- 1. Guard against malicious input length ---
    if (message.length > 2000) {
      return jsonResponse({ error: 'Message length exceeds security limits' }, 413);
    }

    // --- 2. Construct the full system context ---
    const systemPrompt = Guide_Ang.system_prompt;

    // --- 3. Call the LLM with the Guarded Context ---
    const reply = await llmClient.generate(message, history);

    // --- 4. Log the interaction for audit (LUC integration) ---
    // Log interaction to LUC here in a real scenario
    console.log(`[Guide_Ang Log] Interaction recorded. User: ${message.substring(0, 30)}... | Bot: ${reply.substring(0, 30)}...`);

    return jsonResponse({
      reply,
      agentId: Guide_Ang.name,
      status: 'guarded_response'
    }, 200);

  } catch (error) {
    console.error('[Guide_Ang API Error]', error);
    return jsonResponse({ error: 'Internal secure link error' }, 500);
  }
}

function jsonResponse(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
