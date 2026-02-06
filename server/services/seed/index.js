import { buildMainlineEvents } from "./mainlineEvents.js";
import { polandBranches } from "./branches/branch-poland.js";
import { franceBranches } from "./branches/branch-france.js";
import { britainBranches } from "./branches/branch-britain.js";
import { barbarossaBranches } from "./branches/branch-barbarossa.js";
import { pearlHarborBranches } from "./branches/branch-pearlharbor.js";
import { MIDWAY_BRANCHES } from "./branches/branch-midway.js";
import { STALINGRAD_BRANCHES } from "./branches/branch-stalingrad.js";
import { DDAY_BRANCHES } from "./branches/branch-dday.js";
import { BERLIN_BRANCHES } from "./branches/branch-berlin.js";
import { VJDAY_BRANCHES } from "./branches/branch-vjday.js";
import { StoryGraph } from "../../models/StoryGraph.js";
import { EventNode } from "../../models/EventNode.js";
import { RenderPack } from "../../models/RenderPack.js";

const ALL_BRANCHES_BY_EVENT_INDEX = [
  polandBranches,
  franceBranches,
  britainBranches,
  barbarossaBranches,
  pearlHarborBranches,
  MIDWAY_BRANCHES,
  STALINGRAD_BRANCHES,
  DDAY_BRANCHES,
  BERLIN_BRANCHES,
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

    const rp = new RenderPack({
      eventNodeId: node.id,
      sceneBible: `[${data.eventSpec.category.toUpperCase()}] ${data.eventSpec.title}\n\n${data.eventSpec.description}`,
    });
    node.renderPackId = rp.id;
    renderPacks.set(rp.id, rp);

    return node;
  });

  const precomputedBranches = ALL_BRANCHES_BY_EVENT_INDEX.map((branches, eventIndex) => ({
    eventNodeId: mainlineNodes[eventIndex].id,
    branches,
  }));

  return {
    graph,
    renderPacks,
    precomputedBranches,
    title: "World War II",
    description: "The Second World War, 1939-1945. Ten pivotal events that shaped the modern world.",
  };
}
