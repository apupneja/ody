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
    eventSpec: { title: "Battle of Britain", description: "The RAF defends Britain against the Luftwaffe's sustained bombing campaign, preventing a German invasion of the British Isles.", category: "military" },
    timestamp: "1940-09-15",
    deltas: {
      entityChanges: [
        { entityId: "uk", field: "status", oldValue: "at-war", newValue: "defending" },
      ],
      factChanges: [
        { factId: "raf-victory", oldValue: null, newValue: { type: "hard", statement: "The RAF has won air superiority over Britain, thwarting invasion plans", confidence: 100 } },
        { factId: "blitz-bombing", oldValue: null, newValue: { type: "hard", statement: "German bombers are conducting nightly raids on London and British cities", confidence: 100 } },
      ],
      causalVarChanges: [
        { varName: "morale", delta: 15 },
        { varName: "intelligence", delta: 10 },
        { varName: "techLevel", delta: 5 },
      ],
    },
  },
  {
    eventSpec: { title: "Operation Barbarossa", description: "Germany launches a massive invasion of the Soviet Union, breaking the Molotov-Ribbentrop Pact and opening the Eastern Front.", category: "military" },
    timestamp: "1941-06-22",
    deltas: {
      entityChanges: [
        { entityId: "ussr", field: "status", oldValue: "neutral", newValue: "at-war" },
        { entityId: "germany", field: "properties.territory", oldValue: "central-europe", newValue: "central-and-eastern-europe" },
      ],
      factChanges: [
        { factId: "molotov-ribbentrop", oldValue: { type: "hard", statement: "Germany and USSR have a non-aggression pact", confidence: 100 }, newValue: { type: "hard", statement: "Germany has broken the non-aggression pact by invading the USSR", confidence: 100 } },
        { factId: "eastern-front", oldValue: null, newValue: { type: "hard", statement: "A massive Eastern Front stretches from the Baltic to the Black Sea", confidence: 100 } },
        { factId: "lend-lease", oldValue: null, newValue: { type: "soft", statement: "The US is providing material support to the Allies through Lend-Lease", confidence: 90 } },
      ],
      causalVarChanges: [
        { varName: "escalation", delta: 15 },
        { varName: "logistics", delta: -10 },
        { varName: "morale", delta: -5 },
      ],
    },
  },
  {
    eventSpec: { title: "Attack on Pearl Harbor", description: "Japan launches a surprise attack on the US naval base at Pearl Harbor, bringing America into the war.", category: "military" },
    timestamp: "1941-12-07",
    deltas: {
      entityChanges: [
        { entityId: "usa", field: "status", oldValue: "neutral", newValue: "at-war" },
        { entityId: "usa", field: "properties.military", oldValue: "small", newValue: "mobilizing" },
        { entityId: "japan", field: "properties.territory", oldValue: "east-asia-pacific", newValue: "expanded-pacific" },
      ],
      factChanges: [
        { factId: "us-neutrality", oldValue: { type: "hard", statement: "The United States maintains official neutrality", confidence: 100 }, newValue: { type: "hard", statement: "The United States has declared war on Japan and the Axis powers", confidence: 100 } },
        { factId: "pearl-harbor", oldValue: null, newValue: { type: "hard", statement: "Japan destroyed much of the US Pacific Fleet at Pearl Harbor", confidence: 100 } },
        { factId: "us-industrial-mobilization", oldValue: null, newValue: { type: "soft", statement: "US industrial capacity is rapidly converting to war production", confidence: 95 } },
      ],
      causalVarChanges: [
        { varName: "escalation", delta: 15 },
        { varName: "logistics", delta: 10 },
        { varName: "morale", delta: 5 },
        { varName: "techLevel", delta: 5 },
      ],
    },
  },
  {
    eventSpec: { title: "Battle of Midway", description: "The US Navy decisively defeats the Japanese fleet at Midway, turning the tide in the Pacific theater.", category: "military" },
    timestamp: "1942-06-04",
    deltas: {
      entityChanges: [
        { entityId: "japan", field: "properties.military", oldValue: "strong-navy", newValue: "weakened-navy" },
        { entityId: "usa", field: "properties.military", oldValue: "mobilizing", newValue: "strong" },
      ],
      factChanges: [
        { factId: "midway-victory", oldValue: null, newValue: { type: "hard", statement: "The US sank four Japanese carriers at Midway, shifting Pacific momentum", confidence: 100 } },
        { factId: "code-breaking", oldValue: null, newValue: { type: "soft", statement: "Allied codebreakers are decrypting Axis communications", confidence: 85 } },
      ],
      causalVarChanges: [
        { varName: "intelligence", delta: 15 },
        { varName: "morale", delta: 10 },
        { varName: "logistics", delta: 5 },
      ],
    },
  },
  {
    eventSpec: { title: "Battle of Stalingrad", description: "The Soviet Union encircles and destroys the German 6th Army at Stalingrad, marking the turning point on the Eastern Front.", category: "military" },
    timestamp: "1943-02-02",
    deltas: {
      entityChanges: [
        { entityId: "germany", field: "status", oldValue: "aggressive", newValue: "overstretched" },
        { entityId: "ussr", field: "status", oldValue: "at-war", newValue: "counterattacking" },
      ],
      factChanges: [
        { factId: "stalingrad-defeat", oldValue: null, newValue: { type: "hard", statement: "The German 6th Army has been destroyed at Stalingrad with 800,000 casualties", confidence: 100 } },
        { factId: "eastern-front-turning", oldValue: null, newValue: { type: "hard", statement: "The initiative on the Eastern Front has shifted to the Soviet Union", confidence: 100 } },
      ],
      causalVarChanges: [
        { varName: "morale", delta: 10 },
        { varName: "escalation", delta: 5 },
        { varName: "logistics", delta: -5 },
      ],
    },
  },
  {
    eventSpec: { title: "D-Day Invasion", description: "Allied forces launch the largest amphibious invasion in history on the beaches of Normandy, establishing a Western Front in France.", category: "military" },
    timestamp: "1944-06-06",
    deltas: {
      entityChanges: [
        { entityId: "france", field: "status", oldValue: "occupied", newValue: "liberation-in-progress" },
        { entityId: "germany", field: "status", oldValue: "overstretched", newValue: "retreating" },
      ],
      factChanges: [
        { factId: "western-front-opened", oldValue: null, newValue: { type: "hard", statement: "Allied forces have established a beachhead in Normandy and are advancing through France", confidence: 100 } },
        { factId: "vichy-regime", oldValue: { type: "hard", statement: "A collaborationist Vichy government controls southern France", confidence: 100 }, newValue: { type: "hard", statement: "The Vichy regime is collapsing as Allied forces advance", confidence: 95 } },
        { factId: "two-front-war", oldValue: null, newValue: { type: "hard", statement: "Germany is fighting a two-front war and losing on both", confidence: 100 } },
      ],
      causalVarChanges: [
        { varName: "logistics", delta: 10 },
        { varName: "morale", delta: 10 },
        { varName: "techLevel", delta: 5 },
      ],
    },
  },
  {
    eventSpec: { title: "Fall of Berlin", description: "Soviet forces storm Berlin. Hitler dies in his bunker. Germany surrenders unconditionally, ending the war in Europe.", category: "military" },
    timestamp: "1945-04-30",
    deltas: {
      entityChanges: [
        { entityId: "germany", field: "status", oldValue: "retreating", newValue: "defeated" },
        { entityId: "hitler", field: "status", oldValue: "alive", newValue: "dead" },
        { entityId: "france", field: "status", oldValue: "liberation-in-progress", newValue: "liberated" },
        { entityId: "italy", field: "status", oldValue: "aggressive", newValue: "defeated" },
        { entityId: "mussolini", field: "status", oldValue: "alive", newValue: "dead" },
      ],
      factChanges: [
        { factId: "germany-surrendered", oldValue: null, newValue: { type: "hard", statement: "Germany has surrendered unconditionally. The war in Europe is over.", confidence: 100 } },
        { factId: "hitler-dead", oldValue: null, newValue: { type: "hard", statement: "Hitler died in his Berlin bunker", confidence: 100 } },
        { factId: "occupation-zones", oldValue: null, newValue: { type: "hard", statement: "Germany is divided into Allied occupation zones", confidence: 100 } },
      ],
      causalVarChanges: [
        { varName: "escalation", delta: -20 },
        { varName: "morale", delta: 15 },
      ],
    },
  },
  {
    eventSpec: { title: "V-J Day", description: "After atomic bombs are dropped on Hiroshima and Nagasaki, Japan surrenders unconditionally, ending World War II.", category: "military" },
    timestamp: "1945-08-15",
    deltas: {
      entityChanges: [
        { entityId: "japan", field: "status", oldValue: "aggressive", newValue: "defeated" },
        { entityId: "usa", field: "status", oldValue: "at-war", newValue: "victorious" },
        { entityId: "ussr", field: "status", oldValue: "counterattacking", newValue: "superpower" },
      ],
      factChanges: [
        { factId: "atomic-bombs", oldValue: null, newValue: { type: "hard", statement: "The US dropped atomic bombs on Hiroshima and Nagasaki", confidence: 100 } },
        { factId: "japan-surrendered", oldValue: null, newValue: { type: "hard", statement: "Japan has surrendered. World War II is over.", confidence: 100 } },
        { factId: "nuclear-age", oldValue: null, newValue: { type: "hard", statement: "The world has entered the nuclear age", confidence: 100 } },
        { factId: "united-nations", oldValue: null, newValue: { type: "soft", statement: "A new international order is being established through the United Nations", confidence: 90 } },
      ],
      causalVarChanges: [
        { varName: "escalation", delta: -15 },
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
