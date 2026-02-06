import { Router } from "express";
import sessionStore from "../store/SessionStore.js";
import * as agentService from "../services/agentService.js";
import { generateSpeech } from "../services/ttsService.js";

const router = Router({ mergeParams: true });

router.post("/", async (req, res) => {
  const { nodeId } = req.body;
  if (!nodeId) return res.status(400).json({ error: "nodeId is required" });

  const session = sessionStore.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  const node = session.graph.getNode(nodeId);
  if (!node) return res.status(404).json({ error: "Node not found" });

  const narrationText = await agentService.generateNarration(node);
  const audioUrl = await generateSpeech(narrationText);

  // Store narration and audio in render pack if one exists
  if (node.renderPackId) {
    const rp = session.renderPacks.get(node.renderPackId);
    if (rp) {
      rp.narrationText = narrationText;
      rp.audioUrl = audioUrl;
    }
  }

  res.json({ narrationText, audioUrl });
});

export default router;
