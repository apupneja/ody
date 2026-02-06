import sessionStore from "../store/SessionStore.js";
import * as agentService from "./agentService.js";
import { EventNode } from "../models/EventNode.js";
import { RenderPack } from "../models/RenderPack.js";

export async function executeFork(sessionId, nodeId, forkDescription) {
  const session = sessionStore.get(sessionId);
  if (!session) throw new Error(`Session not found: ${sessionId}`);

  const graph = session.graph;
  const parentNode = graph.getNode(nodeId);
  if (!parentNode) throw new Error(`Node not found: ${nodeId}`);

  // Get next 2 mainline events after parent for continuation-generator context
  const mainline = graph.getMainline();
  const parentIndex = mainline.findIndex((n) => n.id === nodeId);
  const nextMainlineEvents = mainline.slice(parentIndex + 1, parentIndex + 3);

  // Call agent system
  const agentResult = await agentService.executeFork(parentNode.worldState, forkDescription, nextMainlineEvents);

  // Build the new branch
  const newBranchId = `branch-${crypto.randomUUID().slice(0, 8)}`;

  // Create fork EventNode
  const forkDelta = {
    entityChanges: agentResult.delta.entityChanges || [],
    factChanges: agentResult.delta.factChanges || [],
    causalVarChanges: agentResult.delta.causalVarChanges || [],
  };
  const forkWorldState = parentNode.worldState.applyDelta(forkDelta);

  const forkNode = new EventNode({
    parentId: nodeId,
    branchId: newBranchId,
    timestamp: parentNode.timestamp,
    eventSpec: agentResult.delta.eventSpec,
    deltas: forkDelta,
    worldState: forkWorldState,
    branchPriors: agentResult.branchScores,
    isUserFork: true,
    forkDescription,
  });

  // Create ripple EventNodes from continuationEvents
  let prevState = forkWorldState;
  let prevId = forkNode.id;
  const rippleNodes = (agentResult.continuationEvents || []).map((cont, i) => {
    const contDelta = {
      entityChanges: cont.deltas?.entityChanges || [],
      factChanges: cont.deltas?.factChanges || [],
      causalVarChanges: cont.deltas?.causalVarChanges || [],
    };
    const newState = prevState.applyDelta(contDelta);

    const fallbackTimestamp = new Date(
      new Date(parentNode.timestamp).getTime() + (i + 1) * 90 * 24 * 3600000
    )
      .toISOString()
      .slice(0, 10);

    const node = new EventNode({
      parentId: prevId,
      branchId: newBranchId,
      timestamp: cont.timestamp || fallbackTimestamp,
      eventSpec: cont.eventSpec,
      deltas: contDelta,
      worldState: newState,
      branchPriors: agentResult.branchScores,
      isUserFork: false,
    });

    prevState = newState;
    prevId = node.id;
    return node;
  });

  // Create render packs for all new nodes
  const allNodes = [forkNode, ...rippleNodes];
  const renderPacks = allNodes.map((node) => {
    const rp = new RenderPack({
      eventNodeId: node.id,
      sceneBible: `[${node.eventSpec.category.toUpperCase()}] ${node.eventSpec.title}\n\n${node.eventSpec.description}`,
      microPromptSchedule: [
        { offsetSec: 0, prompt: `Establishing shot: ${node.eventSpec.title}` },
        { offsetSec: 5, prompt: `Key moment: ${node.eventSpec.description}` },
        { offsetSec: 10, prompt: `Aftermath and transition` },
      ],
    });
    node.renderPackId = rp.id;
    sessionStore.addRenderPack(sessionId, rp);
    return rp;
  });

  // Commit to graph
  graph.fork(nodeId, newBranchId, forkNode, rippleNodes);

  return {
    branchId: newBranchId,
    forkNode,
    rippleNodes,
    renderPacks,
    branchScores: agentResult.branchScores,
    fallbackUsed: agentResult.fallbackUsed ?? false,
  };
}
