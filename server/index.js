import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import scenariosRouter from "./routes/scenarios.js";
import timelineRouter from "./routes/timeline.js";
import narrationRouter from "./routes/narration.js";
import voiceRouter from "./routes/voice.js";
import renderRouter from "./routes/render.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mode: process.env.ANTHROPIC_API_KEY ? "real" : "mock",
    services: {
      claude: !!process.env.ANTHROPIC_API_KEY,
      fal: !!process.env.FAL_KEY,
      elevenlabs: !!process.env.ELEVENLABS_API_KEY,
      odyssey: !!process.env.ODYSSEY_API_KEY,
    },
  });
});

app.use("/api/scenarios", scenariosRouter);
app.use("/api/scenarios/:sessionId/timeline", timelineRouter);
app.use("/api/scenarios/:sessionId/narrate", narrationRouter);
app.use("/api/scenarios/:sessionId/render", renderRouter);
app.use("/api/voice-command", voiceRouter);

// Serve static frontend in production
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));
app.get("/{*splat}", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(distPath, "index.html"));
});

app.use((err, req, res, next) => {
  console.error("[Server Error]", err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Mode: ${process.env.ANTHROPIC_API_KEY ? "Real Agent" : "Mock"}`);
});
