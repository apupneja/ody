# Ody: Timeline & Ripple-Effects Simulation Agent

## What Is This?

Ody is a fullstack alternate-history simulation app. Users see a horizontal timeline of historical events, pick any event, describe a "what if" change, and watch the consequences ripple forward through subsequent events. Think of it as a choose-your-own-adventure for history, where every fork creates a branching timeline with cascading effects.

The backend is powered by the **Claude Agent SDK** (`@anthropic-ai/claude-agent-sdk`). An orchestrator agent coordinates specialized subagents -- one to interpret user edits into structured world-state deltas, one to generate plausible continuation events, one to produce narration, and one to assess the plausibility of branching outcomes. This multi-agent architecture keeps each agent's context focused and enables parallel execution of independent tasks.

The MVP ships with a hardcoded WW2 scenario (10 macro events, 3 precomputed branches each). The seed data provides a fallback so the app works without an API key, but when `ANTHROPIC_API_KEY` is set, real Claude-powered agents replace the mocked responses.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7 |
| State management | Zustand |
| Backend | Express 5, ES modules |
| Agent framework | `@anthropic-ai/claude-agent-sdk` (TypeScript SDK) |
| Database | None (in-memory session store) |

---

## Backend Architecture: Agent System

The backend is a multi-agent system built on the Claude Agent SDK. The Express server handles HTTP routing and session management. When a user triggers a fork, the route handler calls into the agent orchestrator, which coordinates specialized subagents to produce the forked timeline.

### Why the Agent SDK?

The Claude Agent SDK gives us Claude with built-in tool execution. Instead of implementing a tool loop manually (send prompt, check for tool_use, execute tool, send result, repeat), the SDK handles it:

```js
import { query } from "@anthropic-ai/claude-agent-sdk";

// Claude autonomously reads files, reasons, and produces results
for await (const message of query({
  prompt: "Given this world state, interpret 'Germany surrenders early' as a structured delta",
  options: { allowedTools: ["Read", "Grep"], agents: { /* subagents */ } }
})) {
  if ("result" in message) console.log(message.result);
}
```

The SDK also supports **subagents** -- isolated agent instances spawned via the `Task` tool. Each subagent has its own context window, tool set, and system prompt. This is critical for Ody because:

1. **Context isolation**: The delta-interpreter agent doesn't need to see narration prompts. The narrator doesn't need world-state analysis context. Keeping contexts separate improves quality and reduces token usage.
2. **Parallelization**: After a fork produces a new WorldState, we can run the continuation-generator and the render-pack builder in parallel as independent subagents.
3. **Specialized instructions**: Each agent has a tailored system prompt with domain-specific expertise (geopolitical reasoning, narrative writing, plausibility assessment).
4. **Tool restrictions**: The plausibility-assessor is read-only (no Bash, no Write). The narrator only needs Read access. This minimizes blast radius.

### Agent Hierarchy

```
OrchestratorAgent (server/agents/orchestrator.js)
  |
  |-- query() with agents: { ... }
  |
  +-- "delta-interpreter"  subagent
  |     Tools: [Read, Grep]
  |     Model: sonnet (fast, cheap)
  |     Job: Parse user's natural language edit into a structured WorldState delta
  |
  +-- "continuation-generator"  subagent
  |     Tools: [Read, Grep]
  |     Model: sonnet
  |     Job: Given a modified WorldState, generate 2 plausible downstream events
  |
  +-- "plausibility-assessor"  subagent
  |     Tools: [Read]
  |     Model: haiku (lightweight scoring)
  |     Job: Score a branch for plausibility, coherence, and novelty (0-100 each)
  |
  +-- "narrator"  subagent
        Tools: [Read]
        Model: sonnet
        Job: Generate narration text for an event node
```

### Agent Definitions

Each subagent is defined programmatically in the `agents` parameter of the `query()` call. Here's the full configuration:

#### Delta Interpreter

```js
"delta-interpreter": {
  description: "Interprets natural language user edits into structured WorldState deltas. Use when a user describes a historical change like 'Germany surrenders early' or 'Churchill is assassinated'.",
  prompt: `You are a historical simulation engine. Given a WorldState (JSON with entities, facts, and causalVars) and a user's natural language description of a change, produce a structured delta object.

A delta is a JSON object with:
- entityChanges: array of { entityId, field, oldValue, newValue }
- factChanges: array of { factId, oldValue, newValue }
- causalVarChanges: array of { varName, delta } (delta is a number, positive or negative)
- eventSpec: { title, description, category } for the fork event itself

Rules:
- Only change what the user's description implies. Don't invent unrelated changes.
- causalVar deltas should be proportional to the magnitude of the change.
- The eventSpec title should be concise (under 10 words).
- Return ONLY valid JSON, no explanation.`,
  tools: ["Read", "Grep"],
  model: "sonnet"
}
```

#### Continuation Generator

```js
"continuation-generator": {
  description: "Generates plausible downstream events after a WorldState change. Use after a fork to produce the 2 ripple events that follow.",
  prompt: `You are a counterfactual history engine. Given:
1. A modified WorldState (the state AFTER a user's fork)
2. The original mainline events that WOULD have happened next
3. The fork description (what the user changed)

Generate exactly 2 continuation events that plausibly follow from the modified WorldState. Each event should:
- Be a realistic consequence of the changed world state
- Differ from the original mainline events in ways that logically follow from the fork
- Include a delta object (same format as WorldState deltas)
- Include an eventSpec with title, description, and category

Return a JSON array of 2 event objects.`,
  tools: ["Read", "Grep"],
  model: "sonnet"
}
```

#### Plausibility Assessor

```js
"plausibility-assessor": {
  description: "Scores a branch for plausibility, coherence, and novelty. Use after generating a fork branch to assess its quality.",
  prompt: `You are a historical plausibility judge. Given a sequence of EventNodes on a branch (each with WorldState snapshots), score the branch on three dimensions:

- plausibility (0-100): How historically plausible is this sequence? Would historians consider it a reasonable counterfactual?
- coherence (0-100): Do the events follow logically from each other? Are there internal contradictions?
- novelty (0-100): How surprising or interesting is this branch compared to the mainline?

Return JSON: { plausibility: number, coherence: number, novelty: number, reasoning: string }`,
  tools: ["Read"],
  model: "haiku"
}
```

#### Narrator

```js
"narrator": {
  description: "Generates narration text for timeline events. Use when a user requests narration for a selected node.",
  prompt: `You are a documentary narrator for an alternate history series. Given an EventNode with its WorldState, write 2-3 sentences of narration in the style of a Ken Burns documentary. Be vivid but factual within the alternate timeline. Present tense. No editorializing.

Return plain text, no JSON wrapping.`,
  tools: ["Read"],
  model: "sonnet"
}
```

### Orchestrator Implementation

The orchestrator (`server/agents/orchestrator.js`) is the central coordination point. It doesn't use subagents directly -- it configures the `query()` call with all agent definitions, then sends a prompt that instructs Claude to delegate to the right subagents.

```js
// server/agents/orchestrator.js
import { query } from "@anthropic-ai/claude-agent-sdk";

const AGENT_DEFINITIONS = {
  "delta-interpreter": { /* ... as above ... */ },
  "continuation-generator": { /* ... as above ... */ },
  "plausibility-assessor": { /* ... as above ... */ },
  "narrator": { /* ... as above ... */ }
};

export async function executeFork(worldState, forkDescription, mainlineEvents) {
  const prompt = `
You are the orchestrator for an alternate-history simulation. A user has requested a fork.

WORLD STATE (current):
${JSON.stringify(worldState, null, 2)}

USER'S FORK DESCRIPTION: "${forkDescription}"

NEXT 2 MAINLINE EVENTS (for reference):
${JSON.stringify(mainlineEvents, null, 2)}

Execute these steps:
1. Use the delta-interpreter agent to convert the user's description into a structured delta.
2. Apply the delta to the world state (compute the new world state).
3. Use the continuation-generator agent to produce 2 downstream events based on the new world state.
4. Use the plausibility-assessor agent to score the resulting branch.
5. Return the complete result as JSON with: { delta, forkEvent, continuationEvents, branchScores }
  `;

  let result = null;
  for await (const message of query({
    prompt,
    options: {
      allowedTools: ["Read", "Grep", "Task"],
      agents: AGENT_DEFINITIONS,
      permissionMode: "bypassPermissions",
      model: "sonnet"
    }
  })) {
    if ("result" in message) {
      result = JSON.parse(message.result);
    }
  }
  return result;
}

export async function generateNarration(eventNode) {
  const prompt = `Use the narrator agent to generate narration for this event:
${JSON.stringify(eventNode, null, 2)}`;

  let result = null;
  for await (const message of query({
    prompt,
    options: {
      allowedTools: ["Read", "Task"],
      agents: { narrator: AGENT_DEFINITIONS.narrator },
      permissionMode: "bypassPermissions",
      model: "sonnet"
    }
  })) {
    if ("result" in message) {
      result = message.result;
    }
  }
  return result;
}
```

### How Subagents Are Invoked at Runtime

When the orchestrator's `query()` call runs, here's what happens under the hood:

1. Claude receives the orchestrator prompt and sees the agent definitions.
2. Claude decides to invoke the `delta-interpreter` subagent via the `Task` tool.
3. The SDK spawns a new agent process with the `delta-interpreter`'s system prompt, tools (`Read`, `Grep`), and model (`sonnet`).
4. The subagent runs autonomously -- it reads the world state, reasons about the user's description, and produces a structured delta.
5. The subagent's final result is returned to the orchestrator as the `Task` tool result.
6. Claude (the orchestrator) continues to step 2: applying the delta.
7. Claude invokes the `continuation-generator` subagent with the new world state.
8. Claude invokes the `plausibility-assessor` subagent (can run in parallel with step 7 if Claude decides to).
9. Claude assembles the final result and returns it.

Each subagent has its own isolated context window. The delta-interpreter never sees the narrator's prompts. The plausibility-assessor only sees the branch data it needs to score. This isolation improves quality and keeps token costs down.

### Mock Fallback Layer

When `ANTHROPIC_API_KEY` is not set, the backend falls back to a mock layer that mimics the same interface. This allows the app to run without any API costs during development and demo.

```js
// server/agents/mockOrchestrator.js
// Same function signatures as orchestrator.js, but uses keyword matching
// and precomputed seed data instead of real Claude calls.

export async function executeFork(worldState, forkDescription, mainlineEvents) {
  // Keyword matching: "surrender" -> faction surrenders delta
  // "dies" / "assassinated" -> person status dead delta
  // "alliance" -> modify alliance facts
  // Falls back to precomputed branches from seedData.js
  const delta = interpretEditToDelta(forkDescription, worldState);
  const newWorldState = worldState.applyDelta(delta);
  const continuations = generateMockContinuations(newWorldState, mainlineEvents);
  const scores = { plausibility: 70, coherence: 80, novelty: 60 };
  return { delta, forkEvent: { /* ... */ }, continuationEvents: continuations, branchScores: scores };
}
```

The route handlers use a simple switch:

```js
// server/services/agentService.js
import * as realOrchestrator from "../agents/orchestrator.js";
import * as mockOrchestrator from "../agents/mockOrchestrator.js";

const orchestrator = process.env.ANTHROPIC_API_KEY ? realOrchestrator : mockOrchestrator;
export const { executeFork, generateNarration } = orchestrator;
```

### Backend File Structure (Expanded)

```
server/
  index.js                         # Express app, mounts all routes, CORS, JSON parsing

  agents/
    orchestrator.js                # Real agent orchestrator using Claude Agent SDK
    mockOrchestrator.js            # Mock fallback (keyword matching + seed data)
    agentDefinitions.js            # Shared agent definitions (prompts, tools, models)

  routes/
    scenarios.js                   # POST /api/scenarios, GET /api/scenarios/:id
    timeline.js                    # GET timeline, GET node detail, POST fork
    render.js                      # GET render packs
    narration.js                   # POST narrate
    voice.js                       # POST voice-command

  models/
    WorldState.js                  # Immutable state class with applyDelta(), diff(), toJSON()
    EventNode.js                   # Story graph node (eventSpec, deltas, worldState, children)
    StoryGraph.js                  # DAG class (addNode, fork, getMainline, getBranch)
    RenderPack.js                  # Anchor image, scene bible, micro-prompt schedule

  services/
    agentService.js                # Switches between real orchestrator and mock based on API key
    ripple.js                      # Wires agents into the data model (calls agentService, updates StoryGraph)
    renderer.js                    # Template-based render pack generation
    seedData.js                    # Hardcoded WW2 scenario: 10 events, world states, 3 branches

  store/
    SessionStore.js                # In-memory Map<sessionId, {graph, renderPacks, ...}>
```

### Data Models (Detailed)

#### WorldState

```js
class WorldState {
  constructor({ entities, facts, causalVars }) { /* ... */ }

  // entities: Map<entityId, { type: 'person'|'faction'|'environment', name, status, properties }>
  // facts: Map<factId, { type: 'hard'|'soft'|'unknown', statement, confidence }>
  // causalVars: { escalation, logistics, intelligence, morale, techLevel } (each 0-100)

  applyDelta(delta) {
    // Returns a NEW WorldState (immutable)
    // delta.entityChanges: [{ entityId, field, oldValue, newValue }]
    // delta.factChanges: [{ factId, oldValue, newValue }]
    // delta.causalVarChanges: [{ varName, delta }] (clamped to 0-100)
  }

  diff(otherWorldState) {
    // Returns a human-readable diff between two world states
  }

  toJSON() { /* serializable snapshot */ }
  static fromJSON(json) { /* reconstruct from snapshot */ }
}
```

#### EventNode

```js
class EventNode {
  constructor({
    id,               // crypto.randomUUID()
    parentId,         // null for root
    branchId,         // 'main' or fork branch ID
    timestamp,        // ISO date string for the historical event
    eventSpec,        // { title, description, category }
    deltas,           // the delta that produced this node's world state
    worldState,       // WorldState instance
    branchPriors,     // { plausibility, coherence, novelty } (0-100 each)
    renderPackId,     // reference to RenderPack
    children,         // EventNode IDs
    isUserFork,       // boolean
    forkDescription   // user's original text (null for mainline events)
  }) { /* ... */ }
}
```

#### StoryGraph

```js
class StoryGraph {
  constructor() {
    this.nodes = new Map();        // Map<nodeId, EventNode>
    this.branches = new Map();     // Map<branchId, { name, headNodeId, forkPointId }>
  }

  addNode(eventNode) { /* ... */ }
  getNode(nodeId) { /* ... */ }
  getMainline() { /* ordered array of nodes on 'main' branch */ }
  getBranch(branchId) { /* ordered array of nodes on branch */ }
  getForksAt(nodeId) { /* all branches that fork from this node */ }

  fork(parentNodeId, newBranchId, forkNode, rippleNodes) {
    // Create a new branch starting at parentNodeId
    // Attach forkNode + rippleNodes to the new branch
    // Update parent's children list
  }

  getTimeline(branchId) {
    // Returns lightweight timeline data:
    // Mainline nodes up to the fork point, then branch nodes after
  }
}
```

#### RenderPack

```js
class RenderPack {
  constructor({
    id,                    // crypto.randomUUID()
    eventNodeId,           // which node this renders
    anchorImageUrl,        // placeholder image URL or base64
    sceneBible,            // text description of the scene
    microPromptSchedule,   // [{ offsetSec, prompt }] for future video gen
    clipUrl,               // null in MVP
    narrationText          // generated narration text
  }) { /* ... */ }
}
```

### API Routes (Detailed)

#### `POST /api/scenarios`

Creates a new session with the WW2 scenario. Initializes the StoryGraph with 10 mainline events from seed data.

**Request**: `{ "scenarioType": "ww2" }`

**Response**: `{ sessionId, scenario: { title, description }, timeline: EventNode[], branches: Branch[] }`

#### `GET /api/scenarios/:sessionId/timeline?branchId=main`

Returns lightweight timeline nodes for rendering. Includes node ID, title, timestamp, category, isUserFork flag, and position data. Does NOT include full WorldState (that's fetched per-node).

#### `GET /api/scenarios/:sessionId/nodes/:nodeId`

Returns full node detail: complete WorldState, deltas, render pack, branch priors, and list of fork branches originating from this node.

#### `POST /api/scenarios/:sessionId/fork`

The core endpoint. Calls `agentService.executeFork()` which routes to either the real orchestrator (Claude Agent SDK) or the mock.

**Request**: `{ "nodeId": "...", "description": "Germany surrenders in 1943" }`

**Response**: `{ branchId, forkNode: EventNode, rippleNodes: EventNode[], renderPacks: RenderPack[], branchScores: { plausibility, coherence, novelty } }`

**What happens inside** (real agent mode):
1. Express route handler calls `ripple.executeFork(sessionId, nodeId, description)`
2. `ripple.js` loads the WorldState from the StoryGraph
3. `ripple.js` calls `agentService.executeFork(worldState, description, nextMainlineEvents)`
4. `agentService` delegates to `orchestrator.js` which calls `query()` with all subagent definitions
5. Claude orchestrates: delta-interpreter -> apply delta -> continuation-generator -> plausibility-assessor
6. Result flows back through `ripple.js` which creates EventNodes, RenderPacks, and updates the StoryGraph
7. Response sent to frontend

#### `POST /api/scenarios/:sessionId/narrate`

Generates narration for a node. Calls `agentService.generateNarration()` which uses the narrator subagent (or mock template).

**Request**: `{ "nodeId": "..." }`

**Response**: `{ narrationText: "...", audioUrl: null }`

#### `POST /api/voice-command`

Parses a voice transcript into a fork intent. In mock mode, extracts keywords. In real mode, uses a lightweight Claude call (not a subagent, just a direct `query()`) to parse intent.

**Request**: `{ "transcript": "what if Hitler was never born" }`

**Response**: `{ intent: "fork", description: "Hitler was never born", targetNodeId: null }`

### Seed Data: WW2 Scenario

`server/services/seedData.js` is the largest backend file. It defines:

- **10 mainline events** with full WorldStates at each point:
  1. Invasion of Poland (Sep 1939)
  2. Fall of France (Jun 1940)
  3. Battle of Britain (Sep 1940)
  4. Operation Barbarossa (Jun 1941)
  5. Pearl Harbor (Dec 1941)
  6. Battle of Midway (Jun 1942)
  7. Stalingrad (Feb 1943)
  8. D-Day (Jun 1944)
  9. Fall of Berlin (Apr 1945)
  10. V-J Day (Aug 1945)

- **3 precomputed branches** per event (30 total branch variations), each with:
  - A fork description
  - A delta
  - 2 continuation events with their own deltas and WorldStates
  - Branch prior scores
  - Render packs with placeholder images and scene bibles

This seed data serves as both the mock fallback and as reference examples that the real agents can read for context about the format and historical domain.

---

## Frontend

### File Structure

```
src/
  App.jsx                     # Layout shell, scenario init on mount
  App.css                     # Dark theme, full-bleed CSS Grid
  store/
    useStore.js               # Zustand store (session, timeline, fork, narration)
  api/
    client.js                 # Fetch wrapper with error handling
    scenarios.js              # Scenario API calls
    timeline.js               # Timeline + fork API calls
    render.js                 # Render pack API calls
    narration.js              # Narration API calls
  components/
    Layout/
      Layout.jsx + .css       # Top bar + 3-row grid main area
    Timeline/
      Timeline.jsx + .css     # Horizontal scrollable track with nodes + branch lines
      TimelineNode.jsx + .css # Circle node (color-coded, glow on select, fork indicator)
      BranchLine.jsx + .css   # SVG paths connecting nodes, dashed for alt branches
    BranchSelector/
      BranchSelector.jsx + .css  # Dropdown to switch branches
    ClipViewer/
      ClipViewer.jsx + .css   # Shows anchor image / placeholder
    WorldStatePanel/
      WorldStatePanel.jsx + .css  # Factions, people, causal var bars (0-100)
    EditPanel/
      EditPanel.jsx + .css    # Text input + Fork button
      VoiceInput.jsx + .css   # Web Speech API mic button
    RippleOverlay/
      RippleOverlay.jsx + .css  # Animated wave after fork
    NarrationBar/
      NarrationBar.jsx + .css # Narration text + audio controls
```

### Component Layout

The UI is a dark-themed, full-bleed CSS Grid with three rows:

- **Top (~50%)**: ClipViewer showing the selected event's anchor image, with NarrationBar overlaid at the bottom
- **Middle (~25%)**: Horizontal scrollable Timeline with color-coded nodes, SVG branch lines, and a ripple overlay for fork animations
- **Bottom (~25%)**: Split between WorldStatePanel (left, showing factions/people/causal bars) and EditPanel (right, with text input, Fork button, and mic button)

A top bar holds the scenario title and a BranchSelector dropdown.

### State Management: Zustand

Single store with five slices:

- **Session**: sessionId, scenario metadata, loading/error state
- **Timeline**: ordered nodes, active branch, all branches, selected node ID
- **Node Detail**: full WorldState, render pack, and forks for the selected node
- **Fork/Edit**: fork-in-progress flag, fork result, edit text input, branch scores
- **Narration**: narration text, audio URL, narrating flag

Compound async actions:
- `initScenario()` -- POST scenario, GET timeline, select first node
- `selectAndLoadNode(nodeId)` -- GET full node detail + render pack
- `executeFork()` -- POST fork, add branch, switch to it, trigger ripple animation
- `switchBranch(branchId)` -- GET timeline for branch, reset selection
- `loadNarration(nodeId)` -- POST narrate, set text

### User Interaction Flow

1. **Load**: App mounts, calls `initScenario()`, 10 WW2 events appear on the timeline, first node is selected
2. **Browse**: Click any node to load its WorldState and update the clip viewer
3. **Scrub**: Arrow keys or click adjacent nodes to move through the timeline
4. **Fork**: Select a node, type a change description, click "Fork & Ripple" -- ripple animation plays, 3 new nodes appear on a new branch, view auto-switches. Branch plausibility/coherence/novelty scores display.
5. **Branch switch**: Use the dropdown to switch between the mainline and any forked branches
6. **Voice**: Click the mic button, speak a change, transcript fills the edit box, confirm with the Fork button

---

## Dependencies

```bash
npm install zustand @anthropic-ai/claude-agent-sdk
```

Everything else is already installed (express, cors, react, react-dom) or built-in (crypto.randomUUID, Web Speech API).

The Claude Agent SDK requires `ANTHROPIC_API_KEY` as an environment variable for real agent mode. Without it, the app falls back to mock mode with seed data.

---

## Implementation Phases

### Phase 1: Backend Data Layer
1. `server/models/WorldState.js` -- class with `applyDelta()`, `diff()`, `toJSON()`, `fromJSON()`
2. `server/models/EventNode.js` -- data class
3. `server/models/StoryGraph.js` -- DAG with fork/branch operations
4. `server/models/RenderPack.js` -- data class
5. `server/store/SessionStore.js` -- in-memory Map store
6. `server/services/seedData.js` -- 10 WW2 events with full WorldStates, deltas, 3 branches each

### Phase 2: Backend Agents + Mock Layer
7. `server/agents/agentDefinitions.js` -- all subagent definitions (prompts, tools, models)
8. `server/agents/mockOrchestrator.js` -- keyword matching + seed data fallback
9. `server/agents/orchestrator.js` -- real Claude Agent SDK orchestrator with subagents
10. `server/services/agentService.js` -- switch between real/mock based on API key
11. `server/services/ripple.js` -- wires agents into the StoryGraph data model
12. `server/services/renderer.js` -- template render pack generation

### Phase 3: Backend API Routes
13. All route files under `server/routes/`
14. Update `server/index.js` to mount routes

### Phase 4: Frontend Core
15. `npm install zustand`
16. API client modules (`src/api/`)
17. Zustand store (`src/store/useStore.js`)
18. Layout, Timeline, TimelineNode, BranchLine, ClipViewer, WorldStatePanel
19. Rewrite App.jsx + App.css

### Phase 5: Fork + Ripple UI
20. EditPanel, VoiceInput, RippleOverlay, BranchSelector
21. Wire up full fork -> ripple -> branch switch flow

### Phase 6: Polish
22. NarrationBar, keyboard nav, loading states, error handling, style tweaks

---

## How to Verify

### Backend (Mock Mode)
1. Start server: `npm run dev:server`
2. Create scenario: `curl -X POST http://localhost:3001/api/scenarios -H 'Content-Type: application/json' -d '{"scenarioType":"ww2"}'` -- should return sessionId + 10-node timeline
3. Fork test: `curl -X POST http://localhost:3001/api/scenarios/{sessionId}/fork -H 'Content-Type: application/json' -d '{"nodeId":"...","description":"Germany surrenders early"}'` -- should return new branch with 3 nodes + scores

### Backend (Real Agent Mode)
1. Set `ANTHROPIC_API_KEY` environment variable
2. Run the same fork test -- response should contain more nuanced, Claude-generated deltas, continuations, and plausibility scores instead of keyword-matched mocks

### Frontend
1. App loads with 10 nodes on the timeline, first node selected
2. Clicking a node shows WorldState panel with factions, people, causal variable bars
3. Typing a fork description and clicking "Fork & Ripple" creates a new branch with ripple animation
4. Branch selector dropdown switches between mainline and forked branches
5. Voice: click mic, speak, transcript fills edit box

### Full Integration
1. Create 2+ forks at different points on the timeline
2. Switch between all branches, verify timeline updates correctly
3. Verify branch scores display (plausibility/coherence/novelty)
4. Verify narration generates for any selected node
