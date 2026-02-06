// Branch seeds for the Battle of Midway fork point (June 1942)

export const MIDWAY_BRANCHES = [
  // Branch 1: Japan wins at Midway
  {
    forkDescription: "Japan's carriers evade US ambush at Midway. American dive bombers arrive minutes too late, finding empty ocean. Japan sinks the Yorktown, Enterprise, and Hornet, shattering US carrier strength in the Pacific.",
    matchKeywords: ["midway", "japanese victory", "carrier battle", "pacific naval", "us navy defeat"],
    forkDelta: {
      entityChanges: [
        { entityId: "japan", field: "properties.military", oldValue: "strong-navy", newValue: "dominant-navy" },
        { entityId: "usa", field: "properties.military", oldValue: "mobilizing", newValue: "weakened-navy" },
      ],
      factChanges: [
        { factId: "midway-victory", oldValue: null, newValue: { type: "hard", statement: "Japan sank three US carriers at Midway, securing Pacific dominance", confidence: 100 } },
        { factId: "pacific-momentum", oldValue: null, newValue: { type: "hard", statement: "Japan controls the central Pacific and threatens Hawaii", confidence: 95 } },
      ],
      causalVarChanges: [
        { varName: "morale", delta: -15 },
        { varName: "logistics", delta: -10 },
        { varName: "intelligence", delta: -5 },
      ],
    },
    forkEventSpec: {
      title: "Japanese Victory at Midway",
      description: "Japan's carriers evade detection and destroy the US Pacific Fleet's carrier force, establishing naval supremacy across the central Pacific.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "Japanese Invasion of Fiji and Samoa",
          description: "Emboldened by Midway, Japan seizes Fiji and Samoa to sever the US-Australia supply line, isolating the southern Pacific.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "japan", field: "properties.territory", oldValue: "expanded-pacific", newValue: "deep-pacific" },
          ],
          factChanges: [
            { factId: "australia-isolated", oldValue: null, newValue: { type: "soft", statement: "Australia is increasingly cut off from American resupply", confidence: 80 } },
          ],
          causalVarChanges: [
            { varName: "logistics", delta: -10 },
            { varName: "escalation", delta: 5 },
          ],
        },
        timestamp: "1942-10-15",
      },
      {
        eventSpec: {
          title: "US Emergency Carrier Program",
          description: "Roosevelt orders a crash shipbuilding program. Essex-class carriers are fast-tracked, but the US cannot contest the Pacific for eighteen months.",
          category: "political",
        },
        deltas: {
          entityChanges: [
            { entityId: "usa", field: "properties.industry", oldValue: "massive", newValue: "war-overdrive" },
          ],
          factChanges: [
            { factId: "carrier-gap", oldValue: null, newValue: { type: "hard", statement: "The US faces an 18-month gap in carrier capability in the Pacific", confidence: 90 } },
          ],
          causalVarChanges: [
            { varName: "techLevel", delta: 10 },
            { varName: "morale", delta: 5 },
          ],
        },
        timestamp: "1942-12-01",
      },
    ],
    branchPriors: { plausibility: 30, coherence: 85, novelty: 50 },
    renderPack: {
      sceneBible: "Smoke-blackened Pacific sky. Three American carriers list and burn on a grey sea. Japanese Zeros circle overhead in triumph. On the bridge of the Akagi, Admiral Nagumo watches through binoculars as the last US flattop rolls onto its side.",
      anchorImageUrl: null,
    },
  },

  // Branch 2: US codebreakers fail to decrypt Japanese plans
  {
    forkDescription: "Commander Rochefort's team at Station HYPO fails to confirm that 'AF' designates Midway. Without actionable intelligence, Nimitz cannot position his carriers for an ambush. The battle becomes a chaotic meeting engagement.",
    matchKeywords: ["codebreaking", "intelligence failure", "hypo", "jn-25", "midway ambush"],
    forkDelta: {
      entityChanges: [
        { entityId: "usa", field: "properties.military", oldValue: "mobilizing", newValue: "disorganized-pacific" },
        { entityId: "japan", field: "properties.military", oldValue: "strong-navy", newValue: "strong-navy" },
      ],
      factChanges: [
        { factId: "code-breaking", oldValue: null, newValue: { type: "soft", statement: "Allied codebreaking efforts have stalled against revised Japanese naval ciphers", confidence: 70 } },
        { factId: "midway-stalemate", oldValue: null, newValue: { type: "hard", statement: "Midway was a costly draw; both sides lost two carriers", confidence: 95 } },
      ],
      causalVarChanges: [
        { varName: "intelligence", delta: -15 },
        { varName: "morale", delta: -5 },
        { varName: "logistics", delta: -5 },
      ],
    },
    forkEventSpec: {
      title: "Intelligence Failure at Midway",
      description: "US codebreakers fail to decrypt Japanese plans in time. Without forewarning, the Battle of Midway becomes a bloody stalemate with heavy losses on both sides.",
      category: "intelligence",
    },
    continuations: [
      {
        eventSpec: {
          title: "Prolonged Pacific Stalemate",
          description: "Neither navy can achieve decisive superiority. The Pacific war bogs down into an attritional island-hopping campaign with no clear momentum.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "usa", field: "properties.military", oldValue: "disorganized-pacific", newValue: "rebuilding" },
          ],
          factChanges: [
            { factId: "pacific-attrition", oldValue: null, newValue: { type: "hard", statement: "The Pacific theater has become a grinding attritional campaign", confidence: 90 } },
          ],
          causalVarChanges: [
            { varName: "logistics", delta: -5 },
            { varName: "morale", delta: -5 },
          ],
        },
        timestamp: "1943-01-15",
      },
      {
        eventSpec: {
          title: "Roosevelt Prioritizes Europe First",
          description: "With no Pacific breakthrough in sight, Roosevelt doubles down on the Europe-first strategy, diverting even more resources to the Atlantic and North Africa.",
          category: "political",
        },
        deltas: {
          entityChanges: [
            { entityId: "usa", field: "properties.military", oldValue: "rebuilding", newValue: "europe-focused" },
          ],
          factChanges: [
            { factId: "europe-first-hardened", oldValue: null, newValue: { type: "soft", statement: "US grand strategy tilts decisively toward Europe at the expense of the Pacific", confidence: 85 } },
          ],
          causalVarChanges: [
            { varName: "logistics", delta: 5 },
            { varName: "escalation", delta: 5 },
          ],
        },
        timestamp: "1943-04-01",
      },
    ],
    branchPriors: { plausibility: 40, coherence: 90, novelty: 45 },
    renderPack: {
      sceneBible: "A cramped basement in Pearl Harbor, littered with coffee cups and cigarette butts. Cryptanalysts stare at sheets of garbled intercepts. A wallboard map of the Pacific shows question marks over a dozen possible Japanese targets. Rochefort removes his smoking jacket and slumps into a chair, defeated.",
      anchorImageUrl: null,
    },
  },

  // Branch 3: Japan and USSR sign a separate peace
  {
    forkDescription: "Facing the threat of a two-front war, Japan negotiates an expanded neutrality pact with the Soviet Union in spring 1942. Stalin, desperate to focus on Germany, agrees. Japan redirects its Kwantung Army resources to the Pacific offensive.",
    matchKeywords: ["japan soviet peace", "neutrality pact", "kwantung army", "two-front war", "japanese diplomacy"],
    forkDelta: {
      entityChanges: [
        { entityId: "japan", field: "properties.military", oldValue: "strong-navy", newValue: "consolidated-forces" },
        { entityId: "ussr", field: "properties.military", oldValue: "large", newValue: "western-focused" },
      ],
      factChanges: [
        { factId: "japan-ussr-pact", oldValue: null, newValue: { type: "hard", statement: "Japan and the USSR have signed an expanded non-aggression treaty, securing Japan's northern flank", confidence: 100 } },
        { factId: "kwantung-redeployed", oldValue: null, newValue: { type: "soft", statement: "Japan is redeploying Kwantung Army divisions to reinforce Pacific island garrisons", confidence: 85 } },
      ],
      causalVarChanges: [
        { varName: "escalation", delta: -5 },
        { varName: "logistics", delta: 10 },
        { varName: "intelligence", delta: 5 },
      ],
    },
    forkEventSpec: {
      title: "Japanese-Soviet Non-Aggression Expansion",
      description: "Japan and the Soviet Union sign a comprehensive neutrality agreement, freeing both powers to concentrate on their primary theaters of war.",
      category: "diplomatic",
    },
    continuations: [
      {
        eventSpec: {
          title: "Reinforced Pacific Garrisons",
          description: "Japan fortifies its island perimeter with veteran Kwantung Army troops. Guadalcanal becomes a bloodbath for the US Marines.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "japan", field: "properties.territory", oldValue: "expanded-pacific", newValue: "fortified-pacific" },
          ],
          factChanges: [
            { factId: "guadalcanal-bloodbath", oldValue: null, newValue: { type: "hard", statement: "Japanese reinforcements have turned Guadalcanal into a catastrophic attritional battle", confidence: 90 } },
          ],
          causalVarChanges: [
            { varName: "morale", delta: -10 },
            { varName: "logistics", delta: -5 },
          ],
        },
        timestamp: "1942-11-01",
      },
      {
        eventSpec: {
          title: "Stalin's Siberian Gambit",
          description: "With Japan neutralized, Stalin transfers forty Siberian divisions west. The Soviet winter counteroffensive at Moscow is devastatingly effective.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "ussr", field: "status", oldValue: "at-war", newValue: "counterattacking" },
            { entityId: "germany", field: "properties.military", oldValue: "strong", newValue: "stalled" },
          ],
          factChanges: [
            { factId: "siberian-transfer", oldValue: null, newValue: { type: "hard", statement: "Massive Siberian reinforcements have bolstered the Soviet defense of Moscow", confidence: 95 } },
          ],
          causalVarChanges: [
            { varName: "morale", delta: 10 },
            { varName: "escalation", delta: 5 },
          ],
        },
        timestamp: "1943-02-01",
      },
    ],
    branchPriors: { plausibility: 20, coherence: 75, novelty: 70 },
    renderPack: {
      sceneBible: "A wood-paneled diplomatic hall in Moscow. Japanese and Soviet diplomats bow stiffly across a long table. Outside, snow falls on the Kremlin walls. In the Pacific, troop transports steam south from Manchuria loaded with battle-hardened Kwantung soldiers.",
      anchorImageUrl: null,
    },
  },
];
