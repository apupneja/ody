export const pearlHarborBranches = [
  // Branch 1: Japan never attacks Pearl Harbor
  {
    forkDescription:
      "Admiral Yamamoto's Pearl Harbor plan is overruled by the Imperial Japanese Navy General Staff, who consider it too risky. Japan instead focuses on the Southern Resource Area—seizing Malaya, the Dutch East Indies, and the Philippines—while leaving the US Pacific Fleet untouched, gambling that America will not fight for European colonies.",
    matchKeywords: ["pearl harbor", "yamamoto", "japan", "pacific", "neutrality", "southern resource area"],
    forkDelta: {
      entityChanges: [
        { entityId: "japan", field: "strategy", from: "Pearl Harbor strike", to: "Southern advance without US provocation" },
        { entityId: "usa", field: "warStatus", from: "attacked and mobilized", to: "unattacked and divided" },
        { entityId: "roosevelt", field: "warAuthority", from: "Day of Infamy speech", to: "no casus belli" },
      ],
      factChanges: [
        { fact: "Japan attacks Pearl Harbor December 1941", from: true, to: false },
        { fact: "US enters WW2 in December 1941", from: true, to: false },
      ],
      causalVarChanges: [
        { variable: "usWarEntry", delta: -60 },
        { variable: "japaneseStrategicSurprise", delta: -20 },
        { variable: "pacificFleetIntegrity", delta: 40 },
      ],
    },
    forkEventSpec: {
      title: "The Attack That Never Came",
      description:
        "December 7, 1941 passes quietly at Pearl Harbor. Sailors attend church services. The Kido Butai, never assembled, remains dispersed. Japan's war begins not with a thunderclap but with a whisper—landings in Malaya and the Dutch East Indies that barely make the front page in America.",
      category: "diplomatic",
    },
    continuations: [
      {
        eventSpec: {
          title: "Roosevelt Struggles to Enter the War",
          description:
            "Without Pearl Harbor's unifying shock, Roosevelt cannot bring a divided Congress to declare war. Isolationists rally. The America First Committee celebrates. Roosevelt resorts to escalating economic sanctions and covert aid to Britain and China, but the arsenal of democracy remains half-mobilized.",
          category: "political",
        },
        deltas: {
          entityChanges: [
            { entityId: "usa", field: "domesticPolitics", from: "united for war", to: "bitterly divided" },
            { entityId: "roosevelt", field: "politicalCapital", from: "wartime president", to: "embattled peacetime president" },
          ],
          factChanges: [
            { fact: "US remains technically neutral into 1942", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "usIsolationism", delta: 35 },
            { variable: "alliedWarEffort", delta: -30 },
          ],
        },
        timestamp: "1942-01-15",
      },
      {
        eventSpec: {
          title: "Japan Consolidates the Southern Empire",
          description:
            "Without US naval opposition, Japan's conquest of Southeast Asia proceeds rapidly and cheaply. The Dutch East Indies oil fields fall intact. Malaya and Singapore are overrun. Japan establishes a resource-rich perimeter that, without American industrial might opposing it, may prove impregnable.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "japan", field: "resourceSecurity", from: "desperate", to: "secured via conquest" },
            { entityId: "uk", field: "asianEmpire", from: "intact", to: "collapsing" },
          ],
          factChanges: [
            { fact: "Japan secures East Indies oil without US opposition", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "japaneseEmpireViability", delta: 40 },
            { variable: "britishImperialPrestige", delta: -30 },
          ],
        },
        timestamp: "1942-03-01",
      },
    ],
    branchPriors: { plausibility: 20, coherence: 80, novelty: 55 },
    renderPack: {
      sceneBible:
        "December 7, 1941. Pearl Harbor, quiet and sunlit. Battleship Row gleaming in the morning sun, untouched. Sailors in whites walking the decks. No smoke, no fire, no infamy. Meanwhile, a world away, Japanese landing craft approach Kota Bharu beach in Malaya under monsoon rain—the real war beginning in obscurity.",
      anchorImageUrl: null,
    },
  },

  // Branch 2: US carriers are destroyed at Pearl Harbor
  {
    forkDescription:
      "By cruel coincidence, the USS Enterprise and USS Lexington are in port during the attack. Nagumo launches his debated third wave, targeting the fuel tank farms and submarine base. All eight battleships AND two fleet carriers are destroyed or crippled. The Pacific Fleet ceases to exist as a fighting force.",
    matchKeywords: ["pearl harbor", "carriers", "enterprise", "lexington", "third wave", "fuel tanks"],
    forkDelta: {
      entityChanges: [
        { entityId: "usa", field: "pacificFleetStatus", from: "battleships sunk, carriers survive", to: "total fleet destruction" },
        { entityId: "japan", field: "pacificDominance", from: "temporary advantage", to: "overwhelming superiority" },
        { entityId: "roosevelt", field: "strategicOptions", from: "carrier-based counterattack", to: "no offensive capability" },
      ],
      factChanges: [
        { fact: "US carriers survive Pearl Harbor", from: true, to: false },
        { fact: "Pearl Harbor fuel reserves destroyed", from: false, to: true },
      ],
      causalVarChanges: [
        { variable: "usPacificPower", delta: -70 },
        { variable: "japaneseNavalSuperiority", delta: 50 },
        { variable: "pacificWarTimeline", delta: 30 },
      ],
    },
    forkEventSpec: {
      title: "Total Destruction at Pearl Harbor",
      description:
        "Nagumo orders the third wave. 170 additional aircraft bomb the fuel tank farms at Hospital Point—4.5 million barrels of fuel erupt in a firestorm visible from Maui. The Enterprise and Lexington, caught in port, capsize at their berths. The submarine base is wrecked. Pearl Harbor as a naval facility simply ceases to exist.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "The Pacific Retreat",
          description:
            "With no carriers and no forward fuel reserves, the US Navy withdraws to the West Coast. The Pacific becomes a Japanese lake. Midway, Wake Island, and Guam fall without relief. Australia, cut off from American support, turns to desperate home defense.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "usa", field: "pacificPerimeter", from: "Hawaii", to: "West Coast" },
            { entityId: "japan", field: "pacificControl", from: "western Pacific", to: "central and western Pacific" },
          ],
          factChanges: [
            { fact: "US Navy withdraws to West Coast", from: false, to: true },
            { fact: "Battle of Midway occurs June 1942", from: true, to: false },
          ],
          causalVarChanges: [
            { variable: "japanesePerimeterSize", delta: 40 },
            { variable: "australianVulnerability", delta: 35 },
          ],
        },
        timestamp: "1942-02-01",
      },
      {
        eventSpec: {
          title: "America Turns Atlantic-First",
          description:
            "Unable to mount Pacific operations for at least 18 months, Roosevelt and Marshall commit fully to the Atlantic-first strategy. American forces pour into Britain for a 1943 cross-Channel invasion. The Pacific is a holding action. Japan's empire may stand for years.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "usa", field: "warPriority", from: "Atlantic first, Pacific soon", to: "Atlantic exclusively" },
            { entityId: "uk", field: "americanSupport", from: "split Pacific/Atlantic", to: "concentrated Atlantic" },
          ],
          factChanges: [
            { fact: "US adopts exclusive Atlantic-first strategy", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "europeanLiberationTimeline", delta: -15 },
            { variable: "pacificWarDuration", delta: 30 },
          ],
        },
        timestamp: "1942-03-15",
      },
    ],
    branchPriors: { plausibility: 15, coherence: 75, novelty: 60 },
    renderPack: {
      sceneBible:
        "December 7, 1941. Pearl Harbor in total devastation. The fuel tank farms a wall of orange flame and black smoke rising miles into the sky. The Enterprise listing and sinking at Ford Island, her flight deck buckled. Oil-covered water everywhere, burning. A destruction so complete that even the Japanese pilots circle in disbelief. America's Pacific power—erased in a morning.",
      anchorImageUrl: null,
    },
  },

  // Branch 3: Japan attacks the Soviet Union instead
  {
    forkDescription:
      "The Strike North faction prevails in Tokyo. Rather than attacking Pearl Harbor and seizing Southeast Asia, Japan joins Germany's war against the Soviet Union by invading Siberia in December 1941. The Red Army, already reeling from Barbarossa, faces a catastrophic two-front war.",
    matchKeywords: ["japan", "soviet union", "siberia", "strike north", "kwantung army", "manchuria"],
    forkDelta: {
      entityChanges: [
        { entityId: "japan", field: "warTarget", from: "United States / Western powers", to: "Soviet Union" },
        { entityId: "ussr", field: "easternFront", from: "secured by Sorge intelligence", to: "under Japanese attack" },
        { entityId: "usa", field: "warStatus", from: "belligerent after Pearl Harbor", to: "neutral in Pacific" },
      ],
      factChanges: [
        { fact: "Japan attacks the United States", from: true, to: false },
        { fact: "Japan invades Soviet Siberia", from: false, to: true },
      ],
      causalVarChanges: [
        { variable: "sovietTwoFrontPressure", delta: 50 },
        { variable: "usWarEntryPacific", delta: -55 },
        { variable: "axisCoordination", delta: 30 },
      ],
    },
    forkEventSpec: {
      title: "The Northern Strike",
      description:
        "The Kwantung Army, reinforced to 1.5 million men, crosses the Manchurian border into Siberia on December 8, 1941. Vladivostok is besieged. The crucial Siberian divisions that historically saved Moscow are pinned down fighting the Japanese. Stalin faces the nightmare scenario: war on two fronts against two industrial powers.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "Moscow Falls as Siberian Reserves Are Diverted",
          description:
            "The Siberian divisions—the elite, winter-trained troops that historically counterattacked before Moscow—are fighting the Japanese instead. Without them, the Soviet winter counteroffensive never materializes. German forces enter Moscow in January 1942. The Soviet state fractures under the impossible pressure.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "ussr", field: "capitalStatus", from: "defended by Siberian reserves", to: "fallen" },
            { entityId: "germany", field: "easternVictory", from: "elusive", to: "partial—Moscow taken" },
            { entityId: "stalin", field: "authority", from: "wartime supreme leader", to: "regime survival in question" },
          ],
          factChanges: [
            { fact: "Soviet winter counteroffensive saves Moscow", from: true, to: false },
            { fact: "Moscow falls to Germany early 1942", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "sovietCollapseProbability", delta: 40 },
            { variable: "axisGlobalDominance", delta: 35 },
          ],
        },
        timestamp: "1942-01-20",
      },
      {
        eventSpec: {
          title: "America Remains Neutral—and Torn",
          description:
            "With no Pearl Harbor attack, the United States watches the Axis powers carve up Eurasia from the sidelines. Roosevelt imposes severe sanctions on Japan but cannot bring Congress to declare war. The American public is horrified but divided. The great industrial democracy sits paralyzed while totalitarianism triumphs on two continents.",
          category: "political",
        },
        deltas: {
          entityChanges: [
            { entityId: "usa", field: "globalRole", from: "arsenal of democracy at war", to: "conflicted neutral power" },
            { entityId: "roosevelt", field: "frustration", from: "moderate", to: "extreme—watching allies fall" },
          ],
          factChanges: [
            { fact: "US enters WW2 December 1941", from: true, to: false },
            { fact: "US remains neutral into 1942", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "usIsolationism", delta: 25 },
            { variable: "globalDemocraticRetreat", delta: 40 },
          ],
        },
        timestamp: "1942-02-15",
      },
    ],
    branchPriors: { plausibility: 10, coherence: 70, novelty: 80 },
    renderPack: {
      sceneBible:
        "December 1941. The frozen Manchurian-Siberian border. Japanese Kwantung Army tanks grinding through snow-covered taiga. Rising sun flags snapping in the Siberian wind. In the distance, smoke rises from Vladivostok under bombardment. Soviet border guards in white camouflage fighting desperately. Two empires colliding in the coldest place on Earth.",
      anchorImageUrl: null,
    },
  },
];
