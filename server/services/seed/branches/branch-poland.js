export const polandBranches = [
  // Branch 1: Poland successfully defends
  {
    forkDescription:
      "Polish forces exploit defensive terrain along the Vistula and Bug rivers, stalling the Wehrmacht long enough for autumn rains to turn roads to mud. German logistics collapse; the Blitzkrieg grinds to a halt east of Warsaw.",
    matchKeywords: ["poland", "invasion", "defense", "vistula", "blitzkrieg", "september 1939"],
    forkDelta: {
      entityChanges: [
        { entityId: "germany", field: "militaryMorale", from: "high", to: "shaken" },
        { entityId: "poland", field: "sovereignty", from: "invaded", to: "intact" },
        { entityId: "hitler", field: "politicalCapital", from: "peak", to: "eroding" },
      ],
      factChanges: [
        { fact: "Poland conquered in September 1939", from: true, to: false },
        { fact: "Wehrmacht suffers first strategic setback", from: false, to: true },
      ],
      causalVarChanges: [
        { variable: "germanMilitaryPrestige", delta: -30 },
        { variable: "alliedConfidence", delta: 25 },
        { variable: "polishResistanceStrength", delta: 40 },
      ],
    },
    explanation:
      "In reality, Poland fell in about five weeks. But the Wehrmacht's supply lines were dangerously stretched, and the Blitzkrieg depended on shock and speed. Had autumn rains arrived earlier or Polish forces concentrated along natural river barriers, the offensive could have stalled — as Germany's own generals feared.",
    forkEventSpec: {
      title: "The Vistula Miracle",
      description:
        "Polish defenders hold the Vistula line. German armored spearheads outrun their supply trains and are cut off by determined Polish counterattacks near Modlin Fortress.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "Franco-British Expeditionary Force Lands at Gdynia",
          description:
            "Emboldened by Polish resistance, France and Britain dispatch an expeditionary corps through the Baltic, establishing a second front in Pomerania and forcing Germany to split its forces.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "france", field: "militaryPosture", from: "defensive", to: "expeditionary" },
            { entityId: "uk", field: "navalCommitment", from: "blockade", to: "amphibious-support" },
            { entityId: "germany", field: "frontCount", from: 1, to: 2 },
          ],
          factChanges: [
            { fact: "Allied troops on Polish soil", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "germanStrategicOverstretch", delta: 35 },
            { variable: "alliedCoordination", delta: 20 },
          ],
        },
        timestamp: "1939-10-28",
      },
      {
        eventSpec: {
          title: "Hitler Faces Internal Challenge from the General Staff",
          description:
            "Senior Wehrmacht officers, alarmed by the failed invasion, quietly approach Admiral Canaris about removing Hitler. The conspiracy remains embryonic but marks the earliest serious internal threat to the regime.",
          category: "political",
        },
        deltas: {
          entityChanges: [
            { entityId: "hitler", field: "gripOnMilitary", from: "absolute", to: "contested" },
            { entityId: "germany", field: "internalStability", from: "stable", to: "uneasy" },
          ],
          factChanges: [
            { fact: "German officers plot against Hitler", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "naziRegimeStability", delta: -20 },
            { variable: "germanMilitaryAutonomy", delta: 15 },
          ],
        },
        timestamp: "1939-11-15",
      },
    ],
    branchPriors: { plausibility: 15, coherence: 70, novelty: 60 },
    renderPack: {
      sceneBible:
        "Autumn 1939. Muddy fields along the Vistula. Polish cavalry and anti-tank guns among birch forests. Stalled German Panzer columns, supply trucks mired axle-deep. Warsaw intact, its spires visible on the horizon. Grey overcast skies, steady rain.",
      anchorImageUrl: null,
    },
  },

  // Branch 2: USSR intervenes to protect Poland
  {
    forkDescription:
      "Stalin, fearing a triumphant Germany on his border more than a surviving Poland, tears up the Molotov-Ribbentrop Pact and orders the Red Army to defend eastern Poland. The world watches in disbelief as Soviet and German forces clash at Brest-Litovsk.",
    matchKeywords: ["ussr", "stalin", "molotov-ribbentrop", "soviet intervention", "poland", "brest-litovsk"],
    forkDelta: {
      entityChanges: [
        { entityId: "ussr", field: "foreignPolicy", from: "non-aggression pact with Germany", to: "armed intervention in Poland" },
        { entityId: "stalin", field: "strategy", from: "partition Poland", to: "buffer-state preservation" },
        { entityId: "germany", field: "easternFront", from: "unopposed", to: "contested by Red Army" },
      ],
      factChanges: [
        { fact: "Molotov-Ribbentrop Pact holds", from: true, to: false },
        { fact: "Soviet-German hostilities begin 1939", from: false, to: true },
      ],
      causalVarChanges: [
        { variable: "sovietGermanRelations", delta: -80 },
        { variable: "polishSurvivalChance", delta: 50 },
        { variable: "europeanWarScope", delta: 30 },
      ],
    },
    explanation:
      "The Molotov-Ribbentrop Pact was a marriage of convenience. Stalin deeply distrusted Hitler, and some Soviet strategists argued that a buffer Poland served Soviet interests better than a shared border with Germany. Had Stalin calculated differently, a 1939 Soviet-German clash could have reshaped the entire war.",
    forkEventSpec: {
      title: "The Brest-Litovsk Reversal",
      description:
        "Red Army divisions pour across the eastern Polish border—not as conquerors, but as defenders. Soviet and German tanks exchange fire in the marshes near Brest-Litovsk, shattering the Nazi-Soviet pact.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "Uneasy Alliance: London-Moscow Talks",
          description:
            "Churchill, still First Lord of the Admiralty, pushes Chamberlain to open direct military talks with Moscow. A provisional Anglo-Franco-Soviet alliance takes shape, united only by the shared threat of German expansion.",
          category: "diplomatic",
        },
        deltas: {
          entityChanges: [
            { entityId: "uk", field: "diplomaticPosture", from: "anti-Soviet suspicion", to: "pragmatic engagement" },
            { entityId: "churchill", field: "influence", from: "cabinet member", to: "key strategist" },
            { entityId: "ussr", field: "westernRelations", from: "hostile", to: "cautious cooperation" },
          ],
          factChanges: [
            { fact: "Grand Alliance formed in 1939", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "alliedCoalitionStrength", delta: 40 },
            { variable: "germanEncirclement", delta: 25 },
          ],
        },
        timestamp: "1939-10-12",
      },
      {
        eventSpec: {
          title: "Japan Reconsiders the Axis",
          description:
            "Tokyo, stunned by the Soviet-German clash, suspends negotiations for a formal Axis pact. The Imperial General Staff debates whether to exploit the Soviet commitment in Europe or pivot toward a northern strategy against a now-distracted Red Army.",
          category: "diplomatic",
        },
        deltas: {
          entityChanges: [
            { entityId: "japan", field: "alliancePosture", from: "pro-Axis", to: "non-committed" },
            { entityId: "italy", field: "axisConfidence", from: "growing", to: "wavering" },
            { entityId: "mussolini", field: "strategy", from: "hitch to Germany", to: "wait and see" },
          ],
          factChanges: [
            { fact: "Tripartite Pact signed 1940", from: true, to: false },
          ],
          causalVarChanges: [
            { variable: "axisCoalitionCohesion", delta: -35 },
            { variable: "pacificThreatLevel", delta: -15 },
          ],
        },
        timestamp: "1939-11-03",
      },
    ],
    branchPriors: { plausibility: 8, coherence: 55, novelty: 85 },
    renderPack: {
      sceneBible:
        "September 1939. Flat marshland near Brest-Litovsk. Soviet T-26 tanks advancing through morning fog past stunned Polish villagers. Distant smoke from German positions. Red star insignia beside white-eagle Polish flags—an impossible image made real.",
      anchorImageUrl: null,
    },
  },

  // Branch 3: Western Allies launch immediate offensive
  {
    forkDescription:
      "France, honoring its treaty obligations with full commitment, launches an all-out offensive through the Saar on September 7, 1939. With the bulk of the Wehrmacht committed in Poland, the undermanned Westwall buckles under concentrated French armor and artillery.",
    matchKeywords: ["saar offensive", "france", "westwall", "siegfried line", "western front", "allied offensive"],
    forkDelta: {
      entityChanges: [
        { entityId: "france", field: "militaryStrategy", from: "defensive", to: "full offensive" },
        { entityId: "germany", field: "westernDefenses", from: "skeleton garrison", to: "under assault" },
        { entityId: "uk", field: "commitment", from: "mobilizing", to: "air support over Saar" },
      ],
      factChanges: [
        { fact: "Phoney War occurs", from: true, to: false },
        { fact: "France breaches the Westwall in 1939", from: false, to: true },
      ],
      causalVarChanges: [
        { variable: "germanTwoFrontPressure", delta: 60 },
        { variable: "frenchMilitaryMorale", delta: 30 },
        { variable: "warDuration", delta: -20 },
      ],
    },
    explanation:
      "France actually did launch a limited Saar Offensive in September 1939 but halted after advancing just 8 km. With 90% of the Wehrmacht committed in Poland, the Westwall was manned by only 11 reserve divisions. A full-scale French attack could have broken through — a missed opportunity that haunted Allied planners.",
    forkEventSpec: {
      title: "The Saar Gambit",
      description:
        "Forty French divisions supported by RAF bombers pour through the Saar gap. German reserve divisions, hastily redeployed from Poland, arrive piecemeal and are defeated in detail. By late September, French tanks reach the Rhine at Mainz.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "Germany Forced to Withdraw from Poland",
          description:
            "Facing a collapsing western front, Hitler orders a partial withdrawal from Poland to reinforce the Rhine. Warsaw holds. The Wehrmacht, forced into a two-front war it was not prepared for, suffers catastrophic logistical strain.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "germany", field: "strategicPosition", from: "offensive", to: "defensive on two fronts" },
            { entityId: "poland", field: "status", from: "collapsing", to: "partially liberated" },
            { entityId: "hitler", field: "militaryCredibility", from: "strong", to: "questioned" },
          ],
          factChanges: [
            { fact: "Germany fights two-front war in 1939", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "germanWarCapacity", delta: -40 },
            { variable: "alliedInitiative", delta: 35 },
          ],
        },
        timestamp: "1939-10-05",
      },
      {
        eventSpec: {
          title: "Roosevelt Accelerates Lend-Lease Planning",
          description:
            "Witnessing an Allied offensive that might actually win, Roosevelt pushes Congress to loosen the Neutrality Acts months early. American industrial mobilization begins in late 1939, with steel and aviation fuel flowing to France and Britain.",
          category: "economic",
        },
        deltas: {
          entityChanges: [
            { entityId: "usa", field: "neutralityStatus", from: "strict", to: "cash-and-carry expanded" },
            { entityId: "roosevelt", field: "foreignPolicyStance", from: "cautious", to: "actively pro-Allied" },
          ],
          factChanges: [
            { fact: "US economic support begins in 1939", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "alliedIndustrialCapacity", delta: 25 },
            { variable: "usIsolationism", delta: -20 },
          ],
        },
        timestamp: "1939-11-20",
      },
    ],
    branchPriors: { plausibility: 20, coherence: 75, novelty: 50 },
    renderPack: {
      sceneBible:
        "Early autumn 1939. Rolling hills of the Saarland. French Char B1 tanks rumbling past shattered concrete dragon's teeth of the Westwall. Columns of French infantry in horizon blue advancing through vineyards. Smoke rises from burning German bunkers. The Rhine glints in the distance.",
      anchorImageUrl: null,
    },
  },
];
