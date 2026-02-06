import { Router } from "express";
import sessionStore from "../store/SessionStore.js";

const router = Router({ mergeParams: true });

router.get("/:renderPackId", async (req, res) => {
  const session = sessionStore.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  const rp = session.renderPacks.get(req.params.renderPackId);
  if (!rp) return res.status(404).json({ error: "RenderPack not found" });

  res.json(rp.toJSON());
});

export default router;
