import { Router } from "express";
import {
  generateActors,
  generateWorldState,
  generateTimeline,
  buildScenarioFromGenerated,
} from "../services/generateService.js";
import sessionStore from "../store/SessionStore.js";

const router = Router();

function sendSSE(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

router.post("/stream", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "prompt is required" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  // Set up SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  try {
    // Phase 1: Generate actors (factions + persons + title/description)
    sendSSE(res, "phase", { phase: 1, label: "Analyzing scenario..." });

    const actors = await generateActors(prompt);

    // Stream factions immediately
    sendSSE(res, "phase", { phase: 2, label: "Instantiating factions" });
    for (const faction of actors.factions) {
      sendSSE(res, "faction", faction);
    }

    // Stream persons immediately
    sendSSE(res, "phase", { phase: 3, label: "Identifying key figures" });
    for (const person of actors.persons) {
      sendSSE(res, "person", person);
    }

    // Phase 2: Generate world state (facts + causal vars)
    sendSSE(res, "phase", { phase: 4, label: "Building intelligence network" });

    const worldState = await generateWorldState(prompt, actors);

    // Stream facts immediately
    for (const fact of worldState.facts) {
      sendSSE(res, "fact", fact);
    }

    // Stream causal vars immediately
    sendSSE(res, "phase", { phase: 5, label: "Calibrating causal system" });
    for (const v of worldState.causalVars) {
      sendSSE(res, "causalVar", v);
    }

    // Phase 3: Generate timeline (events)
    sendSSE(res, "phase", { phase: 6, label: "Constructing timeline" });

    const timeline = await generateTimeline(prompt, actors);

    // Stream events immediately
    for (const evt of timeline.events) {
      sendSSE(res, "event", evt);
    }

    // Build the session from all generated data
    const fullData = {
      title: actors.title,
      description: actors.description,
      factions: actors.factions,
      persons: actors.persons,
      facts: worldState.facts,
      causalVars: worldState.causalVars,
      events: timeline.events,
    };

    const sessionId = crypto.randomUUID();
    const scenario = buildScenarioFromGenerated(fullData);

    sessionStore.create(sessionId, {
      graph: scenario.graph,
      renderPacks: scenario.renderPacks,
      metadata: { title: scenario.title, description: scenario.description },
      precomputedBranches: scenario.precomputedBranches,
    });

    const timelineData = scenario.graph.getTimeline("main");
    const branches = scenario.graph.getBranchList();

    sendSSE(res, "phase", { phase: 7, label: "Simulation ready" });
    sendSSE(res, "complete", {
      sessionId,
      scenario: { title: scenario.title, description: scenario.description },
      timeline: timelineData,
      branches,
    });
  } catch (err) {
    console.error("[Generate Error]", err);
    sendSSE(res, "error", { message: err.message });
  }

  res.end();
});

export default router;
