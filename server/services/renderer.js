import { RenderPack } from "../models/RenderPack.js";

export function generateRenderPack(eventNode) {
  return new RenderPack({
    eventNodeId: eventNode.id,
    anchorImageUrl: null,
    sceneBible: buildSceneBible(eventNode),
    microPromptSchedule: buildMicroPrompts(eventNode),
    clipUrl: null,
    narrationText: null,
  });
}

function buildSceneBible(eventNode) {
  const { title, description, category } = eventNode.eventSpec;
  const cv = eventNode.worldState.causalVars;
  return `[${category.toUpperCase()}] ${title}\n\n${description}\n\nWorld state: escalation=${cv.escalation}, logistics=${cv.logistics}, intelligence=${cv.intelligence}, morale=${cv.morale}, techLevel=${cv.techLevel}`;
}

function buildMicroPrompts(eventNode) {
  return [
    { offsetSec: 0, prompt: `Establishing shot: ${eventNode.eventSpec.title}` },
    { offsetSec: 5, prompt: `Key moment: ${eventNode.eventSpec.description}` },
    { offsetSec: 10, prompt: `Aftermath and transition` },
  ];
}
