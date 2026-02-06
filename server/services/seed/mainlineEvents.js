import { WorldState } from "../../models/WorldState.js";
import { INITIAL_ENTITIES, INITIAL_FACTS, INITIAL_CAUSAL_VARS } from "./worldStateBase.js";

const MAINLINE_EVENT_DATA = [
  {
    eventSpec: { title: "Invasion of Poland", description: "Germany launches a blitzkrieg invasion of Poland, triggering declarations of war from Britain and France.", category: "military" },
    timestamp: "1939-09-01",
    deltas: null,
  },
  {
    eventSpec: { title: "Fall of France", description: "Germany bypasses the Maginot Line through the Ardennes, leading to the swift collapse and occupation of France.", category: "military" },
    timestamp: "1940-06-22",
    deltas: {
      entityChanges: [
        { entityId: "france", field: "status", oldValue: "at-war", newValue: "occupied" },
        { entityId: "uk", field: "properties.leader", oldValue: "chamberlain", newValue: "churchill" },
        { entityId: "churchill", field: "properties.role", oldValue: "politician", newValue: "prime-minister" },
      ],
      factChanges: [
        { factId: "france-fallen", oldValue: null, newValue: { type: "hard", statement: "France has surrendered and is under German occupation", confidence: 100 } },
        { factId: "vichy-regime", oldValue: null, newValue: { type: "hard", statement: "A collaborationist Vichy government controls southern France", confidence: 100 } },
        { factId: "dunkirk-evacuation", oldValue: null, newValue: { type: "hard", statement: "Over 300,000 Allied troops were evacuated from Dunkirk", confidence: 100 } },
      ],
      causalVarChanges: [
        { varName: "escalation", delta: 10 },
        { varName: "morale", delta: -10 },
        { varName: "logistics", delta: 5 },
      ],
    },
  },
  {
    eventSpec: { title: "Attack on Pearl Harbor", description: "Japan launches a surprise attack on the US naval base at Pearl Harbor, bringing America into the war. Germany invades the Soviet Union, shattering the Molotov-Ribbentrop Pact and opening the Eastern Front.", category: "military" },
    timestamp: "1941-12-07",
    deltas: {
      entityChanges: [
        { entityId: "usa", field: "status", oldValue: "neutral", newValue: "at-war" },
        { entityId: "usa", field: "properties.military", oldValue: "small", newValue: "mobilizing" },
        { entityId: "japan", field: "properties.territory", oldValue: "east-asia-pacific", newValue: "expanded-pacific" },
        // Consolidated from Barbarossa
        { entityId: "ussr", field: "status", oldValue: "neutral", newValue: "at-war" },
        { entityId: "germany", field: "properties.territory", oldValue: "central-europe", newValue: "central-and-eastern-europe" },
        // Consolidated from Battle of Britain
        { entityId: "uk", field: "status", oldValue: "at-war", newValue: "defending" },
      ],
      factChanges: [
        { factId: "us-neutrality", oldValue: { type: "hard", statement: "The United States maintains official neutrality", confidence: 100 }, newValue: { type: "hard", statement: "The United States has declared war on Japan and the Axis powers", confidence: 100 } },
        { factId: "pearl-harbor", oldValue: null, newValue: { type: "hard", statement: "Japan destroyed much of the US Pacific Fleet at Pearl Harbor", confidence: 100 } },
        { factId: "us-industrial-mobilization", oldValue: null, newValue: { type: "soft", statement: "US industrial capacity is rapidly converting to war production", confidence: 95 } },
        // Consolidated from Barbarossa
        { factId: "molotov-ribbentrop", oldValue: { type: "hard", statement: "Germany and USSR have a non-aggression pact", confidence: 100 }, newValue: { type: "hard", statement: "Germany has broken the non-aggression pact by invading the USSR", confidence: 100 } },
        { factId: "eastern-front", oldValue: null, newValue: { type: "hard", statement: "A massive Eastern Front stretches from the Baltic to the Black Sea", confidence: 100 } },
        { factId: "lend-lease", oldValue: null, newValue: { type: "soft", statement: "The US is providing material support to the Allies through Lend-Lease", confidence: 90 } },
        // Consolidated from Battle of Britain
        { factId: "raf-victory", oldValue: null, newValue: { type: "hard", statement: "The RAF has won air superiority over Britain, thwarting invasion plans", confidence: 100 } },
      ],
      causalVarChanges: [
        { varName: "escalation", delta: 15 },
        { varName: "logistics", delta: 10 },
        { varName: "morale", delta: 5 },
        { varName: "techLevel", delta: 5 },
        // Consolidated from Barbarossa + Battle of Britain
        { varName: "intelligence", delta: 10 },
      ],
    },
  },
  {
    eventSpec: { title: "D-Day Invasion", description: "Allied forces launch the largest amphibious invasion in history on the beaches of Normandy. The Soviet Union crushes the German 6th Army at Stalingrad and counterattacks westward, squeezing Germany on two fronts.", category: "military" },
    timestamp: "1944-06-06",
    deltas: {
      entityChanges: [
        { entityId: "france", field: "status", oldValue: "occupied", newValue: "liberation-in-progress" },
        { entityId: "germany", field: "status", oldValue: "aggressive", newValue: "retreating" },
        // Consolidated from Stalingrad
        { entityId: "ussr", field: "status", oldValue: "at-war", newValue: "counterattacking" },
        // Consolidated from Midway
        { entityId: "japan", field: "properties.military", oldValue: "strong-navy", newValue: "weakened-navy" },
        { entityId: "usa", field: "properties.military", oldValue: "mobilizing", newValue: "strong" },
      ],
      factChanges: [
        { factId: "western-front-opened", oldValue: null, newValue: { type: "hard", statement: "Allied forces have established a beachhead in Normandy and are advancing through France", confidence: 100 } },
        { factId: "vichy-regime", oldValue: { type: "hard", statement: "A collaborationist Vichy government controls southern France", confidence: 100 }, newValue: { type: "hard", statement: "The Vichy regime is collapsing as Allied forces advance", confidence: 95 } },
        { factId: "two-front-war", oldValue: null, newValue: { type: "hard", statement: "Germany is fighting a two-front war and losing on both", confidence: 100 } },
        // Consolidated from Stalingrad
        { factId: "stalingrad-defeat", oldValue: null, newValue: { type: "hard", statement: "The German 6th Army has been destroyed at Stalingrad with 800,000 casualties", confidence: 100 } },
        { factId: "eastern-front-turning", oldValue: null, newValue: { type: "hard", statement: "The initiative on the Eastern Front has shifted to the Soviet Union", confidence: 100 } },
        // Consolidated from Midway
        { factId: "midway-victory", oldValue: null, newValue: { type: "hard", statement: "The US sank four Japanese carriers at Midway, shifting Pacific momentum", confidence: 100 } },
        { factId: "code-breaking", oldValue: null, newValue: { type: "soft", statement: "Allied codebreakers are decrypting Axis communications", confidence: 85 } },
      ],
      causalVarChanges: [
        { varName: "logistics", delta: 10 },
        { varName: "morale", delta: 10 },
        { varName: "techLevel", delta: 5 },
        // Consolidated from Midway + Stalingrad
        { varName: "intelligence", delta: 15 },
      ],
    },
  },
  {
    eventSpec: { title: "V-J Day", description: "After atomic bombs are dropped on Hiroshima and Nagasaki, Japan surrenders unconditionally. Berlin has fallen, Hitler is dead, and the war in Europe is already over. World War II ends.", category: "military" },
    timestamp: "1945-08-15",
    deltas: {
      entityChanges: [
        { entityId: "japan", field: "status", oldValue: "aggressive", newValue: "defeated" },
        { entityId: "usa", field: "status", oldValue: "at-war", newValue: "victorious" },
        { entityId: "ussr", field: "status", oldValue: "counterattacking", newValue: "superpower" },
        // Consolidated from Fall of Berlin
        { entityId: "germany", field: "status", oldValue: "retreating", newValue: "defeated" },
        { entityId: "hitler", field: "status", oldValue: "alive", newValue: "dead" },
        { entityId: "france", field: "status", oldValue: "liberation-in-progress", newValue: "liberated" },
        { entityId: "italy", field: "status", oldValue: "aggressive", newValue: "defeated" },
        { entityId: "mussolini", field: "status", oldValue: "alive", newValue: "dead" },
      ],
      factChanges: [
        { factId: "atomic-bombs", oldValue: null, newValue: { type: "hard", statement: "The US dropped atomic bombs on Hiroshima and Nagasaki", confidence: 100 } },
        { factId: "japan-surrendered", oldValue: null, newValue: { type: "hard", statement: "Japan has surrendered. World War II is over.", confidence: 100 } },
        { factId: "nuclear-age", oldValue: null, newValue: { type: "hard", statement: "The world has entered the nuclear age", confidence: 100 } },
        { factId: "united-nations", oldValue: null, newValue: { type: "soft", statement: "A new international order is being established through the United Nations", confidence: 90 } },
        // Consolidated from Fall of Berlin
        { factId: "germany-surrendered", oldValue: null, newValue: { type: "hard", statement: "Germany has surrendered unconditionally. The war in Europe is over.", confidence: 100 } },
        { factId: "hitler-dead", oldValue: null, newValue: { type: "hard", statement: "Hitler died in his Berlin bunker", confidence: 100 } },
        { factId: "occupation-zones", oldValue: null, newValue: { type: "hard", statement: "Germany is divided into Allied occupation zones", confidence: 100 } },
      ],
      causalVarChanges: [
        { varName: "escalation", delta: -35 },
        { varName: "techLevel", delta: 20 },
        { varName: "morale", delta: 10 },
      ],
    },
  },
];

export function buildMainlineEvents() {
  let currentState = new WorldState({
    entities: INITIAL_ENTITIES,
    facts: INITIAL_FACTS,
    causalVars: INITIAL_CAUSAL_VARS,
  });

  return MAINLINE_EVENT_DATA.map((eventData, index) => {
    if (eventData.deltas) {
      currentState = currentState.applyDelta(eventData.deltas);
    }
    return {
      id: `main-${index}`,
      eventSpec: eventData.eventSpec,
      timestamp: eventData.timestamp,
      deltas: eventData.deltas,
      worldState: currentState,
    };
  });
}
