import { compileACHEEVYRuntime } from '../acheevy';
import { GrammarState } from '../state';

describe('ACHEEVY Runtime DAG', () => {
  it('should process a valid intent entirely through to delivery', async () => {
    const runner = compileACHEEVYRuntime();
    
    // We start the graph from the NTNTN node
    const initialState = {
      rawIntent: "Write a unit test for the main function",
      boardState: "planning" as const,
    };

    const finalState = await runner.invoke(initialState) as GrammarState;

    expect(finalState).toBeDefined();
    
    // Verify State Transitions
    expect(finalState.normalizedObjective).toContain('Normalized: Write a unit test');
    expect(finalState.boardState).toBe('delivered');
    
    // Check Outputs of roles
    expect(finalState.contextPack).toBeDefined();
    expect(finalState.contextPack?.approved).toBe(true);
    
    expect(finalState.currentDraft).toContain('[Draft generated via'); // from Boomer_Ang
    expect(finalState.approvedForAssembly).toBe(true); // from Review_Hone
    expect(finalState.finalArtifact).toBeDefined(); // from BuildSmith
    expect(finalState.manifest).toBeDefined(); // from Packaging
    expect(finalState.manifest?.serialId).toBeDefined();
  });
});
