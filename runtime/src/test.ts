import { compileACHEEVYRuntime } from './acheevy';

async function runTest() {
  const runner = compileACHEEVYRuntime();
  
  console.log("Starting ACHEEVY Runtime execution...");
  
  const initialState = {
    rawIntent: "Build a chat-first interface using real-time websockets",
    boardState: "planning" as const,
  };

  const finalState = await runner.invoke(initialState);
  
  console.log("\n--- Final State ---");
  console.log(JSON.stringify(finalState, null, 2));
}

runTest().catch(console.error);
