import { query } from "@anthropic-ai/claude-agent-sdk";
import { WorldState } from "../models/WorldState.js";
import { StoryGraph } from "../models/StoryGraph.js";
import { EventNode } from "../models/EventNode.js";
import { RenderPack } from "../models/RenderPack.js";

const BASE_RULES = `You are a world-building AI for "Ripple", a historical scenario simulator.
Be historically accurate and detailed.`;

// --- Schemas for each generation phase ---

const ACTORS_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    factions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          code: { type: "string" },
          name: { type: "string" },
          status: { type: "string" },
          leader: { type: ["string", "null"] },
        },
        required: ["code", "name", "status"],
      },
    },
    persons: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          role: { type: "string" },
          nation: { type: "string" },
        },
        required: ["name", "role", "nation"],
      },
    },
  },
  required: ["title", "description", "factions", "persons"],
};

const WORLD_STATE_SCHEMA = {
  type: "object",
  properties: {
    facts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          text: { type: "string" },
          type: { type: "string", enum: ["hard", "soft"] },
        },
        required: ["id", "text", "type"],
      },
    },
    causalVars: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          label: { type: "string" },
          value: { type: "number" },
        },
        required: ["key", "label", "value"],
      },
    },
  },
  required: ["facts", "causalVars"],
};

const TIMELINE_SCHEMA = {
  type: "object",
  properties: {
    events: {
      type: "array",
      items: {
        type: "object",
        properties: {
          date: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          cat: { type: "string" },
        },
        required: ["date", "title", "description", "cat"],
      },
    },
  },
  required: ["events"],
};

// --- Individual generation functions ---

async function runQuery(prompt, schema) {
  let result = null;
  for await (const message of query({
    prompt,
    options: {
      model: "sonnet",
      allowedTools: [],
      permissionMode: "bypassPermissions",
      allowDangerouslySkipPermissions: true,
      outputFormat: { type: "json_schema", schema },
      maxTurns: 3,
      maxBudgetUsd: 0.3,
    },
  })) {
    if (message.type === "result") {
      if (message.subtype === "success") {
        result = message.structured_output ?? JSON.parse(message.result);
      } else {
        const errors = message.errors?.join(", ") || message.subtype;
        throw new Error(`Generation failed: ${errors}`);
      }
    }
  }
  if (!result) throw new Error("No result from query");
  return result;
}

export async function generateActors(prompt) {
  console.log("[GenerateService] Phase 1: Generating actors for:", prompt);
  const result = await runQuery(
    `${BASE_RULES}

Given this historical scenario: "${prompt}"

Generate:
- A short title for this scenario
- A 1-2 sentence description
- 6-10 factions/nations/organizations involved with realistic statuses
- 3-7 key historical figures with their roles and affiliations

Rules:
- Status values: aggressive, at-war, neutral, invaded, allied, defending, occupied, retreating, defeated, victorious
- 3-letter uppercase codes for factions (e.g., USA, GER, CHN)

Return structured JSON.`,
    ACTORS_SCHEMA
  );
  console.log("[GenerateService] Actors done:", result.title, `(${result.factions?.length} factions, ${result.persons?.length} persons)`);
  return result;
}

export async function generateWorldState(prompt, actorContext) {
  console.log("[GenerateService] Phase 2: Generating world state");
  const factionNames = actorContext.factions.map((f) => `${f.code}: ${f.name}`).join(", ");
  const result = await runQuery(
    `${BASE_RULES}

Scenario: "${prompt}"
Factions involved: ${factionNames}

Generate:
- 6-10 facts about the initial world state (hard = established certainty, soft = probable/uncertain)
- Exactly 5 causal variables relevant to the scenario, each with a value from 0 to 100

Rules:
- kebab-case ids for facts (e.g., "allied-invasion-planning")
- camelCase keys for causal variables (e.g., escalation, morale, techLevel)

Return structured JSON.`,
    WORLD_STATE_SCHEMA
  );
  console.log("[GenerateService] World state done:", `(${result.facts?.length} facts, ${result.causalVars?.length} vars)`);
  return result;
}

export async function generateTimeline(prompt, actorContext) {
  console.log("[GenerateService] Phase 3: Generating timeline");
  const factionNames = actorContext.factions.map((f) => `${f.code}: ${f.name}`).join(", ");
  const result = await runQuery(
    `${BASE_RULES}

Scenario: "${prompt}"
Title: ${actorContext.title}
Factions involved: ${factionNames}

Generate 8-12 timeline events in strict chronological order covering the key moments of this scenario.

Rules:
- Use YYYY.MM.DD format for all dates
- Category values: military, political, economic, social, technological
- Each event needs a title and detailed description

Return structured JSON.`,
    TIMELINE_SCHEMA
  );
  console.log("[GenerateService] Timeline done:", `(${result.events?.length} events)`);
  return result;
}

export function buildScenarioFromGenerated(data) {
  const graph = new StoryGraph();
  const renderPacks = new Map();

  // Build initial entities from factions + persons
  const entities = {};
  for (const f of data.factions) {
    entities[f.code.toLowerCase()] = {
      type: "faction",
      name: f.name,
      status: f.status,
      properties: { leader: f.leader || null },
    };
  }
  for (const p of data.persons) {
    const id = p.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    entities[id] = {
      type: "person",
      name: p.name,
      status: "alive",
      properties: { role: p.role, nation: p.nation },
    };
  }

  // Build initial facts
  const facts = {};
  for (const f of data.facts) {
    facts[f.id] = { type: f.type, statement: f.text, confidence: f.type === "hard" ? 100 : 85 };
  }

  // Build causal vars
  const causalVars = {};
  for (const v of data.causalVars) {
    causalVars[v.key] = Math.max(0, Math.min(100, v.value));
  }

  const initialState = new WorldState({ entities, facts, causalVars });

  // Build event nodes
  let currentState = initialState;
  const nodes = data.events.map((evt, i) => {
    const nodeId = `gen-${i}`;
    const timestamp = evt.date.replace(/\./g, "-");

    const node = new EventNode({
      id: nodeId,
      parentId: i > 0 ? `gen-${i - 1}` : null,
      branchId: "main",
      timestamp,
      eventSpec: { title: evt.title, description: evt.description, category: evt.cat },
      deltas: null,
      worldState: currentState,
      isUserFork: false,
    });

    graph.addNode(node);

    const rp = new RenderPack({
      eventNodeId: node.id,
      sceneBible: `[${evt.cat.toUpperCase()}] ${evt.title}\n\n${evt.description}`,
    });
    node.renderPackId = rp.id;
    renderPacks.set(rp.id, rp);

    return node;
  });

  return {
    graph,
    renderPacks,
    precomputedBranches: [],
    title: data.title,
    description: data.description,
  };
}
