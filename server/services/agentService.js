let orchestrator;

if (process.env.ANTHROPIC_API_KEY) {
  try {
    orchestrator = await import("../agents/orchestrator.js");
    console.log("[AgentService] Using real Claude orchestrator");
  } catch (err) {
    console.warn("[AgentService] Failed to load real orchestrator, falling back to mock:", err.message);
    orchestrator = await import("../agents/mockOrchestrator.js");
  }
} else {
  orchestrator = await import("../agents/mockOrchestrator.js");
  console.log("[AgentService] No ANTHROPIC_API_KEY, using mock orchestrator");
}

export async function executeFork(worldState, forkDescription, mainlineEvents) {
  try {
    return await orchestrator.executeFork(worldState, forkDescription, mainlineEvents);
  } catch (err) {
    console.error("[AgentService] Real orchestrator failed, falling back to mock:", err.message);
    const mock = await import("../agents/mockOrchestrator.js");
    const result = await mock.executeFork(worldState, forkDescription, mainlineEvents);
    return { ...result, fallbackUsed: true };
  }
}

export async function generateNarration(eventNode) {
  try {
    return await orchestrator.generateNarration(eventNode);
  } catch (err) {
    console.error("[AgentService] Narration failed, using mock:", err.message);
    const mock = await import("../agents/mockOrchestrator.js");
    return await mock.generateNarration(eventNode);
  }
}

export async function parseVoiceCommand(transcript) {
  try {
    return await orchestrator.parseVoiceCommand(transcript);
  } catch (err) {
    console.error("[AgentService] Voice parse failed, using mock:", err.message);
    const mock = await import("../agents/mockOrchestrator.js");
    return await mock.parseVoiceCommand(transcript);
  }
}

export async function generateImagePrompt(eventNode) {
  try {
    return await orchestrator.generateImagePrompt(eventNode);
  } catch (err) {
    console.error("[AgentService] Image prompt failed, using mock:", err.message);
    const mock = await import("../agents/mockOrchestrator.js");
    return await mock.generateImagePrompt(eventNode);
  }
}

export async function generateVideoPrompt(eventNode) {
  try {
    return await orchestrator.generateVideoPrompt(eventNode);
  } catch (err) {
    console.error("[AgentService] Video prompt failed, using mock:", err.message);
    const mock = await import("../agents/mockOrchestrator.js");
    return await mock.generateVideoPrompt(eventNode);
  }
}

export async function generateScenario(params) {
  try {
    return await orchestrator.generateScenario(params);
  } catch (err) {
    console.error("[AgentService] Scenario generation failed, falling back to mock:", err.message);
    const mock = await import("../agents/mockOrchestrator.js");
    const result = await mock.generateScenario(params);
    return { ...result, fallbackUsed: true };
  }
}
