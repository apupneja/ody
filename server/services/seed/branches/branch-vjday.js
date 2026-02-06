// Branch seeds for the V-J Day fork point (August 1945)

export const VJDAY_BRANCHES = [
  // Branch 1: US decides not to use atomic bombs
  {
    forkDescription: "Truman, swayed by Szilard's petition and Eisenhower's private objections, decides against using the atomic bomb on Japanese cities. Operation Downfall — the invasion of the Japanese home islands — proceeds as planned for November 1945.",
    matchKeywords: ["no atomic bomb", "operation downfall", "invasion japan", "truman decision", "conventional war"],
    forkDelta: {
      entityChanges: [
        { entityId: "usa", field: "properties.military", oldValue: "strong", newValue: "invasion-committed" },
        { entityId: "japan", field: "status", oldValue: "aggressive", newValue: "defending-homeland" },
      ],
      factChanges: [
        { factId: "no-atomic-use", oldValue: null, newValue: { type: "hard", statement: "The US has decided not to use atomic weapons against Japan", confidence: 100 } },
        { factId: "downfall-planned", oldValue: null, newValue: { type: "hard", statement: "Operation Downfall, the invasion of the Japanese home islands, is set for November 1945", confidence: 95 } },
      ],
      causalVarChanges: [
        { varName: "escalation", delta: 10 },
        { varName: "morale", delta: -10 },
        { varName: "logistics", delta: -10 },
      ],
    },
    explanation:
      "Several key figures opposed using the bomb on cities. Leo Szilard circulated a petition signed by 70 Manhattan Project scientists. Eisenhower privately told Stimson it was unnecessary. Even within Truman's inner circle, there was debate about a demonstration shot. The decision to bomb Hiroshima was not inevitable — it was a choice made under immense pressure and uncertainty.",
    forkEventSpec: {
      title: "Truman Rejects Atomic Bomb Use",
      description: "President Truman decides the atomic bomb is too terrible a weapon to use on cities. The US commits to a conventional invasion of Japan projected to cost over a million casualties.",
      category: "political",
    },
    continuations: [
      {
        eventSpec: {
          title: "Operation Olympic — Invasion of Kyushu",
          description: "Fourteen US divisions land on Kyushu beaches against fanatical resistance. Kamikaze attacks sink dozens of ships. Casualties in the first month exceed 100,000.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "usa", field: "properties.military", oldValue: "invasion-committed", newValue: "bogged-down-japan" },
            { entityId: "japan", field: "properties.military", oldValue: "weakened-navy", newValue: "homeland-defense" },
          ],
          factChanges: [
            { factId: "kyushu-invasion", oldValue: null, newValue: { type: "hard", statement: "US forces have invaded Kyushu with devastating casualties on both sides", confidence: 100 } },
            { factId: "kamikaze-toll", oldValue: null, newValue: { type: "hard", statement: "Kamikaze attacks have sunk or damaged over 100 Allied vessels off Kyushu", confidence: 90 } },
          ],
          causalVarChanges: [
            { varName: "morale", delta: -15 },
            { varName: "logistics", delta: -10 },
            { varName: "escalation", delta: 10 },
          ],
        },
        timestamp: "1945-11-15",
      },
      {
        eventSpec: {
          title: "Japanese Civilian Resistance and Famine",
          description: "Millions of Japanese civilians armed with bamboo spears resist the invasion. The naval blockade causes mass starvation. The humanitarian catastrophe dwarfs the projected toll of the atomic bombs.",
          category: "humanitarian",
        },
        deltas: {
          entityChanges: [
            { entityId: "japan", field: "properties.industry", oldValue: "moderate", newValue: "collapsed" },
          ],
          factChanges: [
            { factId: "japan-famine", oldValue: null, newValue: { type: "hard", statement: "Mass famine is devastating the Japanese home islands under continued blockade and invasion", confidence: 90 } },
            { factId: "civilian-resistance", oldValue: null, newValue: { type: "hard", statement: "Japanese civilians are engaged in armed resistance against the American invasion", confidence: 85 } },
          ],
          causalVarChanges: [
            { varName: "morale", delta: -10 },
            { varName: "escalation", delta: 5 },
          ],
        },
        timestamp: "1946-02-01",
      },
    ],
    branchPriors: { plausibility: 25, coherence: 90, novelty: 50 },
    renderPack: {
      sceneBible: "Grey Pacific waters choked with landing craft approach volcanic Kyushu beaches. Kamikaze planes scream down from overcast skies, trailing smoke. Ashore, rice paddies are cratered moonscapes. In Washington, Truman sits alone in the Oval Office, staring at casualty reports stacked a foot high.",
      anchorImageUrl: null,
    },
  },

  // Branch 2: Soviet Union invades Japan from the north
  {
    forkDescription: "Stalin, emboldened by the rapid conquest of Manchuria, launches a full-scale amphibious invasion of Hokkaido in late August 1945. The US, caught off guard, scrambles to prevent a Soviet occupation of northern Japan.",
    matchKeywords: ["soviet invasion japan", "hokkaido", "stalin japan", "soviet amphibious", "divided japan"],
    forkDelta: {
      entityChanges: [
        { entityId: "ussr", field: "status", oldValue: "counterattacking", newValue: "invading-japan" },
        { entityId: "japan", field: "status", oldValue: "aggressive", newValue: "invaded-north-south" },
      ],
      factChanges: [
        { factId: "soviet-hokkaido", oldValue: null, newValue: { type: "hard", statement: "Soviet forces have launched an amphibious invasion of Hokkaido", confidence: 100 } },
        { factId: "divided-japan-risk", oldValue: null, newValue: { type: "soft", statement: "Japan faces partition between Soviet and American occupation zones", confidence: 85 } },
      ],
      causalVarChanges: [
        { varName: "escalation", delta: 15 },
        { varName: "morale", delta: -5 },
        { varName: "logistics", delta: -5 },
      ],
    },
    explanation:
      "Stalin actually planned to invade Hokkaido, and the operation was only called off at the last moment after Truman firmly objected. The Soviets had already seized the Kuril Islands and southern Sakhalin. A divided Japan — like divided Germany and Korea — was a real possibility that would have created a Cold War flashpoint in the heart of the Pacific.",
    forkEventSpec: {
      title: "Soviet Invasion of Hokkaido",
      description: "The Red Army launches a surprise amphibious assault on Hokkaido, racing to establish a Soviet occupation zone in Japan before the Americans can consolidate control.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "Truman's Hokkaido Ultimatum",
          description: "Truman threatens to use atomic weapons to stop the Soviet advance unless Stalin withdraws from Hokkaido. The world holds its breath as the two superpowers face off over Japan.",
          category: "diplomatic",
        },
        deltas: {
          entityChanges: [
            { entityId: "usa", field: "status", oldValue: "at-war", newValue: "nuclear-standoff" },
          ],
          factChanges: [
            { factId: "hokkaido-ultimatum", oldValue: null, newValue: { type: "hard", statement: "The US has threatened nuclear retaliation if the USSR does not withdraw from Hokkaido", confidence: 90 } },
          ],
          causalVarChanges: [
            { varName: "escalation", delta: 15 },
            { varName: "techLevel", delta: 5 },
          ],
        },
        timestamp: "1945-09-01",
      },
      {
        eventSpec: {
          title: "Partition of Japan",
          description: "A tense compromise divides Japan. The USSR occupies Hokkaido and northern Honshu; the US controls the rest. Like Germany and Korea, Japan becomes a divided nation along Cold War lines.",
          category: "political",
        },
        deltas: {
          entityChanges: [
            { entityId: "japan", field: "status", oldValue: "invaded-north-south", newValue: "partitioned" },
            { entityId: "ussr", field: "properties.territory", oldValue: "eastern-europe-asia", newValue: "expanded-east-asia" },
          ],
          factChanges: [
            { factId: "japan-divided", oldValue: null, newValue: { type: "hard", statement: "Japan has been divided into Soviet and American occupation zones", confidence: 95 } },
            { factId: "cold-war-pacific", oldValue: null, newValue: { type: "soft", statement: "The Cold War front line now extends through the heart of Japan", confidence: 90 } },
          ],
          causalVarChanges: [
            { varName: "escalation", delta: -5 },
            { varName: "morale", delta: -10 },
          ],
        },
        timestamp: "1945-10-15",
      },
    ],
    branchPriors: { plausibility: 20, coherence: 85, novelty: 70 },
    renderPack: {
      sceneBible: "Soviet naval infantry pour from flat-bottomed barges onto the rocky shores of Hokkaido. Red flags snap in the Pacific wind. Bewildered Japanese civilians watch from fishing villages. In Tokyo Bay, the USS Missouri's guns train northward. MacArthur and Truman argue over a crackling phone line.",
      anchorImageUrl: null,
    },
  },

  // Branch 3: Japan develops its own nuclear weapon
  {
    forkDescription: "Japan's secret nuclear program under Yoshio Nishina, aided by captured German uranium oxide from U-234, produces a crude plutonium device. Japan detonates it on a Pacific atoll in a desperate demonstration, threatening to use the next one on the US invasion fleet.",
    matchKeywords: ["japanese atomic bomb", "nishina", "japan nuclear", "u-234 uranium", "japanese deterrent"],
    forkDelta: {
      entityChanges: [
        { entityId: "japan", field: "properties.military", oldValue: "weakened-navy", newValue: "nuclear-armed" },
      ],
      factChanges: [
        { factId: "japan-bomb", oldValue: null, newValue: { type: "hard", statement: "Japan has detonated a nuclear device in a demonstration test", confidence: 100 } },
        { factId: "nuclear-stalemate-pacific", oldValue: null, newValue: { type: "hard", statement: "Both the US and Japan possess nuclear weapons, creating a Pacific nuclear standoff", confidence: 95 } },
      ],
      causalVarChanges: [
        { varName: "techLevel", delta: 20 },
        { varName: "escalation", delta: 20 },
        { varName: "morale", delta: -10 },
      ],
    },
    explanation:
      "Japan had two secret nuclear programs during the war — one Army (Ni-Go) and one Navy (F-Go). They lacked sufficient uranium and industrial capacity, but the German submarine U-234, which surrendered in May 1945, was carrying 560 kg of uranium oxide destined for Japan. With more resources or time, a Japanese device was not physically impossible — just extremely unlikely.",
    forkEventSpec: {
      title: "Japanese Nuclear Test",
      description: "Japan detonates a crude nuclear device, becoming the second nation to develop atomic weapons. The Pacific war enters a nuclear standoff.",
      category: "scientific",
    },
    continuations: [
      {
        eventSpec: {
          title: "Nuclear Standoff in the Pacific",
          description: "Neither side dares strike first. The planned American invasion is cancelled. A terrifying nuclear standoff grips the Pacific as both nations build stockpiles.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "usa", field: "properties.military", oldValue: "strong", newValue: "nuclear-deterred" },
            { entityId: "japan", field: "status", oldValue: "aggressive", newValue: "nuclear-standoff" },
          ],
          factChanges: [
            { factId: "invasion-cancelled", oldValue: null, newValue: { type: "hard", statement: "The US has cancelled all plans for a conventional invasion of Japan", confidence: 95 } },
            { factId: "pacific-nuclear-balance", oldValue: null, newValue: { type: "soft", statement: "A fragile nuclear balance of terror holds in the Pacific", confidence: 80 } },
          ],
          causalVarChanges: [
            { varName: "escalation", delta: 5 },
            { varName: "morale", delta: -5 },
          ],
        },
        timestamp: "1945-09-15",
      },
      {
        eventSpec: {
          title: "Negotiated Peace and a Nuclear Asia",
          description: "Facing mutual nuclear annihilation, the US and Japan negotiate a face-saving peace. Japan retains its emperor and some conquered territory. Asia enters the postwar era with two nuclear powers.",
          category: "diplomatic",
        },
        deltas: {
          entityChanges: [
            { entityId: "japan", field: "status", oldValue: "nuclear-standoff", newValue: "nuclear-peace" },
            { entityId: "usa", field: "status", oldValue: "at-war", newValue: "uneasy-peace" },
          ],
          factChanges: [
            { factId: "japan-keeps-empire", oldValue: null, newValue: { type: "soft", statement: "Japan retains the emperor system and limited overseas territory under a negotiated peace", confidence: 75 } },
            { factId: "two-nuclear-powers-asia", oldValue: null, newValue: { type: "hard", statement: "Asia enters the postwar era with Japan as a nuclear-armed power", confidence: 90 } },
          ],
          causalVarChanges: [
            { varName: "escalation", delta: -15 },
            { varName: "techLevel", delta: 10 },
            { varName: "morale", delta: 5 },
          ],
        },
        timestamp: "1945-12-01",
      },
    ],
    branchPriors: { plausibility: 5, coherence: 65, novelty: 95 },
    renderPack: {
      sceneBible: "A mushroom cloud rises over a nameless Pacific atoll, photographed from a Japanese reconnaissance plane. In Tokyo, Nishina removes his goggles and bows to Emperor Hirohito. In Washington, Truman slams his fist on the desk as Stimson delivers the impossible news. The world has two nuclear powers.",
      anchorImageUrl: null,
    },
  },
];
