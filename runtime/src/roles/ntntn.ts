import { GrammarState } from '../state';

/**
 * NTNTN Role: Frames and normalizes intent.
 * Interprets the real objective, strips marketing, identifies true value.
 */
export async function runNTNTN(state: GrammarState): Promise<Partial<GrammarState>> {
  console.log('[NTNTN] Normalizing intent:', state.rawIntent);
  
  // In a real implementation, this would call an LLM structured output to extract fields.
  const normalizedObjective = `Normalized: ${state.rawIntent}`;
  const constraints = ['Must be API-first', 'Must be evidence-backed'];
  
  return {
    normalizedObjective,
    constraints,
    boardState: 'planning'
  };
}
