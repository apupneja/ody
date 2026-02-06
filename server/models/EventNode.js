import { WorldState } from "./WorldState.js";

export class EventNode {
  constructor({
    id,
    parentId = null,
    branchId = "main",
    timestamp,
    eventSpec,
    deltas = null,
    worldState,
    branchPriors = null,
    renderPackId = null,
    children = [],
    isUserFork = false,
    forkDescription = null,
  }) {
    this.id = id ?? crypto.randomUUID();
    this.parentId = parentId;
    this.branchId = branchId;
    this.timestamp = timestamp;
    this.eventSpec = eventSpec;
    this.deltas = deltas;
    this.worldState = worldState;
    this.branchPriors = branchPriors;
    this.renderPackId = renderPackId;
    this.children = children;
    this.isUserFork = isUserFork;
    this.forkDescription = forkDescription;
  }

  toLightweight() {
    return {
      id: this.id,
      title: this.eventSpec.title,
      description: this.eventSpec.description,
      timestamp: this.timestamp,
      category: this.eventSpec.category,
      isUserFork: this.isUserFork,
      branchId: this.branchId,
    };
  }

  toJSON() {
    return {
      id: this.id,
      parentId: this.parentId,
      branchId: this.branchId,
      timestamp: this.timestamp,
      eventSpec: this.eventSpec,
      deltas: this.deltas,
      worldState: this.worldState instanceof WorldState ? this.worldState.toJSON() : this.worldState,
      branchPriors: this.branchPriors,
      renderPackId: this.renderPackId,
      children: this.children,
      isUserFork: this.isUserFork,
      forkDescription: this.forkDescription,
    };
  }

  static fromJSON(json) {
    return new EventNode({
      ...json,
      worldState: json.worldState instanceof WorldState ? json.worldState : WorldState.fromJSON(json.worldState),
    });
  }
}
