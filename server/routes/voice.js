import { Router } from "express";
import * as agentService from "../services/agentService.js";

const router = Router();

router.post("/", async (req, res) => {
  const { transcript } = req.body;
  if (!transcript) return res.status(400).json({ error: "transcript is required" });

  const result = await agentService.parseVoiceCommand(transcript);
  res.json(result);
});

export default router;
