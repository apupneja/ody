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
  return `[${category.toUpperCase()}] ${title}\n\n${description}\n\nWorld state: escalation=${cv.escalation}, logistics=${cv.logistics}, intelligence=${cv.intelligence}, morale=${cv.morale}, techLevel=${cv.techLevel}\n\nDynamics: Use very slight movements only — gentle smoke drift, faint breeze on fabric, slowly shifting light. Stative present-continuous descriptions. Fixed or very slowly drifting camera.`;
}

function buildMicroPrompts(eventNode) {
  return [
    { offsetSec: 0, prompt: `Wide establishing shot of ${eventNode.eventSpec.title}. Atmosphere is still, light is slowly shifting, faint haze is drifting across the frame. Camera is static, deep focus.` },
    { offsetSec: 5, prompt: `Medium shot, key moment: ${eventNode.eventSpec.description}. Dust motes are floating in shafts of light, subtle shadows are creeping across surfaces. Camera is gently drifting closer, shallow focus.` },
    { offsetSec: 10, prompt: `Slow pull-back, aftermath. Smoke is barely curling upward, ambient light is gradually dimming. Camera is slowly retreating, wide-angle lens.` },
  ];
}
