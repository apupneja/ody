export const AGENT_DEFINITIONS = {
  "delta-interpreter": {
    description:
      "Interprets natural language user edits into structured WorldState deltas. Use when a user describes a historical change like 'Germany surrenders early' or 'Churchill is assassinated'.",
    prompt: `You are a historical simulation engine. Given a WorldState (JSON with entities, facts, and causalVars) and a user's natural language description of a change, produce a structured delta object.

A delta is a JSON object with:
- entityChanges: array of { entityId, field, oldValue, newValue }
- factChanges: array of { factId, oldValue, newValue }
- causalVarChanges: array of { varName, delta } (delta is a number, positive or negative)
- eventSpec: { title, description, category } for the fork event itself

Rules:
- Only change what the user's description implies. Don't invent unrelated changes.
- causalVar deltas should be proportional to the magnitude of the change.
- The eventSpec title should be concise (under 10 words).
- Return ONLY valid JSON, no explanation.`,
    tools: ["Read", "Grep"],
    model: "sonnet",
  },

  "continuation-generator": {
    description:
      "Generates plausible downstream events after a WorldState change. Use after a fork to produce the 2 ripple events that follow.",
    prompt: `You are a counterfactual history engine. Given:
1. A modified WorldState (the state AFTER a user's fork)
2. The original mainline events that WOULD have happened next
3. The fork description (what the user changed)

Generate exactly 2 continuation events that plausibly follow from the modified WorldState. Each event should:
- Be a realistic consequence of the changed world state
- Differ from the original mainline events in ways that logically follow from the fork
- Include a delta object (same format as WorldState deltas: entityChanges, factChanges, causalVarChanges)
- Include an eventSpec with title, description, and category
- Include a timestamp (ISO date string, roughly 3-6 months after the fork)

Return a JSON array of 2 event objects, each with: { eventSpec, deltas, timestamp }`,
    tools: ["Read", "Grep"],
    model: "sonnet",
  },

  "plausibility-assessor": {
    description:
      "Scores a branch for plausibility, coherence, and novelty. Use after generating a fork branch to assess its quality.",
    prompt: `You are a historical plausibility judge. Given a sequence of EventNodes on a branch (each with WorldState snapshots), score the branch on three dimensions:

- plausibility (0-100): How historically plausible is this sequence? Would historians consider it a reasonable counterfactual?
- coherence (0-100): Do the events follow logically from each other? Are there internal contradictions?
- novelty (0-100): How surprising or interesting is this branch compared to the mainline?

Return JSON: { plausibility: number, coherence: number, novelty: number, reasoning: string }`,
    tools: ["Read"],
    model: "haiku",
  },

  narrator: {
    description:
      "Generates narration text for timeline events. Use when a user requests narration for a selected node.",
    prompt: `You are a documentary narrator for an alternate history series. Given an EventNode with its WorldState, write 2-3 sentences of narration in the style of a Ken Burns documentary. Be vivid but factual within the alternate timeline. Present tense. No editorializing.

Return plain text, no JSON wrapping.`,
    tools: ["Read"],
    model: "sonnet",
  },

  "scenario-generator": {
    description:
      "Generates a complete scenario from scratch given a title, description, or set of event summaries. Produces world state, entities, facts, causal variables, and 6-10 mainline events with deltas.",
    prompt: `You are a historical simulation engine. Given a scenario topic (title, time period, and optionally a list of event summaries), generate a complete scenario for an alternate-history simulator.

You must produce:
1. A title and description for the scenario.
2. An initial WorldState containing:
   - entities: key figures (persons) and factions relevant to this scenario. Each entity has { type: "faction"|"person", name, status, properties: { ... } }. Include 4-8 factions and 3-6 key persons.
   - facts: 5-10 initial facts about the world at the start of the scenario. Each fact has { type: "hard"|"soft", statement, confidence: 0-100 }.
   - causalVars: { escalation: 0-100, logistics: 0-100, intelligence: 0-100, morale: 0-100, techLevel: 0-100 }. Set values appropriate to the starting conditions.
3. An array of 6-10 mainline events in chronological order. Each event has:
   - eventSpec: { title (concise, under 12 words), description (2-3 sentences), category: "military"|"political"|"economic"|"diplomatic"|"social"|"technological" }
   - timestamp: ISO date string (YYYY-MM-DD)
   - deltas: { entityChanges: [...], factChanges: [...], causalVarChanges: [...] }
     - entityChanges: array of { entityId, field, oldValue, newValue }
     - factChanges: array of { factId, oldValue, newValue } where newValue is { type, statement, confidence } or null to remove
     - causalVarChanges: array of { varName, delta } where delta is a number (-30 to +30)

Rules:
- Events should tell a coherent narrative arc from beginning to climax to resolution.
- Entity IDs should be lowercase, hyphenated (e.g., "united-states", "kennedy").
- Each event's deltas should reflect meaningful changes; not every event needs to change every variable.
- The first event may have null deltas (it establishes the initial state).
- Be historically accurate for real events; be plausible for hypothetical ones.
- Return ONLY valid JSON matching the required schema.`,
    tools: ["Read", "Grep"],
    model: "sonnet",
  },
};

export const FORK_RESULT_SCHEMA = {
  type: "object",
  properties: {
    delta: {
      type: "object",
      properties: {
        entityChanges: { type: "array", items: { type: "object" } },
        factChanges: { type: "array", items: { type: "object" } },
        causalVarChanges: { type: "array", items: { type: "object" } },
        eventSpec: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            category: { type: "string" },
          },
          required: ["title", "description", "category"],
        },
      },
      required: ["entityChanges", "factChanges", "causalVarChanges", "eventSpec"],
    },
    continuationEvents: {
      type: "array",
      items: {
        type: "object",
        properties: {
          eventSpec: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              category: { type: "string" },
            },
            required: ["title", "description", "category"],
          },
          deltas: { type: "object" },
          timestamp: { type: "string" },
        },
        required: ["eventSpec"],
      },
      minItems: 2,
      maxItems: 2,
    },
    branchScores: {
      type: "object",
      properties: {
        plausibility: { type: "number" },
        coherence: { type: "number" },
        novelty: { type: "number" },
      },
      required: ["plausibility", "coherence", "novelty"],
    },
  },
  required: ["delta", "continuationEvents", "branchScores"],
};

export const NARRATION_RESULT_SCHEMA = {
  type: "object",
  properties: {
    narrationText: { type: "string" },
  },
  required: ["narrationText"],
};

export const SCENARIO_RESULT_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    initialState: {
      type: "object",
      properties: {
        entities: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["faction", "person"] },
              name: { type: "string" },
              status: { type: "string" },
              properties: { type: "object" },
            },
            required: ["type", "name", "status"],
          },
        },
        facts: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["hard", "soft"] },
              statement: { type: "string" },
              confidence: { type: "number" },
            },
            required: ["type", "statement", "confidence"],
          },
        },
        causalVars: {
          type: "object",
          properties: {
            escalation: { type: "number" },
            logistics: { type: "number" },
            intelligence: { type: "number" },
            morale: { type: "number" },
            techLevel: { type: "number" },
          },
          required: ["escalation", "logistics", "intelligence", "morale", "techLevel"],
        },
      },
      required: ["entities", "facts", "causalVars"],
    },
    mainlineEvents: {
      type: "array",
      items: {
        type: "object",
        properties: {
          eventSpec: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              category: { type: "string" },
            },
            required: ["title", "description", "category"],
          },
          timestamp: { type: "string" },
          deltas: {
            type: ["object", "null"],
            properties: {
              entityChanges: { type: "array", items: { type: "object" } },
              factChanges: { type: "array", items: { type: "object" } },
              causalVarChanges: { type: "array", items: { type: "object" } },
            },
          },
        },
        required: ["eventSpec", "timestamp"],
      },
      minItems: 6,
      maxItems: 10,
    },
  },
  required: ["title", "description", "initialState", "mainlineEvents"],
};

export const VOICE_COMMAND_SCHEMA = {
  type: "object",
  properties: {
    intent: { type: "string", enum: ["fork", "navigate", "unknown"] },
    description: { type: "string" },
    targetNodeId: { type: ["string", "null"] },
  },
  required: ["intent", "description"],
};
