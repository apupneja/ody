export class WorldState {
  constructor({ entities = {}, facts = {}, causalVars = {} }) {
    this.entities = Object.freeze(structuredClone(entities));
    this.facts = Object.freeze(structuredClone(facts));
    this.causalVars = Object.freeze({
      escalation: 50,
      logistics: 50,
      intelligence: 50,
      morale: 50,
      techLevel: 50,
      ...causalVars,
    });
    Object.freeze(this);
  }

  applyDelta(delta) {
    if (!delta) return this;

    const entities = structuredClone(this.entities);
    const facts = structuredClone(this.facts);
    const causalVars = { ...this.causalVars };

    if (delta.entityChanges) {
      for (const change of delta.entityChanges) {
        if (!entities[change.entityId]) {
          entities[change.entityId] = { type: "unknown", name: change.entityId, status: "unknown", properties: {} };
        }
        const entity = entities[change.entityId];
        if (change.field === "properties" && typeof change.newValue === "object") {
          entity.properties = { ...entity.properties, ...change.newValue };
        } else if (change.field.startsWith("properties.")) {
          const propKey = change.field.slice("properties.".length);
          entity.properties = { ...entity.properties, [propKey]: change.newValue };
        } else {
          entity[change.field] = change.newValue;
        }
      }
    }

    if (delta.factChanges) {
      for (const change of delta.factChanges) {
        if (change.newValue === null) {
          delete facts[change.factId];
        } else if (typeof change.newValue === "object") {
          facts[change.factId] = change.newValue;
        } else {
          if (facts[change.factId]) {
            facts[change.factId] = { ...facts[change.factId], statement: change.newValue };
          } else {
            facts[change.factId] = { type: "soft", statement: change.newValue, confidence: 80 };
          }
        }
      }
    }

    if (delta.causalVarChanges) {
      for (const change of delta.causalVarChanges) {
        if (change.varName in causalVars) {
          causalVars[change.varName] = Math.max(0, Math.min(100, causalVars[change.varName] + change.delta));
        }
      }
    }

    return new WorldState({ entities, facts, causalVars });
  }

  diff(other) {
    const diffs = [];

    const allEntityIds = new Set([...Object.keys(this.entities), ...Object.keys(other.entities)]);
    for (const id of allEntityIds) {
      const a = this.entities[id];
      const b = other.entities[id];
      if (!a && b) {
        diffs.push({ type: "entity", key: id, from: null, to: b });
      } else if (a && !b) {
        diffs.push({ type: "entity", key: id, from: a, to: null });
      } else if (a && b) {
        for (const field of new Set([...Object.keys(a), ...Object.keys(b)])) {
          if (field === "properties") continue;
          if (a[field] !== b[field]) {
            diffs.push({ type: "entity", key: id, field, from: a[field], to: b[field] });
          }
        }
        if (a.properties || b.properties) {
          const propsA = a.properties || {};
          const propsB = b.properties || {};
          for (const pk of new Set([...Object.keys(propsA), ...Object.keys(propsB)])) {
            if (propsA[pk] !== propsB[pk]) {
              diffs.push({ type: "entity", key: id, field: `properties.${pk}`, from: propsA[pk], to: propsB[pk] });
            }
          }
        }
      }
    }

    const allFactIds = new Set([...Object.keys(this.facts), ...Object.keys(other.facts)]);
    for (const id of allFactIds) {
      const a = this.facts[id];
      const b = other.facts[id];
      if (!a && b) {
        diffs.push({ type: "fact", key: id, from: null, to: b });
      } else if (a && !b) {
        diffs.push({ type: "fact", key: id, from: a, to: null });
      } else if (a && b) {
        if (a.statement !== b.statement || a.confidence !== b.confidence || a.type !== b.type) {
          diffs.push({ type: "fact", key: id, from: a, to: b });
        }
      }
    }

    for (const varName of Object.keys(this.causalVars)) {
      if (this.causalVars[varName] !== other.causalVars[varName]) {
        diffs.push({ type: "causalVar", key: varName, from: this.causalVars[varName], to: other.causalVars[varName] });
      }
    }

    return diffs;
  }

  toJSON() {
    return {
      entities: this.entities,
      facts: this.facts,
      causalVars: this.causalVars,
    };
  }

  static fromJSON(json) {
    return new WorldState(json);
  }
}
