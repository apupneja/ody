export const barbarossaBranches = [
  // Branch 1: Germany captures Moscow before winter
  {
    forkDescription:
      "Hitler does not divert Army Group Center south to Kiev in August 1941. The panzers drive straight for Moscow through the summer, reaching the outskirts in early October before the rasputitsa turns roads to mud. Moscow falls on October 15, 1941.",
    matchKeywords: ["barbarossa", "moscow", "army group center", "operation typhoon", "winter", "eastern front"],
    forkDelta: {
      entityChanges: [
        { entityId: "germany", field: "easternConquest", from: "stalled before Moscow", to: "Moscow captured" },
        { entityId: "ussr", field: "capitalStatus", from: "defended", to: "fallen" },
        { entityId: "stalin", field: "politicalPosition", from: "wartime leader", to: "retreated to Kuibyshev" },
      ],
      factChanges: [
        { fact: "Moscow holds in 1941", from: true, to: false },
        { fact: "German forces capture Moscow", from: false, to: true },
      ],
      causalVarChanges: [
        { variable: "sovietGovernmentStability", delta: -45 },
        { variable: "germanEasternMomentum", delta: 35 },
        { variable: "sovietIndustrialCapacity", delta: -25 },
      ],
    },
    forkEventSpec: {
      title: "The Fall of Moscow",
      description:
        "Guderian's panzers breach Moscow's outer defenses at Mozhaisk. Street fighting rages for a week before the Kremlin falls. Stalin evacuates to Kuibyshev. The Soviet government survives but the symbolic and logistical blow is enormous—railway hub, communications center, and the heart of Soviet power.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "The Soviet Union Does Not Collapse",
          description:
            "Despite the fall of Moscow, the USSR fights on. Factories relocated beyond the Urals continue producing tanks and aircraft. Siberian divisions launch fierce counterattacks. The war in the East becomes a grinding continental struggle with no clear end—Napoleon's nightmare repeated at industrial scale.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "ussr", field: "warStatus", from: "reeling", to: "fighting on from depth" },
            { entityId: "germany", field: "occupationBurden", from: "manageable", to: "overextended" },
            { entityId: "stalin", field: "authority", from: "shaken", to: "stabilizing via wartime rally" },
          ],
          factChanges: [
            { fact: "Soviet resistance continues after Moscow falls", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "germanLogisticalStrain", delta: 40 },
            { variable: "sovietResilienceIndex", delta: 20 },
          ],
        },
        timestamp: "1941-12-20",
      },
      {
        eventSpec: {
          title: "Japan Strikes South, Emboldened",
          description:
            "With the Soviet Union reeling, Japan feels secure on its northern flank and accelerates its southern expansion. The attack on Pearl Harbor proceeds on schedule, but with greater confidence—Japan no longer fears a two-front war against the Soviets.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "japan", field: "strategicConfidence", from: "cautious", to: "emboldened" },
            { entityId: "japan", field: "northernThreat", from: "Soviet forces on Manchurian border", to: "negligible" },
          ],
          factChanges: [
            { fact: "Japan attacks Pearl Harbor with full strategic confidence", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "japaneseExpansionRate", delta: 20 },
            { variable: "pacificWarIntensity", delta: 15 },
          ],
        },
        timestamp: "1941-12-07",
      },
    ],
    branchPriors: { plausibility: 15, coherence: 75, novelty: 50 },
    renderPack: {
      sceneBible:
        "October 1941. The outskirts of Moscow. German Panzer IVs rolling past the star-topped spires of the Kremlin. Red Square littered with debris. Soviet civilians fleeing east on foot, carrying bundles. Smoke rising from burning government buildings. The first snow falling on Wehrmacht soldiers who do not yet know that capturing a city is not the same as winning a war.",
      anchorImageUrl: null,
    },
  },

  // Branch 2: Stalin is overthrown in a coup
  {
    forkDescription:
      "The catastrophic losses of summer 1941—3 million prisoners, entire army groups annihilated—trigger a palace coup. Senior Red Army officers and NKVD faction leaders, convinced Stalin's purges and strategic blunders have doomed the nation, arrest him in the Kremlin on July 15, 1941.",
    matchKeywords: ["stalin", "coup", "red army", "nkvd", "soviet leadership", "purges"],
    forkDelta: {
      entityChanges: [
        { entityId: "stalin", field: "status", from: "supreme leader", to: "arrested / deposed" },
        { entityId: "ussr", field: "leadership", from: "Stalinist dictatorship", to: "military junta" },
        { entityId: "germany", field: "enemyAssessment", from: "Stalinist regime", to: "unknown successor regime" },
      ],
      factChanges: [
        { fact: "Stalin leads USSR throughout WW2", from: true, to: false },
        { fact: "Soviet military coup 1941", from: false, to: true },
      ],
      causalVarChanges: [
        { variable: "sovietCommandUnity", delta: -30 },
        { variable: "sovietMilitaryCompetence", delta: 25 },
        { variable: "politicalInstabilityRisk", delta: 40 },
      ],
    },
    forkEventSpec: {
      title: "The Kremlin Coup",
      description:
        "Marshal Zhukov, General Shaposhnikov, and NKVD deputy Merkulov execute a coordinated arrest of Stalin and his inner circle. A Military Council of National Salvation takes power, immediately ordering a strategic withdrawal to the Dnieper line and recalling purged officers from the gulags.",
      category: "political",
    },
    continuations: [
      {
        eventSpec: {
          title: "Purged Officers Return to Command",
          description:
            "Thousands of experienced officers—survivors of Stalin's 1937-38 purges—are released from labor camps and restored to command. Men like Marshal Rokossovsky, his teeth broken by NKVD interrogators, take charge of divisions. The Red Army's officer corps, devastated by the purges, begins to regenerate.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "ussr", field: "officerCorpsQuality", from: "gutted by purges", to: "rapidly reconstituting" },
            { entityId: "ussr", field: "militaryDoctrine", from: "rigid Stalinist", to: "professional adaptation" },
          ],
          factChanges: [
            { fact: "Purged Soviet officers restored to duty 1941", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "sovietMilitaryEffectiveness", delta: 30 },
            { variable: "redArmyTacticalFlexibility", delta: 25 },
          ],
        },
        timestamp: "1941-08-01",
      },
      {
        eventSpec: {
          title: "Germany Weighs Negotiation with the New Regime",
          description:
            "Hitler, against his generals' advice, refuses to negotiate with the junta. But the new Soviet leadership makes a quiet approach through back channels: they will cede Ukraine and the Baltics for an armistice. Hitler's refusal pushes the junta toward total war.",
          category: "diplomatic",
        },
        deltas: {
          entityChanges: [
            { entityId: "germany", field: "diplomaticResponse", from: "none", to: "rejected Soviet peace feeler" },
            { entityId: "hitler", field: "strategicJudgment", from: "triumphant", to: "ideologically rigid" },
            { entityId: "ussr", field: "warCommitment", from: "desperate defense", to: "total war by choice" },
          ],
          factChanges: [
            { fact: "Soviet peace offer rejected by Hitler", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "easternFrontEscalation", delta: 20 },
            { variable: "sovietWarMotivation", delta: 15 },
          ],
        },
        timestamp: "1941-09-10",
      },
    ],
    branchPriors: { plausibility: 8, coherence: 60, novelty: 80 },
    renderPack: {
      sceneBible:
        "July 1941. The Kremlin at night. NKVD troops in blue caps surrounding Stalin's quarters. Zhukov in full uniform striding through red-carpeted halls. Stalin at his desk, telephone lines cut, guards disarmed outside. A map of the front on the wall showing catastrophic German advances. The old order ending in the same building where it was born.",
      anchorImageUrl: null,
    },
  },

  // Branch 3: Germany never invades the USSR
  {
    forkDescription:
      "Hitler, swayed by his generals' arguments about the risks of a two-front war and distracted by Mediterranean opportunities, postpones Barbarossa indefinitely. Germany consolidates its European conquests and turns south toward the Middle Eastern oil fields through Vichy Syria and Iraq.",
    matchKeywords: ["barbarossa cancelled", "no eastern front", "mediterranean strategy", "middle east", "oil"],
    forkDelta: {
      entityChanges: [
        { entityId: "germany", field: "strategicDirection", from: "invasion of USSR", to: "Mediterranean / Middle East" },
        { entityId: "ussr", field: "warStatus", from: "invaded June 1941", to: "tense non-belligerent" },
        { entityId: "hitler", field: "strategy", from: "Lebensraum war", to: "resource-consolidation" },
      ],
      factChanges: [
        { fact: "Operation Barbarossa launched June 1941", from: true, to: false },
        { fact: "Germany pursues Mediterranean strategy", from: false, to: true },
      ],
      causalVarChanges: [
        { variable: "germanResourceSecurity", delta: 30 },
        { variable: "sovietMilitaryPreparation", delta: 20 },
        { variable: "globalWarScope", delta: -25 },
      ],
    },
    forkEventSpec: {
      title: "The Mediterranean Pivot",
      description:
        "In May 1941, Hitler shelves Barbarossa and orders Rommel reinforced with 15 additional divisions. The Wehrmacht drives through Vichy Syria into Iraq, seizing the Mosul and Kirkuk oilfields. Britain's Middle Eastern position collapses. Germany secures the petroleum it needs for a long war.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "The Cold Peace on the Eastern Border",
          description:
            "Stalin, granted an unexpected reprieve, uses the time to rebuild the Red Army. Soviet factories churn out T-34s and Katyusha rockets. By 1942, the Red Army is vastly stronger than it was in June 1941—but the Molotov-Ribbentrop Pact holds in uneasy suspension. Both sides prepare for a war neither wants to start first.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "ussr", field: "militaryReadiness", from: "unprepared", to: "significantly strengthened" },
            { entityId: "stalin", field: "strategy", from: "caught off guard", to: "building strength" },
          ],
          factChanges: [
            { fact: "Soviet military buildup continues through 1942", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "sovietMilitaryPower", delta: 40 },
            { variable: "easternFrontTension", delta: 25 },
          ],
        },
        timestamp: "1942-03-01",
      },
      {
        eventSpec: {
          title: "Britain Loses the Middle East",
          description:
            "With German forces in Iraq and advancing toward Persia, Britain's oil supply from the region is severed. The Royal Navy, dependent on Middle Eastern fuel, faces a slow strangulation. Churchill desperately appeals to Roosevelt for American oil and military intervention.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "uk", field: "middleEastPosition", from: "dominant", to: "collapsed" },
            { entityId: "germany", field: "oilSupply", from: "critically short", to: "secured via Iraq" },
            { entityId: "churchill", field: "desperation", from: "moderate", to: "acute" },
          ],
          factChanges: [
            { fact: "Germany controls Middle Eastern oil", from: false, to: true },
            { fact: "British Middle East command intact", from: true, to: false },
          ],
          causalVarChanges: [
            { variable: "germanWarSustainability", delta: 35 },
            { variable: "britishStrategicPosition", delta: -40 },
          ],
        },
        timestamp: "1941-10-01",
      },
    ],
    branchPriors: { plausibility: 10, coherence: 65, novelty: 75 },
    renderPack: {
      sceneBible:
        "Summer 1941. The Syrian desert. German Afrika Korps columns advancing along dusty roads, palm trees and minarets in the distance. Oil derricks on the horizon—Kirkuk. Wehrmacht supply trucks flying swastika flags alongside roads once patrolled by the British. A map in Rommel's command tent showing arrows pointing toward Persia and the Persian Gulf.",
      anchorImageUrl: null,
    },
  },
];
