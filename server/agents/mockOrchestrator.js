let cachedPrecomputedBranches = null;

export function setPrecomputedBranches(branches) {
  cachedPrecomputedBranches = branches;
}

export async function executeFork(worldState, forkDescription, mainlineEvents) {
  const match = findPrecomputedMatch(forkDescription);
  if (match) {
    return buildResultFromPrecomputed(match, worldState);
  }

  const delta = generateKeywordDelta(forkDescription, worldState);
  const newWorldState = worldState.applyDelta(delta);
  const continuations = generateTemplateContinuations(forkDescription, newWorldState, mainlineEvents);

  return {
    delta: { ...delta, eventSpec: generateEventSpec(forkDescription) },
    continuationEvents: continuations,
    branchScores: { plausibility: 65, coherence: 75, novelty: 55 },
  };
}

export async function generateNarration(eventNode) {
  const { title, description } = eventNode.eventSpec;
  const isAlt = eventNode.branchId !== "main";
  if (isAlt) {
    return `In this alternate timeline, ${title.toLowerCase()} reshapes the course of history. ${description} The consequences ripple outward, altering the fates of nations.`;
  }
  return `${title}. ${description} The world watches as events unfold that will define a generation.`;
}

export async function generateImagePrompt(eventNode) {
  const { title, description, category } = eventNode.eventSpec;
  const isAlt = eventNode.branchId !== "main";
  const timeline = isAlt ? "alternate history" : "historical";
  return `Photorealistic ${timeline} scene depicting ${title}. ${description}. Cinematic lighting, documentary photography style, 16:9 aspect ratio, dramatic atmosphere, ${category} event from ${eventNode.timestamp}.`;
}

export async function generateVideoPrompt(eventNode) {
  const { title, description } = eventNode.eventSpec;
  return `Historical scene of ${title}. ${description}. Camera slowly panning across the scene, dramatic lighting, documentary style.`;
}

export async function parseVoiceCommand(transcript) {
  const forkKeywords = ["what if", "imagine", "suppose", "instead", "had", "never", "alternate"];
  const lower = transcript.toLowerCase();
  const hasForkIntent = forkKeywords.some((kw) => lower.includes(kw));
  const description = transcript.replace(/^(what if|imagine|suppose|instead)\s*/i, "").trim();

  return {
    intent: hasForkIntent ? "fork" : "unknown",
    description: description || transcript,
    targetNodeId: null,
  };
}

function findPrecomputedMatch(description) {
  if (!cachedPrecomputedBranches) return null;
  const descLower = description.toLowerCase();

  let bestMatch = null;
  let bestScore = 0;

  for (const { eventNodeId, branches } of cachedPrecomputedBranches) {
    for (const branch of branches) {
      if (!branch.matchKeywords) continue;
      const matchScore = branch.matchKeywords.filter((kw) => descLower.includes(kw.toLowerCase())).length;
      if (matchScore >= 2 && matchScore > bestScore) {
        bestMatch = { ...branch, eventNodeId };
        bestScore = matchScore;
      }
    }
  }

  return bestMatch;
}

function buildResultFromPrecomputed(match, worldState) {
  const delta = {
    ...match.forkDelta,
    eventSpec: match.forkEventSpec,
  };

  const continuationEvents = match.continuations.map((cont) => ({
    eventSpec: cont.eventSpec,
    deltas: cont.deltas || { entityChanges: [], factChanges: [], causalVarChanges: [] },
    timestamp: cont.timestamp,
  }));

  return {
    delta,
    continuationEvents,
    branchScores: match.branchPriors,
  };
}

function generateKeywordDelta(description, worldState) {
  const lower = description.toLowerCase();
  const entityChanges = [];
  const factChanges = [];
  const causalVarChanges = [];

  if (lower.includes("surrender") || lower.includes("capitulate") || lower.includes("gives up")) {
    const faction = findMentionedFaction(lower, worldState);
    if (faction) {
      entityChanges.push({ entityId: faction, field: "status", oldValue: worldState.entities[faction]?.status, newValue: "surrendered" });
      causalVarChanges.push({ varName: "escalation", delta: -15 });
      causalVarChanges.push({ varName: "morale", delta: 10 });
      factChanges.push({ factId: `${faction}-surrender`, oldValue: null, newValue: { type: "hard", statement: `${worldState.entities[faction]?.name || faction} has surrendered`, confidence: 100 } });
    }
  }

  if (lower.includes("dies") || lower.includes("killed") || lower.includes("assassinated") || lower.includes("dead")) {
    const person = findMentionedPerson(lower, worldState);
    if (person) {
      entityChanges.push({ entityId: person, field: "status", oldValue: "alive", newValue: "dead" });
      causalVarChanges.push({ varName: "morale", delta: -10 });
      factChanges.push({ factId: `${person}-death`, oldValue: null, newValue: { type: "hard", statement: `${worldState.entities[person]?.name || person} has died`, confidence: 100 } });
    }
  }

  if (lower.includes("alliance") || lower.includes("joins") || lower.includes("pact") || lower.includes("allies with")) {
    causalVarChanges.push({ varName: "logistics", delta: 10 });
    causalVarChanges.push({ varName: "morale", delta: 5 });
    factChanges.push({ factId: "new-alliance", oldValue: null, newValue: { type: "soft", statement: `A new alliance is formed: ${description}`, confidence: 85 } });
  }

  if (lower.includes("invention") || lower.includes("develops") || lower.includes("technology") || lower.includes("discovers")) {
    causalVarChanges.push({ varName: "techLevel", delta: 15 });
    factChanges.push({ factId: "tech-breakthrough", oldValue: null, newValue: { type: "soft", statement: `Technological breakthrough: ${description}`, confidence: 80 } });
  }

  if (lower.includes("retreat") || lower.includes("withdraws") || lower.includes("pulls back")) {
    const faction = findMentionedFaction(lower, worldState);
    if (faction) {
      entityChanges.push({ entityId: faction, field: "status", oldValue: worldState.entities[faction]?.status, newValue: "retreating" });
      causalVarChanges.push({ varName: "logistics", delta: -5 });
      causalVarChanges.push({ varName: "morale", delta: -5 });
    }
  }

  if (lower.includes("invade") || lower.includes("attack") || lower.includes("offensive")) {
    causalVarChanges.push({ varName: "escalation", delta: 10 });
    causalVarChanges.push({ varName: "morale", delta: -5 });
  }

  // Default fallback if no keywords matched
  if (entityChanges.length === 0 && factChanges.length === 0 && causalVarChanges.length === 0) {
    causalVarChanges.push({ varName: "escalation", delta: 5 });
    causalVarChanges.push({ varName: "morale", delta: -3 });
    factChanges.push({ factId: "user-fork", oldValue: null, newValue: { type: "soft", statement: description, confidence: 70 } });
  }

  return { entityChanges, factChanges, causalVarChanges };
}

function generateEventSpec(description) {
  const words = description.split(/\s+/).slice(0, 8).join(" ");
  return {
    title: words.length > 50 ? words.slice(0, 47) + "..." : words,
    description,
    category: "alternate",
  };
}

function generateTemplateContinuations(forkDescription, worldState, mainlineEvents) {
  const baseTimestamp = mainlineEvents[0]?.timestamp || "1942-06-01";
  const baseDate = new Date(baseTimestamp);

  return [
    {
      eventSpec: {
        title: "Immediate Aftermath",
        description: `Following the change where ${forkDescription.toLowerCase()}, immediate geopolitical consequences unfold as nations reassess their positions.`,
        category: "political",
      },
      deltas: {
        entityChanges: [],
        factChanges: [
          { factId: "aftermath-1", oldValue: null, newValue: { type: "soft", statement: `The immediate aftermath of: ${forkDescription}`, confidence: 75 } },
        ],
        causalVarChanges: [{ varName: "escalation", delta: 3 }],
      },
      timestamp: new Date(baseDate.getTime() + 90 * 24 * 3600000).toISOString().slice(0, 10),
    },
    {
      eventSpec: {
        title: "New Equilibrium",
        description: `A new balance of power emerges as the world adjusts to the altered reality. The long-term implications begin to crystallize.`,
        category: "diplomatic",
      },
      deltas: {
        entityChanges: [],
        factChanges: [
          { factId: "aftermath-2", oldValue: null, newValue: { type: "soft", statement: `Long-term consequence of: ${forkDescription}`, confidence: 65 } },
        ],
        causalVarChanges: [{ varName: "morale", delta: 2 }],
      },
      timestamp: new Date(baseDate.getTime() + 180 * 24 * 3600000).toISOString().slice(0, 10),
    },
  ];
}

export async function generateScenario(params) {
  const { title, description, subtitle, nodes } = params;

  const scenarioTitle = title || (description ? description.slice(0, 60) : "Custom Scenario");
  const scenarioDescription = description || `A simulation exploring: ${scenarioTitle}`;

  const yearMatch = subtitle?.match(/(\d{4})/);
  const baseYear = yearMatch ? parseInt(yearMatch[1]) : 2000;

  const initialState = {
    entities: {
      "faction-a": { type: "faction", name: "Primary Faction", status: "active", properties: { role: "protagonist", strength: "strong" } },
      "faction-b": { type: "faction", name: "Secondary Faction", status: "active", properties: { role: "antagonist", strength: "strong" } },
      "faction-c": { type: "faction", name: "Neutral Party", status: "neutral", properties: { role: "observer", strength: "moderate" } },
      "leader-a": { type: "person", name: "Leader A", status: "alive", properties: { role: "head-of-state", faction: "faction-a" } },
      "leader-b": { type: "person", name: "Leader B", status: "alive", properties: { role: "head-of-state", faction: "faction-b" } },
    },
    facts: {
      "initial-situation": { type: "hard", statement: scenarioDescription, confidence: 100 },
      "tensions-rising": { type: "soft", statement: "Tensions are escalating between key parties", confidence: 85 },
    },
    causalVars: { escalation: 55, logistics: 50, intelligence: 45, morale: 60, techLevel: 50 },
  };

  const eventSources = nodes && nodes.length > 0
    ? nodes
    : ["Crisis begins", "Tensions escalate", "Key decision point", "Turning point", "Consequences unfold", "Resolution"];

  const mainlineEvents = eventSources.map((eventTitle, i) => {
    const monthOffset = Math.floor((i / eventSources.length) * 12);
    const day = Math.min(28, (i + 1) * 4);
    const timestamp = `${baseYear}-${String(monthOffset + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return {
      eventSpec: {
        title: typeof eventTitle === "string" ? eventTitle.slice(0, 60) : `Event ${i + 1}`,
        description: `${eventTitle}. The situation continues to evolve as key actors respond to changing circumstances.`,
        category: i === 0 ? "political" : i === eventSources.length - 1 ? "diplomatic" : "political",
      },
      timestamp,
      deltas: i === 0
        ? null
        : {
            entityChanges: [],
            factChanges: [
              { factId: `event-${i}`, oldValue: null, newValue: { type: "soft", statement: eventTitle, confidence: 80 } },
            ],
            causalVarChanges: [
              { varName: "escalation", delta: i < eventSources.length / 2 ? 5 : -5 },
              { varName: "morale", delta: i < eventSources.length / 2 ? -3 : 3 },
            ],
          },
    };
  });

  return { title: scenarioTitle, description: scenarioDescription, initialState, mainlineEvents };
}

function findMentionedFaction(lower, worldState) {
  const factionMap = {
    germany: ["germany", "german", "nazi", "reich", "berlin"],
    uk: ["britain", "british", "uk", "england", "london"],
    france: ["france", "french", "paris"],
    ussr: ["soviet", "ussr", "russia", "russian", "moscow", "stalin"],
    usa: ["america", "american", "us ", "usa", "united states"],
    japan: ["japan", "japanese", "tokyo"],
    italy: ["italy", "italian", "rome", "mussolini"],
    poland: ["poland", "polish", "warsaw"],
  };

  for (const [id, keywords] of Object.entries(factionMap)) {
    if (keywords.some((kw) => lower.includes(kw)) && worldState.entities[id]) {
      return id;
    }
  }
  return null;
}

function findMentionedPerson(lower, worldState) {
  const personMap = {
    hitler: ["hitler", "fuhrer", "führer"],
    churchill: ["churchill", "winston"],
    roosevelt: ["roosevelt", "fdr"],
    stalin: ["stalin"],
    mussolini: ["mussolini", "duce"],
  };

  for (const [id, keywords] of Object.entries(personMap)) {
    if (keywords.some((kw) => lower.includes(kw)) && worldState.entities[id]) {
      return id;
    }
  }
  return null;
}
