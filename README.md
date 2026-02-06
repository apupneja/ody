# Ody

Ody is an alternate-history simulation app. You pick a historical scenario, select a turning point on the timeline, describe a "what if" change, and watch the consequences ripple forward through subsequent events. Each fork creates a branching timeline with cascading effects on factions, people, and geopolitical variables.

The backend uses the Claude Agent SDK to orchestrate specialized subagents -- one interprets user edits into structured world-state deltas, one generates plausible continuation events, one scores branches for plausibility, and one produces documentary-style narration. When no API key is set, the app falls back to precomputed seed data so it works out of the box.

Ships with scenarios for WW2, the Cuban Missile Crisis, the 2008 financial collapse, and more.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, Tailwind CSS 4, Zustand |
| Backend | Express 5, ES modules |
| Agent framework | Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`) |
| Media | fal.ai for image generation, Odyssey SDK for video |

## Getting started

```bash
npm install
npm run dev          # frontend (Vite)
npm run dev:server   # backend (Express on port 3001)
```

Set `ANTHROPIC_API_KEY` in a `.env` file to enable live agent-powered forks. Without it, the app uses precomputed seed data.

## How it works

1. Pick a scenario from the landing page.
2. Browse the timeline -- each node represents a historical turning point with a full world state (factions, key figures, causal variables like morale, logistics, and escalation).
3. Select any node, type a counterfactual (e.g. "Germany surrenders in 1943"), and hit Fork.
4. The backend orchestrator delegates to subagents that interpret the change, generate downstream events, and score the branch for plausibility, coherence, and novelty.
5. The new branch appears on the timeline. Switch between branches with the dropdown, or generate narration and images for any node.

## Project structure

```
server/
  agents/          # orchestrator + mock fallback + agent definitions
  models/          # WorldState, EventNode, StoryGraph, RenderPack
  routes/          # scenarios, timeline, fork, narration, voice, generate
  services/        # agent service, ripple engine, seed data, image/video/TTS
  store/           # in-memory session store

src/
  api/             # fetch wrappers for each backend endpoint
  store/           # Zustand store (session, timeline, fork, narration state)
  App.jsx          # all UI components and routing
```
