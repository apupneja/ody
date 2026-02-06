// Branch seeds for the Battle of Stalingrad fork point (February 1943)

export const STALINGRAD_BRANCHES = [
  // Branch 1: Germany captures Stalingrad
  {
    forkDescription: "Paulus concentrates his forces and takes Stalingrad before the Soviet encirclement closes. The Volga is cut. Soviet logistics collapse as lend-lease material piles up in Iran with no route north.",
    matchKeywords: ["stalingrad falls", "german victory", "volga cut", "paulus", "6th army victory"],
    forkDelta: {
      entityChanges: [
        { entityId: "germany", field: "status", oldValue: "aggressive", newValue: "ascendant-east" },
        { entityId: "ussr", field: "status", oldValue: "at-war", newValue: "critically-threatened" },
      ],
      factChanges: [
        { factId: "stalingrad-fallen", oldValue: null, newValue: { type: "hard", statement: "Germany has captured Stalingrad and severed Soviet logistics along the Volga", confidence: 100 } },
        { factId: "soviet-supply-crisis", oldValue: null, newValue: { type: "hard", statement: "Soviet supply lines from the south are cut, crippling industrial output", confidence: 90 } },
      ],
      causalVarChanges: [
        { varName: "morale", delta: -15 },
        { varName: "logistics", delta: -15 },
        { varName: "escalation", delta: 10 },
      ],
    },
    forkEventSpec: {
      title: "Fall of Stalingrad to Germany",
      description: "The German 6th Army captures Stalingrad after brutal urban fighting, cutting the Volga River artery and threatening Soviet war production.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "German Drive on the Caucasus Oil Fields",
          description: "With Stalingrad secured, Army Group South pushes into the Caucasus. Baku's oil fields come within reach, threatening the USSR's fuel supply.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "germany", field: "properties.territory", oldValue: "central-and-eastern-europe", newValue: "deep-into-russia" },
          ],
          factChanges: [
            { factId: "caucasus-offensive", oldValue: null, newValue: { type: "hard", statement: "German forces are advancing on the Caucasus oil fields", confidence: 95 } },
            { factId: "soviet-fuel-crisis", oldValue: null, newValue: { type: "soft", statement: "Soviet fuel reserves are dangerously low as Caucasus fields are threatened", confidence: 80 } },
          ],
          causalVarChanges: [
            { varName: "logistics", delta: -10 },
            { varName: "escalation", delta: 10 },
          ],
        },
        timestamp: "1943-05-01",
      },
      {
        eventSpec: {
          title: "Stalin Orders Scorched Earth Retreat",
          description: "Facing total collapse in the south, Stalin issues Order 300: destroy all infrastructure and retreat east of the Urals. Millions of civilians are force-marched into Siberia.",
          category: "political",
        },
        deltas: {
          entityChanges: [
            { entityId: "ussr", field: "properties.territory", oldValue: "eastern-europe-asia", newValue: "contracted-east-urals" },
            { entityId: "ussr", field: "properties.industry", oldValue: "growing", newValue: "relocated" },
          ],
          factChanges: [
            { factId: "ural-retreat", oldValue: null, newValue: { type: "hard", statement: "Soviet government and industry have relocated behind the Ural mountains", confidence: 90 } },
          ],
          causalVarChanges: [
            { varName: "morale", delta: -10 },
            { varName: "logistics", delta: -5 },
            { varName: "escalation", delta: 5 },
          ],
        },
        timestamp: "1943-08-01",
      },
    ],
    branchPriors: { plausibility: 20, coherence: 80, novelty: 55 },
    renderPack: {
      sceneBible: "The shattered skyline of Stalingrad under a swastika banner. German soldiers stand on the rubble-strewn banks of the Volga, staring east across the frozen river. Behind them, the ruined grain elevator smolders. Soviet prisoners are marched west in endless columns.",
      anchorImageUrl: null,
    },
  },

  // Branch 2: Germany retreats before encirclement
  {
    forkDescription: "Hitler, persuaded by Manstein and Zeitzler, authorizes the 6th Army to withdraw from Stalingrad before Operation Uranus closes the trap. Three hundred thousand German soldiers escape to fight another day.",
    matchKeywords: ["german retreat", "stalingrad withdrawal", "manstein", "6th army escapes", "tactical retreat"],
    forkDelta: {
      entityChanges: [
        { entityId: "germany", field: "status", oldValue: "aggressive", newValue: "strategic-defense" },
        { entityId: "ussr", field: "status", oldValue: "at-war", newValue: "advancing-slowly" },
      ],
      factChanges: [
        { factId: "stalingrad-withdrawal", oldValue: null, newValue: { type: "hard", statement: "Germany withdrew from Stalingrad, preserving the 6th Army as a fighting force", confidence: 100 } },
        { factId: "eastern-front-stabilized", oldValue: null, newValue: { type: "soft", statement: "The Eastern Front has stabilized along a defensible line west of the Don", confidence: 80 } },
      ],
      causalVarChanges: [
        { varName: "morale", delta: 5 },
        { varName: "logistics", delta: 5 },
        { varName: "escalation", delta: -5 },
      ],
    },
    forkEventSpec: {
      title: "German Withdrawal from Stalingrad",
      description: "Hitler overrides his own no-retreat order and allows the 6th Army to pull back from Stalingrad before the Soviet encirclement closes.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "Manstein's Mobile Defense",
          description: "With the 6th Army intact, Manstein organizes a brilliant elastic defense along the Don-Donets line, trading space for devastating counterstrokes against overextended Soviet spearheads.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "germany", field: "properties.military", oldValue: "strong", newValue: "resilient-defense" },
          ],
          factChanges: [
            { factId: "manstein-defense", oldValue: null, newValue: { type: "hard", statement: "Manstein's mobile defense has inflicted severe losses on advancing Soviet armies", confidence: 90 } },
          ],
          causalVarChanges: [
            { varName: "morale", delta: 5 },
            { varName: "intelligence", delta: 5 },
          ],
        },
        timestamp: "1943-04-01",
      },
      {
        eventSpec: {
          title: "Prolonged Eastern Front Stalemate",
          description: "The war in the East grinds into a positional stalemate reminiscent of 1917. Both sides dig in. Allied pressure mounts for a second front in France.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "ussr", field: "status", oldValue: "advancing-slowly", newValue: "stalled-offensive" },
          ],
          factChanges: [
            { factId: "eastern-stalemate", oldValue: null, newValue: { type: "soft", statement: "The Eastern Front has become a grinding stalemate with no decisive breakthrough", confidence: 85 } },
            { factId: "second-front-pressure", oldValue: null, newValue: { type: "soft", statement: "Stalin demands an immediate Allied invasion of France to relieve pressure", confidence: 90 } },
          ],
          causalVarChanges: [
            { varName: "logistics", delta: -5 },
            { varName: "morale", delta: -5 },
            { varName: "escalation", delta: 5 },
          ],
        },
        timestamp: "1943-09-01",
      },
    ],
    branchPriors: { plausibility: 35, coherence: 90, novelty: 40 },
    renderPack: {
      sceneBible: "A grey dawn on the Don steppe. German columns march west through frozen mud, battered but intact. Panzer IVs provide rearguard cover as Soviet artillery shells burst in the distance. Manstein stands over a map table in a farmhouse, drawing defensive lines with a grease pencil.",
      anchorImageUrl: null,
    },
  },

  // Branch 3: Allied bombing campaign devastates German industry early
  {
    forkDescription: "The Combined Bomber Offensive achieves critical mass a year early. Precision raids on Schweinfurt ball-bearing plants and Ploesti oil refineries cripple German war production by late 1942, starving the Eastern Front of supplies.",
    matchKeywords: ["strategic bombing", "allied bombing", "schweinfurt", "ploesti", "german industry"],
    forkDelta: {
      entityChanges: [
        { entityId: "germany", field: "properties.industry", oldValue: "high", newValue: "degraded" },
        { entityId: "uk", field: "properties.military", oldValue: "moderate", newValue: "bomber-offensive" },
      ],
      factChanges: [
        { factId: "bombing-campaign", oldValue: null, newValue: { type: "hard", statement: "Allied strategic bombing has severely damaged German industrial capacity", confidence: 95 } },
        { factId: "german-supply-shortage", oldValue: null, newValue: { type: "hard", statement: "German forces at Stalingrad face critical shortages of ammunition and fuel", confidence: 90 } },
      ],
      causalVarChanges: [
        { varName: "logistics", delta: -10 },
        { varName: "techLevel", delta: 5 },
        { varName: "morale", delta: 5 },
      ],
    },
    forkEventSpec: {
      title: "Early Allied Strategic Bombing Success",
      description: "Allied bombers devastate German industrial centers a year ahead of schedule, critically undermining the Wehrmacht's ability to sustain operations on the Eastern Front.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "German 6th Army Collapses from Supply Starvation",
          description: "Without adequate ammunition, fuel, or winter clothing, the 6th Army at Stalingrad disintegrates weeks earlier than in reality. The Soviet encirclement meets almost no resistance.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "germany", field: "status", oldValue: "aggressive", newValue: "reeling" },
            { entityId: "ussr", field: "status", oldValue: "at-war", newValue: "counterattacking" },
          ],
          factChanges: [
            { factId: "rapid-stalingrad-collapse", oldValue: null, newValue: { type: "hard", statement: "The German 6th Army collapsed at Stalingrad due to catastrophic supply failures", confidence: 95 } },
          ],
          causalVarChanges: [
            { varName: "morale", delta: 10 },
            { varName: "escalation", delta: 5 },
          ],
        },
        timestamp: "1943-01-15",
      },
      {
        eventSpec: {
          title: "Speer's Emergency Decentralization",
          description: "Albert Speer disperses German production into underground factories and small workshops. Output partially recovers but never reaches previous levels. The war economy enters permanent crisis.",
          category: "political",
        },
        deltas: {
          entityChanges: [
            { entityId: "germany", field: "properties.industry", oldValue: "degraded", newValue: "dispersed-declining" },
          ],
          factChanges: [
            { factId: "speer-decentralization", oldValue: null, newValue: { type: "soft", statement: "German industry has been dispersed underground but operates at reduced capacity", confidence: 85 } },
          ],
          causalVarChanges: [
            { varName: "logistics", delta: 5 },
            { varName: "techLevel", delta: -5 },
          ],
        },
        timestamp: "1943-06-01",
      },
    ],
    branchPriors: { plausibility: 15, coherence: 75, novelty: 65 },
    renderPack: {
      sceneBible: "Night sky over the Ruhr valley lit by searchlights and flak bursts. Hundreds of Lancaster and B-17 silhouettes fill the air. Below, ball-bearing factories burn. In Stalingrad, German soldiers search empty ammunition crates, their breath visible in the killing cold.",
      anchorImageUrl: null,
    },
  },
];
