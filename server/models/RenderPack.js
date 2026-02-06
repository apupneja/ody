export class RenderPack {
  constructor({
    id,
    eventNodeId,
    anchorImageUrl = null,
    sceneBible = "",
    microPromptSchedule = [],
    clipUrl = null,
    narrationText = null,
    audioUrl = null,
  }) {
    this.id = id ?? crypto.randomUUID();
    this.eventNodeId = eventNodeId;
    this.anchorImageUrl = anchorImageUrl;
    this.sceneBible = sceneBible;
    this.microPromptSchedule = microPromptSchedule;
    this.clipUrl = clipUrl;
    this.narrationText = narrationText;
    this.audioUrl = audioUrl;
  }

  toJSON() {
    return {
      id: this.id,
      eventNodeId: this.eventNodeId,
      anchorImageUrl: this.anchorImageUrl,
      sceneBible: this.sceneBible,
      microPromptSchedule: this.microPromptSchedule,
      clipUrl: this.clipUrl,
      narrationText: this.narrationText,
      audioUrl: this.audioUrl,
    };
  }

  static fromJSON(json) {
    return new RenderPack(json);
  }
}
