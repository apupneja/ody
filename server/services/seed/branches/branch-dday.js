// Branch seeds for the D-Day fork point (June 1944)

export const DDAY_BRANCHES = [
  // Branch 1: D-Day invasion fails on the beaches
  {
    forkDescription: "A channel storm scatters the invasion fleet. Rommel's panzer reserves, released early by a panicked OKW, counterattack at Omaha and Utah before the beachheads consolidate. Allied forces are thrown back into the sea with catastrophic losses.",
    matchKeywords: ["d-day failure", "normandy defeat", "invasion repelled", "rommel counterattack", "beach disaster"],
    forkDelta: {
      entityChanges: [
        { entityId: "france", field: "status", oldValue: "occupied", newValue: "still-occupied" },
        { entityId: "germany", field: "status", oldValue: "overstretched", newValue: "resurgent-west" },
        { entityId: "usa", field: "properties.military", oldValue: "strong", newValue: "recovering" },
      ],
      factChanges: [
        { factId: "dday-failed", oldValue: null, newValue: { type: "hard", statement: "The Allied invasion at Normandy has failed with over 50,000 casualties", confidence: 100 } },
        { factId: "western-front-delayed", oldValue: null, newValue: { type: "hard", statement: "No Western Front exists; Germany can concentrate forces against the USSR", confidence: 95 } },
      ],
      causalVarChanges: [
        { varName: "morale", delta: -20 },
        { varName: "logistics", delta: -15 },
        { varName: "escalation", delta: 10 },
      ],
    },
    explanation:
      "D-Day's success was far from certain. A channel storm had already forced a one-day delay. Rommel had requested panzer reserves be positioned near the coast, but Hitler kept them inland. Had the weather been worse or the German armored response faster, the beachheads — especially Omaha — could have been overrun before consolidating.",
    forkEventSpec: {
      title: "D-Day Invasion Repelled",
      description: "German forces repel the Normandy landings. The greatest amphibious assault in history ends in catastrophic failure on the beaches.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "Eisenhower Resigns; Allied Command in Crisis",
          description: "Eisenhower takes responsibility and resigns as Supreme Commander. The Anglo-American alliance fractures over blame. Churchill and Roosevelt clash over the next move.",
          category: "political",
        },
        deltas: {
          entityChanges: [
            { entityId: "uk", field: "properties.leader", oldValue: "churchill", newValue: "churchill" },
          ],
          factChanges: [
            { factId: "allied-crisis", oldValue: null, newValue: { type: "hard", statement: "The Anglo-American alliance is strained by recriminations over the Normandy disaster", confidence: 90 } },
            { factId: "eisenhower-removed", oldValue: null, newValue: { type: "hard", statement: "Eisenhower has resigned as Supreme Allied Commander", confidence: 100 } },
          ],
          causalVarChanges: [
            { varName: "morale", delta: -10 },
            { varName: "intelligence", delta: -5 },
          ],
        },
        timestamp: "1944-07-15",
      },
      {
        eventSpec: {
          title: "Germany Shifts Forty Divisions East",
          description: "With the Western invasion threat eliminated, Hitler transfers forty divisions to the Eastern Front. Operation Bagration stalls against reinforced German lines.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "germany", field: "properties.military", oldValue: "strong", newValue: "reinforced-east" },
            { entityId: "ussr", field: "status", oldValue: "counterattacking", newValue: "stalled-advance" },
          ],
          factChanges: [
            { factId: "eastern-reinforcement", oldValue: null, newValue: { type: "hard", statement: "Massive German reinforcements from the West have slowed the Soviet advance", confidence: 90 } },
          ],
          causalVarChanges: [
            { varName: "morale", delta: -5 },
            { varName: "logistics", delta: 5 },
          ],
        },
        timestamp: "1944-09-01",
      },
    ],
    branchPriors: { plausibility: 20, coherence: 85, novelty: 50 },
    renderPack: {
      sceneBible: "Omaha Beach at dawn, waves red with blood. Landing craft burn at the waterline. German MG-42 fire rakes the sand from concrete bunkers. Abandoned Sherman tanks sit half-submerged in the surf. Through the smoke, signal flags order the withdrawal.",
      anchorImageUrl: null,
    },
  },

  // Branch 2: Allies invade through the Balkans instead
  {
    forkDescription: "Churchill's Mediterranean strategy prevails. Instead of Normandy, the Allies launch a massive invasion through Yugoslavia and Greece, aiming to reach Vienna and Berlin from the southeast, cutting off Soviet westward expansion.",
    matchKeywords: ["balkan invasion", "churchill strategy", "mediterranean", "southern front", "vienna offensive"],
    forkDelta: {
      entityChanges: [
        { entityId: "italy", field: "status", oldValue: "aggressive", newValue: "springboard" },
        { entityId: "germany", field: "status", oldValue: "overstretched", newValue: "southern-crisis" },
      ],
      factChanges: [
        { factId: "balkan-invasion", oldValue: null, newValue: { type: "hard", statement: "Allied forces have invaded the Balkans through Yugoslavia and Greece", confidence: 100 } },
        { factId: "normandy-cancelled", oldValue: null, newValue: { type: "hard", statement: "The cross-Channel invasion has been postponed indefinitely in favor of the Balkan approach", confidence: 95 } },
      ],
      causalVarChanges: [
        { varName: "logistics", delta: -5 },
        { varName: "escalation", delta: 10 },
        { varName: "morale", delta: 5 },
      ],
    },
    explanation:
      "Churchill repeatedly advocated for attacking through the 'soft underbelly of Europe' via the Balkans and Italy. American planners opposed this as strategically inferior to a cross-Channel assault. But Churchill's real motivation may have been geopolitical — reaching Vienna and Budapest before the Red Army to prevent Soviet domination of Central Europe.",
    forkEventSpec: {
      title: "Allied Balkan Invasion",
      description: "The Western Allies invade through the Balkans rather than Normandy, pursuing Churchill's strategy to reach Central Europe before the Soviets.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "Partisan Uprising Across Yugoslavia",
          description: "Tito's partisans launch a coordinated uprising in support of the Allied invasion. German occupation forces are overwhelmed. The Balkans erupt in full-scale war.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "germany", field: "properties.territory", oldValue: "central-and-eastern-europe", newValue: "losing-balkans" },
          ],
          factChanges: [
            { factId: "balkan-uprising", oldValue: null, newValue: { type: "hard", statement: "Partisan uprisings across Yugoslavia are tying down German divisions", confidence: 90 } },
          ],
          causalVarChanges: [
            { varName: "morale", delta: 10 },
            { varName: "logistics", delta: -5 },
          ],
        },
        timestamp: "1944-08-01",
      },
      {
        eventSpec: {
          title: "Stalin Accelerates Westward Push",
          description: "Furious that the Allies are racing for Vienna, Stalin orders reckless offensive operations. The Red Army surges into Poland and Romania at enormous cost in lives.",
          category: "political",
        },
        deltas: {
          entityChanges: [
            { entityId: "ussr", field: "properties.territory", oldValue: "eastern-europe-asia", newValue: "expanding-westward" },
            { entityId: "poland", field: "status", oldValue: "invaded", newValue: "soviet-occupied" },
          ],
          factChanges: [
            { factId: "race-to-vienna", oldValue: null, newValue: { type: "soft", statement: "Western Allies and the USSR are racing to reach Central Europe first", confidence: 90 } },
          ],
          causalVarChanges: [
            { varName: "escalation", delta: 10 },
            { varName: "morale", delta: -5 },
          ],
        },
        timestamp: "1944-10-01",
      },
    ],
    branchPriors: { plausibility: 25, coherence: 80, novelty: 60 },
    renderPack: {
      sceneBible: "Allied landing ships unload on a rocky Adriatic beach backed by steep limestone cliffs. Paratroopers float down over olive groves. In the mountains above, bearded partisans wave red-starred flags. Churchill stabs a map of the Balkans with his cigar hand, grinning at the War Cabinet.",
      anchorImageUrl: null,
    },
  },

  // Branch 3: German generals successfully assassinate Hitler (July Plot)
  {
    forkDescription: "Stauffenberg's bomb kills Hitler on July 20, 1944. Operation Valkyrie succeeds. A military junta seizes power in Berlin and immediately seeks armistice negotiations with the Western Allies.",
    matchKeywords: ["july plot", "valkyrie", "stauffenberg", "hitler assassination", "german coup"],
    forkDelta: {
      entityChanges: [
        { entityId: "hitler", field: "status", oldValue: "alive", newValue: "dead" },
        { entityId: "germany", field: "properties.leader", oldValue: "hitler", newValue: "military-junta" },
        { entityId: "germany", field: "status", oldValue: "overstretched", newValue: "coup-in-progress" },
      ],
      factChanges: [
        { factId: "hitler-dead", oldValue: null, newValue: { type: "hard", statement: "Hitler has been killed by a bomb planted by Wehrmacht officers", confidence: 100 } },
        { factId: "valkyrie-success", oldValue: null, newValue: { type: "hard", statement: "Operation Valkyrie has succeeded; a military government controls Berlin", confidence: 100 } },
        { factId: "armistice-offer", oldValue: null, newValue: { type: "soft", statement: "The new German government is seeking armistice terms with the Western Allies", confidence: 85 } },
      ],
      causalVarChanges: [
        { varName: "escalation", delta: -15 },
        { varName: "morale", delta: 10 },
        { varName: "intelligence", delta: 10 },
      ],
    },
    explanation:
      "The July 20 plot came agonizingly close to success. Stauffenberg's briefcase bomb was moved behind a heavy table leg moments before detonation, shielding Hitler. Had the conference been held in a concrete bunker (as originally planned) rather than a wooden hut, the blast would have been lethal. A post-Hitler Germany seeking peace in mid-1944 would have transformed the postwar order.",
    forkEventSpec: {
      title: "Successful July 20 Plot",
      description: "Colonel Stauffenberg's bomb kills Hitler. Wehrmacht conspirators execute Operation Valkyrie, seize control of Berlin, and broadcast an offer of armistice to the Western Allies.",
      category: "political",
    },
    continuations: [
      {
        eventSpec: {
          title: "Western Allies Debate the German Offer",
          description: "Churchill favors negotiation; Roosevelt insists on unconditional surrender. Stalin demands the war continue until Berlin falls. The Allied coalition cracks under the strain.",
          category: "diplomatic",
        },
        deltas: {
          entityChanges: [
            { entityId: "uk", field: "status", oldValue: "defending", newValue: "negotiating" },
          ],
          factChanges: [
            { factId: "allied-split", oldValue: null, newValue: { type: "soft", statement: "The Western Allies and USSR disagree sharply on whether to negotiate with the new German government", confidence: 90 } },
          ],
          causalVarChanges: [
            { varName: "escalation", delta: -10 },
            { varName: "morale", delta: 5 },
          ],
        },
        timestamp: "1944-08-15",
      },
      {
        eventSpec: {
          title: "SS Loyalist Counter-Coup Attempt",
          description: "Himmler rallies Waffen-SS divisions and attempts to retake Berlin. Street fighting erupts between Wehrmacht and SS forces. Germany teeters on the edge of civil war.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "germany", field: "status", oldValue: "coup-in-progress", newValue: "civil-war" },
          ],
          factChanges: [
            { factId: "german-civil-war", oldValue: null, newValue: { type: "hard", statement: "Wehrmacht and SS forces are fighting each other in German cities", confidence: 90 } },
          ],
          causalVarChanges: [
            { varName: "escalation", delta: 5 },
            { varName: "logistics", delta: -10 },
            { varName: "morale", delta: -5 },
          ],
        },
        timestamp: "1944-08-01",
      },
    ],
    branchPriors: { plausibility: 15, coherence: 80, novelty: 75 },
    renderPack: {
      sceneBible: "The Wolf's Lair conference room, blown apart. Smoke curls from a shattered oak table. In Berlin, Wehrmacht officers in field-grey seize the radio station. Tanks flying the old Imperial tricolor rumble down Unter den Linden. In an SS barracks, men in black uniforms load their weapons.",
      anchorImageUrl: null,
    },
  },
];
