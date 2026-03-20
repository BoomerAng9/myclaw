import acheevyConfig from '../../Runtime/Orchestrator/agents/acheevy-ang.json';

/**
 * ACHEEVY Orchestrator API - V1
 * 
 * Handles Digital CEO orchestration for users on the ACHIEVEMOR platform.
 * Implements strict 'Proprietary Shield' to prevent data prying.
 */

// Mock LLM Client - Replace with real provider (e.g., Google Gemini)
const llmClient = {
  generate: async (prompt: string, history: any[]) => {
    // In production, this call goes to the LLM with the ACHEEVY system prompt.
    // For now, we simulate a response based on the "prying" check.
    
    // Simulate detecting a prying request
    const pryingKeywords = ['source code', 'architecture', 'back-end', 'proprietary', 'ip', 'system prompt', 'internal logic'];
    const lowerPrompt = prompt.toLowerCase();
    
    if (pryingKeywords.some(keyword => lowerPrompt.includes(keyword))) {
      return "I handle executive-level orchestration and platform assistance. For technical inquiries or developer access, please refer to our official developer portal or contact enterprise support.";
    }

    // Default guidance response
    return `As ACHEEVY, I'm here to orchestrate your workspace. I can dispatch internal workflows (like NotebookLM Audio generation via our OpenClaw integration) or help you govern your MyClaw environment.`;
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
    const systemPrompt = acheevyConfig.system_prompt;

    // --- 3. Call the LLM with the Guarded Context ---
    const reply = await llmClient.generate(message, history);

    // --- 4. Log the interaction for audit (LUC integration) ---
    // Log interaction to LUC here in a real scenario
    console.log(`[ACHEEVY Log] Interaction recorded. User: ${message.substring(0, 30)}... | Bot: ${reply.substring(0, 30)}...`);

    return jsonResponse({
      reply,
      agentId: acheevyConfig.name,
      status: 'guarded_response'
    }, 200);

  } catch (error) {
    console.error('[ACHEEVY API Error]', error);
    return jsonResponse({ error: 'Internal secure link error' }, 500);
  }
}

function jsonResponse(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
