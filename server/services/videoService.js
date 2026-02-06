import * as agentService from "./agentService.js";

const ODYSSEY_API_KEY = process.env.ODYSSEY_API_KEY;

if (ODYSSEY_API_KEY) {
  console.log("[VideoService] Odyssey.ml configured");
} else {
  console.log("[VideoService] No ODYSSEY_API_KEY, video streaming disabled");
}

export async function createVideoSession(eventNode) {
  if (!ODYSSEY_API_KEY) {
    return { available: false, reason: "ODYSSEY_API_KEY not configured" };
  }

  try {
    const videoPrompt = await agentService.generateVideoPrompt(eventNode);

    return {
      available: true,
      apiKey: ODYSSEY_API_KEY,
      prompt: videoPrompt,
      portrait: false,
      eventNodeId: eventNode.id,
    };
  } catch (err) {
    console.error("[VideoService] Session creation failed:", err.message);
    return { available: false, reason: err.message };
  }
}
