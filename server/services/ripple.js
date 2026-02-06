import sessionStore from "../store/SessionStore.js";
import * as agentService from "./agentService.js";
import { EventNode } from "../models/EventNode.js";
import { RenderPack } from "../models/RenderPack.js";
import { getPregenerated } from "./seed/pregeneratedContent.js";

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

  // Create render packs for all new nodes, using pre-generated content when available
  const allNodes = [forkNode, ...rippleNodes];
  const contentKeys = [
    agentResult.contentKey ?? null,
    ...(agentResult.continuationEvents || []).map((c) => c.contentKey ?? null),
  ];

  const renderPacks = allNodes.map((node, idx) => {
    const contentKey = contentKeys[idx] || null;
    const pregen = contentKey ? getPregenerated(contentKey) : null;

    const rp = new RenderPack({
      eventNodeId: node.id,
      sceneBible: `[${node.eventSpec.category.toUpperCase()}] ${node.eventSpec.title}\n\n${node.eventSpec.description}\n\nDynamics: Use very slight movements only — gentle smoke drift, faint breeze on fabric, slowly shifting light. Stative present-continuous descriptions. Fixed or very slowly drifting camera.`,
      contentKey,
      narrationText: pregen?.narrationText ?? null,
      audioUrl: pregen?.audioUrl ?? null,
      anchorImageUrl: pregen?.anchorImageUrl ?? null,
      microPromptSchedule: [
        { offsetSec: 0, prompt: `Wide establishing shot of ${node.eventSpec.title}. Atmosphere is still, light is slowly shifting, faint haze is drifting across the frame. Camera is static, deep focus.` },
        { offsetSec: 5, prompt: `Medium shot, key moment: ${node.eventSpec.description}. Dust motes are floating in shafts of light, subtle shadows are creeping across surfaces. Camera is gently drifting closer, shallow focus.` },
        { offsetSec: 10, prompt: `Slow pull-back, aftermath. Smoke is barely curling upward, ambient light is gradually dimming. Camera is slowly retreating, wide-angle lens.` },
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
