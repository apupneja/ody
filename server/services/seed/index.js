import { WorldState } from "../../models/WorldState.js";
import { buildMainlineEvents } from "./mainlineEvents.js";
import { polandBranches } from "./branches/branch-poland.js";
import { franceBranches } from "./branches/branch-france.js";
import { pearlHarborBranches } from "./branches/branch-pearlharbor.js";
import { DDAY_BRANCHES } from "./branches/branch-dday.js";
import { VJDAY_BRANCHES } from "./branches/branch-vjday.js";
import { StoryGraph } from "../../models/StoryGraph.js";
import { EventNode } from "../../models/EventNode.js";
import { RenderPack } from "../../models/RenderPack.js";
import { getPregenerated } from "./pregeneratedContent.js";

const ALL_BRANCHES_BY_EVENT_INDEX = [
  polandBranches,
  franceBranches,
  pearlHarborBranches,
  DDAY_BRANCHES,
  VJDAY_BRANCHES,
];

export function buildWW2Scenario() {
  const graph = new StoryGraph();
  const renderPacks = new Map();
  const mainlineData = buildMainlineEvents();

  const mainlineNodes = mainlineData.map((data, i) => {
    const node = new EventNode({
      id: data.id,
      parentId: i > 0 ? mainlineData[i - 1].id : null,
      branchId: "main",
      timestamp: data.timestamp,
      eventSpec: data.eventSpec,
      deltas: data.deltas,
      worldState: data.worldState,
      isUserFork: false,
    });
    graph.addNode(node);

    const contentKey = `main-${i}`;
    const pregen = getPregenerated(contentKey);

    const rp = new RenderPack({
      eventNodeId: node.id,
      sceneBible: `[${data.eventSpec.category.toUpperCase()}] ${data.eventSpec.title}\n\n${data.eventSpec.description}`,
      contentKey,
      narrationText: pregen?.narrationText ?? null,
      audioUrl: pregen?.audioUrl ?? null,
      anchorImageUrl: pregen?.anchorImageUrl ?? null,
    });
    node.renderPackId = rp.id;
    renderPacks.set(rp.id, rp);

    return node;
  });

  const precomputedBranches = ALL_BRANCHES_BY_EVENT_INDEX.map((branches, eventIndex) => ({
    eventNodeId: mainlineNodes[eventIndex].id,
    branches: branches.map((branch, branchIndex) => ({
      ...branch,
      contentKey: `branch-${eventIndex}-${branchIndex}`,
      continuations: branch.continuations.map((cont, contIndex) => ({
        ...cont,
        contentKey: `branch-${eventIndex}-${branchIndex}-cont-${contIndex}`,
      })),
    })),
  }));

  return {
    graph,
    renderPacks,
    precomputedBranches,
    title: "World War II",
    description: "The Second World War, 1939-1945. Five pivotal events that shaped the modern world.",
  };
}

export function buildGeneratedScenario(agentOutput) {
  const graph = new StoryGraph();
  const renderPacks = new Map();

  let currentState = new WorldState({
    entities: agentOutput.initialState.entities,
    facts: agentOutput.initialState.facts,
    causalVars: agentOutput.initialState.causalVars,
  });

  agentOutput.mainlineEvents.forEach((eventData, i) => {
    if (eventData.deltas) {
      currentState = currentState.applyDelta(eventData.deltas);
    }

    const node = new EventNode({
      id: `main-${i}`,
      parentId: i > 0 ? `main-${i - 1}` : null,
      branchId: "main",
      timestamp: eventData.timestamp,
      eventSpec: eventData.eventSpec,
      deltas: eventData.deltas,
      worldState: currentState,
      isUserFork: false,
    });
    graph.addNode(node);

    const rp = new RenderPack({
      eventNodeId: node.id,
      sceneBible: `[${eventData.eventSpec.category.toUpperCase()}] ${eventData.eventSpec.title}\n\n${eventData.eventSpec.description}`,
    });
    node.renderPackId = rp.id;
    renderPacks.set(rp.id, rp);
  });

  return {
    graph,
    renderPacks,
    precomputedBranches: [],
    title: agentOutput.title,
    description: agentOutput.description,
  };
}
