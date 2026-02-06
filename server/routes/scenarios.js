import { Router } from "express";
import { buildWW2Scenario, buildGeneratedScenario } from "../services/seed/index.js";
import sessionStore from "../store/SessionStore.js";
import { setPrecomputedBranches } from "../agents/mockOrchestrator.js";
import * as agentService from "../services/agentService.js";

const router = Router();

router.post("/", async (req, res) => {
  const { scenarioType, title, description, subtitle, nodes } = req.body;

  const sessionId = crypto.randomUUID();
  let scenario;

  if (scenarioType === "ww2") {
    scenario = buildWW2Scenario();
    setPrecomputedBranches(scenario.precomputedBranches);
  } else if (scenarioType === "generated") {
    try {
      const agentOutput = await agentService.generateScenario({ title, description, subtitle, nodes });
      scenario = buildGeneratedScenario(agentOutput);
    } catch (err) {
      console.error("[Scenarios] Generation failed:", err.message);
      return res.status(500).json({ error: "Scenario generation failed", message: err.message });
    }
  } else {
    return res.status(400).json({ error: 'scenarioType must be "ww2" or "generated"' });
  }

  sessionStore.create(sessionId, {
    graph: scenario.graph,
    renderPacks: scenario.renderPacks,
    metadata: { title: scenario.title, description: scenario.description },
    precomputedBranches: scenario.precomputedBranches,
  });

  const timeline = scenario.graph.getTimeline("main");
  const branches = scenario.graph.getBranchList();

  res.status(201).json({
    sessionId,
    scenario: { title: scenario.title, description: scenario.description },
    timeline,
    branches,
  });
});

router.get("/:sessionId", async (req, res) => {
  const session = sessionStore.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json({ metadata: session.metadata });
});

export default router;
