import express from "express";
import cors from "cors";
import scenariosRouter from "./routes/scenarios.js";
import timelineRouter from "./routes/timeline.js";
import narrationRouter from "./routes/narration.js";
import voiceRouter from "./routes/voice.js";
import renderRouter from "./routes/render.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.ANTHROPIC_API_KEY ? "real" : "mock" });
});

app.use("/api/scenarios", scenariosRouter);
app.use("/api/scenarios/:sessionId/timeline", timelineRouter);
app.use("/api/scenarios/:sessionId/narrate", narrationRouter);
app.use("/api/scenarios/:sessionId/render", renderRouter);
app.use("/api/voice-command", voiceRouter);

app.use((err, req, res, next) => {
  console.error("[Server Error]", err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Mode: ${process.env.ANTHROPIC_API_KEY ? "Real Agent" : "Mock"}`);
});
