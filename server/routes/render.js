import { Router } from "express";
import sessionStore from "../store/SessionStore.js";
import { generateImage } from "../services/imageService.js";
import { createVideoSession } from "../services/videoService.js";

const router = Router({ mergeParams: true });

router.get("/:renderPackId", async (req, res) => {
  const session = sessionStore.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  const rp = session.renderPacks.get(req.params.renderPackId);
  if (!rp) return res.status(404).json({ error: "RenderPack not found" });

  // Lazy image generation: generate on first request if not yet populated
  if (!rp.anchorImageUrl) {
    const node = session.graph.getNode(rp.eventNodeId);
    if (node) {
      const imageUrl = await generateImage(node);
      if (imageUrl) rp.anchorImageUrl = imageUrl;
    }
  }

  res.json(rp.toJSON());
});

router.post("/:renderPackId/video-session", async (req, res) => {
  const session = sessionStore.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  const rp = session.renderPacks.get(req.params.renderPackId);
  if (!rp) return res.status(404).json({ error: "RenderPack not found" });

  const node = session.graph.getNode(rp.eventNodeId);
  if (!node) return res.status(404).json({ error: "EventNode not found" });

  const videoSession = await createVideoSession(node);
  res.json(videoSession);
});

export default router;
