import { Router } from "express";
import sessionStore from "../store/SessionStore.js";
import * as ripple from "../services/ripple.js";

const router = Router({ mergeParams: true });

router.get("/", async (req, res) => {
  const session = sessionStore.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  const branchId = req.query.branchId ?? "main";
  const timeline = session.graph.getTimeline(branchId);
  if (!timeline) return res.status(404).json({ error: `Branch not found: ${branchId}` });

  const branches = session.graph.getBranchList();
  res.json({ timeline, branches });
});

router.get("/nodes/:nodeId/suggestions", async (req, res) => {
  const session = sessionStore.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  const node = session.graph.getNode(req.params.nodeId);
  if (!node) return res.status(404).json({ error: "Node not found" });

  const precomputed = (session.precomputedBranches || []).find(
    (pb) => pb.eventNodeId === req.params.nodeId
  );

  const suggestions = (precomputed?.branches || []).map((branch, idx) => ({
    id: idx,
    label: branch.forkEventSpec?.title || branch.forkDescription,
    description: branch.forkEventSpec?.description || '',
    probability: `${branch.branchPriors?.plausibility || 50}%`,
    forkDescription: branch.forkDescription,
    explanation: branch.explanation || null,
  }));

  res.json({ suggestions });
});

router.get("/nodes/:nodeId", async (req, res) => {
  const session = sessionStore.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  const node = session.graph.getNode(req.params.nodeId);
  if (!node) return res.status(404).json({ error: "Node not found" });

  const forks = session.graph.getForksAt(node.id);
  const renderPack = node.renderPackId ? session.renderPacks.get(node.renderPackId) : null;

  res.json({
    node: node.toJSON(),
    renderPack: renderPack?.toJSON() ?? null,
    forks,
  });
});

router.post("/fork", async (req, res) => {
  const { nodeId, description } = req.body;
  if (!nodeId || !description) {
    return res.status(400).json({ error: "nodeId and description are required" });
  }

  try {
    const result = await ripple.executeFork(req.params.sessionId, nodeId, description);
    res.status(201).json({
      branchId: result.branchId,
      forkNode: result.forkNode.toJSON(),
      rippleNodes: result.rippleNodes.map((n) => n.toJSON()),
      renderPacks: result.renderPacks.map((rp) => rp.toJSON()),
      branchScores: result.branchScores,
      fallbackUsed: result.fallbackUsed,
    });
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    throw err;
  }
});

export default router;
