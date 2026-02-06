// Branch seeds for the Fall of Berlin fork point (April 1945)

export const BERLIN_BRANCHES = [
  // Branch 1: Germany develops atomic weapons first
  {
    forkDescription: "Heisenberg's uranium project succeeds. In March 1945, Germany detonates a crude fission device in Thuringia and threatens to use atomic weapons on Allied armies. The war enters a terrifying new phase.",
    matchKeywords: ["german atomic bomb", "heisenberg", "nuclear germany", "uranium project", "wunderwaffe"],
    forkDelta: {
      entityChanges: [
        { entityId: "germany", field: "properties.military", oldValue: "strong", newValue: "nuclear-armed" },
        { entityId: "germany", field: "status", oldValue: "retreating", newValue: "atomic-standoff" },
      ],
      factChanges: [
        { factId: "german-bomb", oldValue: null, newValue: { type: "hard", statement: "Germany has detonated a nuclear device and threatens to use atomic weapons against Allied forces", confidence: 100 } },
        { factId: "nuclear-age-early", oldValue: null, newValue: { type: "hard", statement: "The nuclear age has begun under German auspices", confidence: 100 } },
      ],
      causalVarChanges: [
        { varName: "techLevel", delta: 25 },
        { varName: "escalation", delta: 20 },
        { varName: "morale", delta: -15 },
      ],
    },
    forkEventSpec: {
      title: "German Nuclear Weapon Test",
      description: "Germany successfully tests a nuclear fission device, fundamentally altering the strategic calculus of the final months of the war in Europe.",
      category: "scientific",
    },
    continuations: [
      {
        eventSpec: {
          title: "Allied Armies Halt at the Rhine",
          description: "Eisenhower orders all forces to halt their advance into Germany. The risk of a nuclear strike on concentrated troop formations paralyzes Allied offensive operations.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "usa", field: "properties.military", oldValue: "strong", newValue: "halted-in-europe" },
            { entityId: "ussr", field: "status", oldValue: "counterattacking", newValue: "halted-at-oder" },
          ],
          factChanges: [
            { factId: "allied-halt", oldValue: null, newValue: { type: "hard", statement: "Allied forces have halted their advance into Germany due to the nuclear threat", confidence: 95 } },
          ],
          causalVarChanges: [
            { varName: "morale", delta: -10 },
            { varName: "escalation", delta: 10 },
          ],
        },
        timestamp: "1945-04-01",
      },
      {
        eventSpec: {
          title: "Manhattan Project Accelerated for European Use",
          description: "Groves and Oppenheimer are ordered to prepare the first American atomic bomb for use against Germany rather than Japan. Trinity test is rushed forward.",
          category: "scientific",
        },
        deltas: {
          entityChanges: [
            { entityId: "usa", field: "properties.military", oldValue: "halted-in-europe", newValue: "preparing-nuclear-response" },
          ],
          factChanges: [
            { factId: "manhattan-redirected", oldValue: null, newValue: { type: "hard", statement: "The US atomic bomb program is being accelerated for use against Germany", confidence: 95 } },
            { factId: "nuclear-arms-race", oldValue: null, newValue: { type: "soft", statement: "A nuclear arms race between Germany and the US is underway", confidence: 85 } },
          ],
          causalVarChanges: [
            { varName: "techLevel", delta: 15 },
            { varName: "escalation", delta: 10 },
          ],
        },
        timestamp: "1945-05-15",
      },
    ],
    branchPriors: { plausibility: 5, coherence: 70, novelty: 90 },
    renderPack: {
      sceneBible: "A blinding flash in the Thuringian forest. Trees bend outward from a rising mushroom cloud. In the bunker beneath the Reichskanzlei, haggard Nazi officials watch film footage in stunned silence, then break into hysterical applause. At SHAEF headquarters, Eisenhower stares at an intelligence report, his face ashen.",
      anchorImageUrl: null,
    },
  },

  // Branch 2: Western Allies reach Berlin before the Soviets
  {
    forkDescription: "Eisenhower, overruling his own strategic instincts, orders Patton and Montgomery to race for Berlin. The 9th Army crosses the Elbe and reaches the outskirts of Berlin in mid-April, days before the Red Army.",
    matchKeywords: ["race to berlin", "western allies berlin", "patton berlin", "eisenhower advance", "anglo-american occupation"],
    forkDelta: {
      entityChanges: [
        { entityId: "usa", field: "properties.military", oldValue: "strong", newValue: "at-berlin" },
        { entityId: "germany", field: "status", oldValue: "retreating", newValue: "collapsing" },
      ],
      factChanges: [
        { factId: "western-berlin", oldValue: null, newValue: { type: "hard", statement: "American and British forces have reached Berlin before the Soviet Army", confidence: 100 } },
        { factId: "german-western-surrender", oldValue: null, newValue: { type: "soft", statement: "German units are surrendering preferentially to Western forces rather than the Soviets", confidence: 90 } },
      ],
      causalVarChanges: [
        { varName: "morale", delta: 10 },
        { varName: "logistics", delta: -5 },
        { varName: "escalation", delta: 5 },
      ],
    },
    forkEventSpec: {
      title: "Western Allies Capture Berlin",
      description: "American and British forces win the race to Berlin, capturing the German capital before the Red Army and reshaping the postwar order of Europe.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "Soviet Fury and the Standoff at the Elbe",
          description: "Stalin is incandescent with rage. Soviet and American forces face each other across the Elbe in tense armed standoffs. The alliance that won the war threatens to collapse into immediate confrontation.",
          category: "diplomatic",
        },
        deltas: {
          entityChanges: [
            { entityId: "ussr", field: "status", oldValue: "counterattacking", newValue: "hostile-standoff" },
          ],
          factChanges: [
            { factId: "elbe-standoff", oldValue: null, newValue: { type: "hard", statement: "Soviet and American forces face each other in armed standoffs along the Elbe", confidence: 90 } },
            { factId: "cold-war-early", oldValue: null, newValue: { type: "soft", statement: "The Western-Soviet alliance is collapsing into open hostility", confidence: 85 } },
          ],
          causalVarChanges: [
            { varName: "escalation", delta: 15 },
            { varName: "morale", delta: -5 },
          ],
        },
        timestamp: "1945-04-25",
      },
      {
        eventSpec: {
          title: "Germany Unified Under Western Occupation",
          description: "With Berlin in Western hands, the postwar partition of Germany is averted. A unified, Western-aligned Germany begins to emerge, fundamentally altering the shape of Cold War Europe.",
          category: "political",
        },
        deltas: {
          entityChanges: [
            { entityId: "germany", field: "status", oldValue: "collapsing", newValue: "western-occupied" },
          ],
          factChanges: [
            { factId: "unified-germany", oldValue: null, newValue: { type: "soft", statement: "Germany may remain unified under Western occupation rather than being divided", confidence: 75 } },
            { factId: "iron-curtain-shifted", oldValue: null, newValue: { type: "soft", statement: "The postwar boundary between East and West is shifting eastward", confidence: 80 } },
          ],
          causalVarChanges: [
            { varName: "morale", delta: 10 },
            { varName: "escalation", delta: -5 },
          ],
        },
        timestamp: "1945-06-01",
      },
    ],
    branchPriors: { plausibility: 30, coherence: 85, novelty: 55 },
    renderPack: {
      sceneBible: "American Sherman tanks roll through the rubble of the Tiergarten. GIs plant a US flag on the Reichstag steps as Soviet artillery thunders from the east bank of the Oder. Patton stands in his command half-track, pearl-handled pistols gleaming, surveying the shattered capital.",
      anchorImageUrl: null,
    },
  },

  // Branch 3: Germany negotiates a conditional surrender
  {
    forkDescription: "With Hitler dead by suicide in early April, Doenitz and the remaining German leadership negotiate a conditional surrender that preserves some German sovereignty. The Allies, exhausted, accept terms short of unconditional capitulation.",
    matchKeywords: ["conditional surrender", "negotiated peace", "doenitz", "armistice terms", "partial surrender"],
    forkDelta: {
      entityChanges: [
        { entityId: "hitler", field: "status", oldValue: "alive", newValue: "dead" },
        { entityId: "germany", field: "properties.leader", oldValue: "hitler", newValue: "doenitz" },
        { entityId: "germany", field: "status", oldValue: "retreating", newValue: "negotiating" },
      ],
      factChanges: [
        { factId: "hitler-dead", oldValue: null, newValue: { type: "hard", statement: "Hitler has committed suicide in his Berlin bunker", confidence: 100 } },
        { factId: "conditional-surrender", oldValue: null, newValue: { type: "hard", statement: "Germany is negotiating conditional surrender terms with the Western Allies", confidence: 90 } },
      ],
      causalVarChanges: [
        { varName: "escalation", delta: -20 },
        { varName: "morale", delta: 5 },
        { varName: "intelligence", delta: 5 },
      ],
    },
    forkEventSpec: {
      title: "German Conditional Surrender Offer",
      description: "After Hitler's death, Admiral Doenitz opens negotiations for a conditional surrender that would preserve a rump German state and avoid total occupation.",
      category: "diplomatic",
    },
    continuations: [
      {
        eventSpec: {
          title: "Western-Soviet Split Over German Terms",
          description: "The West cautiously entertains Doenitz's terms as a bulwark against Soviet expansion. Stalin denounces the negotiations as a betrayal and continues the Red Army's advance.",
          category: "diplomatic",
        },
        deltas: {
          entityChanges: [
            { entityId: "ussr", field: "status", oldValue: "counterattacking", newValue: "advancing-unilaterally" },
          ],
          factChanges: [
            { factId: "allied-split-surrender", oldValue: null, newValue: { type: "hard", statement: "The Western Allies and USSR have split over accepting Germany's conditional surrender", confidence: 90 } },
          ],
          causalVarChanges: [
            { varName: "escalation", delta: 10 },
            { varName: "morale", delta: -5 },
          ],
        },
        timestamp: "1945-04-20",
      },
      {
        eventSpec: {
          title: "Rump German State Established",
          description: "A truncated German state centered on the western zones accepts demilitarization but retains its civilian government. War crimes tribunals proceed, but Germany avoids total dismemberment.",
          category: "political",
        },
        deltas: {
          entityChanges: [
            { entityId: "germany", field: "status", oldValue: "negotiating", newValue: "conditional-peace" },
            { entityId: "germany", field: "properties.territory", oldValue: "central-and-eastern-europe", newValue: "western-germany-only" },
          ],
          factChanges: [
            { factId: "rump-germany", oldValue: null, newValue: { type: "soft", statement: "A demilitarized German state persists in the western zones under Allied supervision", confidence: 80 } },
            { factId: "nuremberg-proceeds", oldValue: null, newValue: { type: "hard", statement: "War crimes tribunals will proceed against Nazi leadership", confidence: 95 } },
          ],
          causalVarChanges: [
            { varName: "escalation", delta: -10 },
            { varName: "morale", delta: 5 },
          ],
        },
        timestamp: "1945-06-15",
      },
    ],
    branchPriors: { plausibility: 15, coherence: 80, novelty: 60 },
    renderPack: {
      sceneBible: "A candlelit room in Flensburg. Admiral Doenitz, gaunt in naval uniform, sits across from Allied negotiators. A white flag hangs limply over the naval headquarters. Outside, columns of exhausted Wehrmacht soldiers file past, laying down their weapons. In the east, the sound of Soviet guns rolls on.",
      anchorImageUrl: null,
    },
  },
];
