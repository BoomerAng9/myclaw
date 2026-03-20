import { StateGraph, Annotation } from '@langchain/langgraph';
import { GrammarState } from './state';

import { runNTNTN } from './roles/ntntn';
import { runMIM } from './roles/mim';
import { runPickerAng } from './roles/picker_ang';
import { runBoomerAng } from './roles/boomer_ang';
import { runReviewHone } from './roles/review_hone';
import { runBuildSmith } from './roles/buildsmith';
import { runPackaging } from './roles/packaging';

// Define the Graph State Annotation based on our GrammarState interface.
// Using default reducer (overwrite/replace) for top-level keys.
export const GrammarStateAnnotation = Annotation.Root({
  rawIntent: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  normalizedObjective: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  constraints: Annotation<string[]>({
    reducer: (x, y) => y ?? x,
  }),
  inputs: Annotation<any>({
    reducer: (x, y) => y ?? x,
  }),
  blocked: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
  }),
  blockReason: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  contextPack: Annotation<any>({
    reducer: (x, y) => y ?? x,
  }),
  assignedCapability: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  targetProvider: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  estimatedCostTokens: Annotation<number>({
    reducer: (x, y) => y ?? x,
  }),
  boardState: Annotation<'planning' | 'running' | 'review' | 'blocked' | 'approved' | 'packaged' | 'delivered'>({
    reducer: (x, y) => y ?? x,
  }),
  specialistLogs: Annotation<any[]>({
    reducer: (x, y) => y ?? x,
  }),
  currentDraft: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  validationErrors: Annotation<string[]>({
    reducer: (x, y) => y ?? x,
  }),
  hallucinationScore: Annotation<number>({
    reducer: (x, y) => y ?? x,
  }),
  approvedForAssembly: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
  }),
  finalArtifact: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
  manifest: Annotation<any>({
    reducer: (x, y) => y ?? x,
  })
});

// Conditionally route based on whether blocked
const checkBlockedOrProceed = (state: typeof GrammarStateAnnotation.State, nextNode: string) => {
  return state.blocked || state.boardState === 'blocked' ? 'END' : nextNode;
};

// Main Orchestrator Graph
export function compileACHEEVYRuntime() {
  const workflow = new StateGraph(GrammarStateAnnotation)
    .addNode('ntntn', async (state) => await runNTNTN(state as GrammarState))
    .addNode('mim', async (state) => await runMIM(state as GrammarState))
    .addNode('picker', async (state) => await runPickerAng(state as GrammarState))
    .addNode('boomer', async (state) => await runBoomerAng(state as GrammarState))
    .addNode('review', async (state) => await runReviewHone(state as GrammarState))
    .addNode('buildsmith', async (state) => await runBuildSmith(state as GrammarState))
    .addNode('packaging', async (state) => await runPackaging(state as GrammarState))

    // Define edges
    .addEdge('__start__', 'ntntn')
    // NTNTN -> MIM
    .addEdge('ntntn', 'mim')
    
    // MIM -> Picker (if not blocked)
    .addConditionalEdges('mim', (state) => checkBlockedOrProceed(state, 'picker'), {
      'picker': 'picker',
      'END': '__end__'
    })

    // Picker -> Boomer
    .addConditionalEdges('picker', (state) => checkBlockedOrProceed(state, 'boomer'), {
      'boomer': 'boomer',
      'END': '__end__'
    })

    // Boomer -> Review
    .addConditionalEdges('boomer', (state) => checkBlockedOrProceed(state, 'review'), {
      'review': 'review',
      'END': '__end__'
    })

    // Review -> BuildSmith
    .addConditionalEdges('review', (state) => checkBlockedOrProceed(state, 'buildsmith'), {
      'buildsmith': 'buildsmith',
      'END': '__end__'
    })

    // BuildSmith -> Packaging
    .addConditionalEdges('buildsmith', (state) => checkBlockedOrProceed(state, 'packaging'), {
      'packaging': 'packaging',
      'END': '__end__'
    })

    // Final end
    .addEdge('packaging', '__end__');

  return workflow.compile();
}
