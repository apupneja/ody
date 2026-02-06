import { query } from "@anthropic-ai/claude-agent-sdk";
import { AGENT_DEFINITIONS, FORK_RESULT_SCHEMA, VOICE_COMMAND_SCHEMA } from "./agentDefinitions.js";

export async function executeFork(worldState, forkDescription, mainlineEvents) {
  const prompt = `You are the orchestrator for an alternate-history simulation. A user has requested a fork at a point in the timeline.

WORLD STATE (current):
${JSON.stringify(worldState.toJSON(), null, 2)}

USER'S FORK DESCRIPTION: "${forkDescription}"

NEXT 2 MAINLINE EVENTS (for reference, these are what WOULD have happened):
${JSON.stringify(mainlineEvents.map((e) => e.eventSpec), null, 2)}

Execute these steps in order:
1. Use the delta-interpreter agent to convert the user's description into a structured delta object.
2. Apply the delta to the world state mentally (compute the new world state).
3. Use the continuation-generator agent to produce 2 downstream events based on the new world state.
4. Use the plausibility-assessor agent to score the resulting branch.
5. Return the complete result as JSON with: { delta, continuationEvents, branchScores }

The delta must include entityChanges, factChanges, causalVarChanges, and eventSpec.
Each continuation event must include eventSpec, deltas, and timestamp.
branchScores must include plausibility, coherence, and novelty (each 0-100).`;

  let result = null;
  for await (const message of query({
    prompt,
    options: {
      model: "sonnet",
      allowedTools: ["Read", "Grep", "Task"],
      agents: AGENT_DEFINITIONS,
      permissionMode: "bypassPermissions",
      allowDangerouslySkipPermissions: true,
      outputFormat: { type: "json_schema", schema: FORK_RESULT_SCHEMA },
      maxTurns: 20,
      maxBudgetUsd: 0.5,
    },
  })) {
    if (message.type === "result") {
      if (message.subtype === "success") {
        result = message.structured_output ?? JSON.parse(message.result);
      } else {
        const errors = message.errors?.join(", ") || message.subtype;
        throw new Error(`Agent execution failed: ${errors}`);
      }
    }
  }

  if (!result) throw new Error("No result from agent execution");
  return result;
}

export async function generateNarration(eventNode) {
  const prompt = `Use the narrator agent to generate narration for this historical event:

Event: ${eventNode.eventSpec.title}
Description: ${eventNode.eventSpec.description}
Timeline: ${eventNode.branchId === "main" ? "mainline" : "alternate"}
Timestamp: ${eventNode.timestamp}

World context: ${JSON.stringify(eventNode.worldState.toJSON())}

Return only the narration text as plain text, no JSON.`;

  let narration = null;
  for await (const message of query({
    prompt,
    options: {
      model: "sonnet",
      allowedTools: ["Read", "Task"],
      agents: { narrator: AGENT_DEFINITIONS.narrator },
      permissionMode: "bypassPermissions",
      allowDangerouslySkipPermissions: true,
      maxTurns: 5,
      maxBudgetUsd: 0.1,
    },
  })) {
    if (message.type === "result" && message.subtype === "success") {
      narration = message.result;
    }
  }

  return narration ?? "Narration unavailable.";
}

export async function parseVoiceCommand(transcript) {
  let result = null;
  for await (const message of query({
    prompt: `Parse this voice transcript into a structured intent. Determine if the user wants to create a historical fork (alternate history), navigate to an event, or if the intent is unclear.

Transcript: "${transcript}"

Return JSON with: intent ("fork", "navigate", or "unknown"), description (cleaned up version of what they want), targetNodeId (null unless they reference a specific event).`,
    options: {
      model: "haiku",
      allowedTools: [],
      permissionMode: "bypassPermissions",
      allowDangerouslySkipPermissions: true,
      outputFormat: { type: "json_schema", schema: VOICE_COMMAND_SCHEMA },
      maxTurns: 1,
      maxBudgetUsd: 0.02,
    },
  })) {
    if (message.type === "result" && message.subtype === "success") {
      result = message.structured_output ?? JSON.parse(message.result);
    }
  }

  return result ?? { intent: "unknown", description: transcript, targetNodeId: null };
}
