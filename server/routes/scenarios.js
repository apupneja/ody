import { Router } from "express";
import { buildWW2Scenario } from "../services/seed/index.js";
import sessionStore from "../store/SessionStore.js";
import { setPrecomputedBranches } from "../agents/mockOrchestrator.js";

const router = Router();

router.post("/", async (req, res) => {
  const { scenarioType } = req.body;
  if (scenarioType !== "ww2") {
    return res.status(400).json({ error: 'Only "ww2" scenario is currently supported' });
  }

  const sessionId = crypto.randomUUID();
  const scenario = buildWW2Scenario();

  setPrecomputedBranches(scenario.precomputedBranches);

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
