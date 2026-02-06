export class RenderPack {
  constructor({
    id,
    eventNodeId,
    anchorImageUrl = null,
    sceneBible = "",
    microPromptSchedule = [],
    clipUrl = null,
    narrationText = null,
  }) {
    this.id = id ?? crypto.randomUUID();
    this.eventNodeId = eventNodeId;
    this.anchorImageUrl = anchorImageUrl;
    this.sceneBible = sceneBible;
    this.microPromptSchedule = microPromptSchedule;
    this.clipUrl = clipUrl;
    this.narrationText = narrationText;
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
    };
  }

  static fromJSON(json) {
    return new RenderPack(json);
  }
}
