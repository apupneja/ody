export const britainBranches = [
  // Branch 1: Germany wins air superiority over Britain
  {
    forkDescription:
      "Goering maintains focus on RAF airfields and radar stations instead of switching to the Blitz on London. By mid-September 1940, Fighter Command's losses exceed replacement rates. The RAF withdraws north of the Thames, conceding air superiority over southern England.",
    matchKeywords: ["battle of britain", "raf", "luftwaffe", "air superiority", "goering", "fighter command"],
    forkDelta: {
      entityChanges: [
        { entityId: "uk", field: "airDefenseStatus", from: "holding", to: "broken south of Thames" },
        { entityId: "germany", field: "channelAirControl", from: "contested", to: "dominant" },
        { entityId: "churchill", field: "publicConfidence", from: "rallying", to: "under severe pressure" },
      ],
      factChanges: [
        { fact: "RAF wins Battle of Britain", from: true, to: false },
        { fact: "Luftwaffe achieves air superiority over southern England", from: false, to: true },
      ],
      causalVarChanges: [
        { variable: "seaLionFeasibility", delta: 35 },
        { variable: "britishHomeFrontMorale", delta: -40 },
        { variable: "rafOperationalCapacity", delta: -50 },
      ],
    },
    forkEventSpec: {
      title: "Black September",
      description:
        "Luftwaffe raids systematically destroy Biggin Hill, Kenley, and Hornchurch airfields. Fighter Command loses 300 pilots in two weeks—irreplaceable veterans. Air Vice-Marshal Park orders No. 11 Group to withdraw to emergency fields north of London.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "Operation Sea Lion Launches",
          description:
            "With air superiority achieved, Hitler authorizes the cross-Channel invasion. German barges, protected by Luftwaffe air cover, begin crossing on September 21. The Royal Navy intervenes with devastating losses on both sides, but German troops establish a beachhead near Folkestone.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "germany", field: "invasionStatus", from: "planned", to: "underway" },
            { entityId: "uk", field: "territorialIntegrity", from: "intact", to: "beachhead established" },
          ],
          factChanges: [
            { fact: "Operation Sea Lion executed", from: false, to: true },
            { fact: "German troops on English soil", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "britishSurvivalThreat", delta: 60 },
            { variable: "royalNavyLosses", delta: 30 },
          ],
        },
        timestamp: "1940-09-21",
      },
      {
        eventSpec: {
          title: "Roosevelt Declares a Hemispheric Emergency",
          description:
            "The prospect of Britain's fall shocks Washington. Roosevelt declares a national emergency and pushes through emergency defense spending. The US Atlantic Fleet begins escorting convoys. America edges closer to war, driven by fear of a German-dominated Atlantic.",
          category: "political",
        },
        deltas: {
          entityChanges: [
            { entityId: "usa", field: "militaryPosture", from: "peacetime", to: "emergency mobilization" },
            { entityId: "roosevelt", field: "warAuthority", from: "limited", to: "expanded by emergency powers" },
          ],
          factChanges: [
            { fact: "US begins Atlantic convoy escorts in 1940", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "usWarReadiness", delta: 30 },
            { variable: "atlanticWarEscalation", delta: 25 },
          ],
        },
        timestamp: "1940-10-05",
      },
    ],
    branchPriors: { plausibility: 25, coherence: 80, novelty: 45 },
    renderPack: {
      sceneBible:
        "September 1940. Cratered RAF airfield at Biggin Hill. Shattered Spitfires burning on the tarmac. Ground crew dragging wounded pilots from wreckage. Overhead, formations of Heinkel 111s droning unopposed toward London. Columns of black smoke on every horizon. The few who remain look skyward with hollow eyes.",
      anchorImageUrl: null,
    },
  },

  // Branch 2: Churchill is assassinated
  {
    forkDescription:
      "A Luftwaffe bomb strikes 10 Downing Street during a late-night War Cabinet meeting in October 1940. Churchill is killed along with several cabinet members. Britain is plunged into a leadership crisis at its darkest hour.",
    matchKeywords: ["churchill", "assassination", "downing street", "blitz", "leadership", "britain"],
    forkDelta: {
      entityChanges: [
        { entityId: "churchill", field: "status", from: "alive", to: "killed in bombing" },
        { entityId: "uk", field: "leadership", from: "Churchill-led resolve", to: "succession crisis" },
        { entityId: "germany", field: "diplomaticLeverage", from: "moderate", to: "significant" },
      ],
      factChanges: [
        { fact: "Churchill leads Britain through the war", from: true, to: false },
        { fact: "Churchill killed by Luftwaffe bomb October 1940", from: false, to: true },
      ],
      causalVarChanges: [
        { variable: "britishWarResolve", delta: -45 },
        { variable: "peaceNegotiationPressure", delta: 40 },
        { variable: "germanMorale", delta: 20 },
      ],
    },
    forkEventSpec: {
      title: "The Downing Street Bomb",
      description:
        "A direct hit on 10 Downing Street during an evening cabinet session kills Prime Minister Winston Churchill, Foreign Secretary Lord Halifax, and three other ministers. The nation mourns. The war hangs in the balance.",
      category: "political",
    },
    continuations: [
      {
        eventSpec: {
          title: "Attlee Takes the Helm",
          description:
            "Clement Attlee, Deputy Prime Minister and Labour leader, assumes power. Lacking Churchill's rhetorical fire but possessing quiet determination, Attlee vows to continue the war. His leadership style is managerial rather than inspirational—effective but unable to replicate Churchill's galvanizing effect.",
          category: "political",
        },
        deltas: {
          entityChanges: [
            { entityId: "uk", field: "primeMinister", from: "Churchill", to: "Attlee" },
            { entityId: "uk", field: "warLeadershipStyle", from: "inspirational", to: "managerial" },
          ],
          factChanges: [
            { fact: "Attlee becomes wartime PM in 1940", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "britishPublicMorale", delta: -15 },
            { variable: "domesticWarEfficiency", delta: 10 },
          ],
        },
        timestamp: "1940-10-20",
      },
      {
        eventSpec: {
          title: "German Peace Feelers Intensify",
          description:
            "Berlin, sensing an opportunity, channels peace proposals through Swedish and Swiss intermediaries. The terms are superficially generous: Britain keeps its Empire; Germany keeps Europe. A vocal peace faction emerges in Parliament, testing Attlee's resolve.",
          category: "diplomatic",
        },
        deltas: {
          entityChanges: [
            { entityId: "germany", field: "diplomaticStrategy", from: "military pressure only", to: "peace offensive" },
            { entityId: "uk", field: "internalCohesion", from: "united under Churchill", to: "divided peace debate" },
          ],
          factChanges: [
            { fact: "Serious Anglo-German peace negotiations in 1940", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "britishWarContinuation", delta: -25 },
            { variable: "germanDiplomaticInitiative", delta: 30 },
          ],
        },
        timestamp: "1940-11-10",
      },
    ],
    branchPriors: { plausibility: 10, coherence: 70, novelty: 75 },
    renderPack: {
      sceneBible:
        "Night, October 1940. Downing Street in ruins. Firefighters hosing down smoldering rubble where Number 10 stood. A shattered black door—the iconic entrance—lying in the debris. Union Jacks at half-mast across London. Searchlights still sweeping the sky. A nation in shock.",
      anchorImageUrl: null,
    },
  },

  // Branch 3: Britain develops radar-guided missiles early
  {
    forkDescription:
      "British boffins at the Telecommunications Research Establishment achieve a breakthrough: marrying proximity-fused rockets to radar guidance. By late 1940, experimental radar-guided anti-aircraft missiles begin shooting down Luftwaffe bombers with unprecedented accuracy.",
    matchKeywords: ["radar", "missiles", "technology", "britain", "anti-aircraft", "boffinry", "tre"],
    forkDelta: {
      entityChanges: [
        { entityId: "uk", field: "airDefenseTechnology", from: "radar + fighters", to: "radar-guided missiles" },
        { entityId: "germany", field: "bomberLosses", from: "sustainable", to: "catastrophic" },
      ],
      factChanges: [
        { fact: "Guided missiles deployed in WW2 by 1940", from: false, to: true },
        { fact: "Luftwaffe bombing campaign remains viable", from: true, to: false },
      ],
      causalVarChanges: [
        { variable: "britishAirDefenseEffectiveness", delta: 60 },
        { variable: "luftwaffeBomberAttrition", delta: 50 },
        { variable: "technologicalArmsRace", delta: 30 },
      ],
    },
    forkEventSpec: {
      title: "Project Doorbolt",
      description:
        "Codenamed 'Doorbolt,' the first battery of radar-guided Unrotated Projectiles destroys 14 Heinkel bombers over Kent in a single night. Goering, receiving impossible loss reports, initially accuses his pilots of cowardice before intelligence confirms the terrifying truth: the British have weapons that cannot miss.",
      category: "technology",
    },
    continuations: [
      {
        eventSpec: {
          title: "The Luftwaffe Abandons Daylight Operations Over Britain",
          description:
            "After losing 400 bombers in three weeks to the mysterious British weapons, Goering halts all operations over England. The Blitz ends not with a whimper but with a technological knockout. Germany scrambles to develop countermeasures.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "germany", field: "airWarStrategy", from: "strategic bombing", to: "suspended over Britain" },
            { entityId: "uk", field: "airspace", from: "contested", to: "secure" },
          ],
          factChanges: [
            { fact: "Blitz ends due to unsustainable losses", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "luftwaffeStrength", delta: -40 },
            { variable: "britishIndustrialOutput", delta: 20 },
          ],
        },
        timestamp: "1940-12-01",
      },
      {
        eventSpec: {
          title: "The Tizard Mission Shares Missile Technology with America",
          description:
            "Churchill authorizes sharing the radar-missile technology with the United States through the expanded Tizard Mission. American industrial capacity begins mass-producing the weapons. Within months, the technology reshapes naval warfare as anti-ship variants are developed.",
          category: "technology",
        },
        deltas: {
          entityChanges: [
            { entityId: "usa", field: "militaryTechnology", from: "conventional", to: "guided weapons program" },
            { entityId: "uk", field: "techDiplomacy", from: "sharing radar", to: "sharing guided weapons" },
          ],
          factChanges: [
            { fact: "Allied guided weapons in mass production by 1941", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "alliedTechAdvantage", delta: 45 },
            { variable: "navalWarfareRevolution", delta: 35 },
          ],
        },
        timestamp: "1941-02-15",
      },
    ],
    branchPriors: { plausibility: 5, coherence: 60, novelty: 90 },
    renderPack: {
      sceneBible:
        "Night over Kent, late 1940. Streaks of rocket exhaust lancing upward from hidden batteries. Explosions blooming among Luftwaffe bomber formations at altitude. Searchlight beams stabbing the darkness, but the missiles need no light—they follow invisible radar beams. Burning aircraft tumbling from the sky. On the ground, scientists in lab coats watch alongside soldiers, clipboards in hand.",
      anchorImageUrl: null,
    },
  },
];
