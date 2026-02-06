export const franceBranches = [
  // Branch 1: France holds at the Maginot Line
  {
    forkDescription:
      "French intelligence detects the Ardennes thrust early. Reserves are redeployed to Sedan before Guderian's panzers can cross the Meuse. The German gamble through the forest fails, and the front stabilizes into a grinding positional war reminiscent of 1914-1918.",
    matchKeywords: ["france", "fall of france", "maginot", "ardennes", "sedan", "meuse", "guderian"],
    forkDelta: {
      entityChanges: [
        { entityId: "france", field: "defensiveIntegrity", from: "breached at Sedan", to: "holding" },
        { entityId: "germany", field: "blitzkriegMomentum", from: "decisive", to: "stalled" },
        { entityId: "uk", field: "befStatus", from: "evacuating", to: "reinforcing" },
      ],
      factChanges: [
        { fact: "France falls in six weeks", from: true, to: false },
        { fact: "Ardennes breakthrough succeeds", from: true, to: false },
      ],
      causalVarChanges: [
        { variable: "germanOffensivePower", delta: -35 },
        { variable: "frenchNationalMorale", delta: 40 },
        { variable: "westernFrontStalemate", delta: 50 },
      ],
    },
    explanation:
      "The German breakthrough at Sedan was a near-run thing. French reserves were available but slow to deploy, and Guderian's crossing succeeded partly through audacity and French command paralysis. Had French intelligence acted on early warnings of the Ardennes thrust, even a few hours' head start could have turned Sedan into a killing ground.",
    forkEventSpec: {
      title: "The Meuse Holds",
      description:
        "French artillery and hastily redeployed reserve divisions shatter the German pontoon bridges at Sedan. Guderian's XIX Panzer Corps is pinned on the east bank under withering fire. The Ardennes gambit—Germany's only path to quick victory—collapses.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "Stalemate and the Return of Trench Warfare",
          description:
            "By August 1940, the Western Front solidifies from the Swiss border to the Channel. Both sides dig in. France, scarred by memories of Verdun, begins massive fortification programs. Germany shifts to submarine warfare and strategic bombing.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "france", field: "warStrategy", from: "collapse", to: "attrition" },
            { entityId: "germany", field: "warStrategy", from: "blitzkrieg", to: "siege warfare" },
          ],
          factChanges: [
            { fact: "Western Front becomes static by mid-1940", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "germanResourceDrain", delta: 30 },
            { variable: "alliedTimeAdvantage", delta: 25 },
          ],
        },
        timestamp: "1940-08-15",
      },
      {
        eventSpec: {
          title: "Italy Stays Neutral",
          description:
            "Mussolini, who had waited for France to collapse before declaring war, watches the stalemate with cold calculation. Italy remains non-belligerent, denying Germany a Mediterranean ally and keeping North Africa quiet.",
          category: "diplomatic",
        },
        deltas: {
          entityChanges: [
            { entityId: "italy", field: "belligerencyStatus", from: "co-belligerent with Germany", to: "non-belligerent" },
            { entityId: "mussolini", field: "strategy", from: "opportunistic war", to: "armed neutrality" },
          ],
          factChanges: [
            { fact: "Italy declares war June 1940", from: true, to: false },
            { fact: "North African campaign begins", from: true, to: false },
          ],
          causalVarChanges: [
            { variable: "mediterraneanThreat", delta: -40 },
            { variable: "britishNavalFreedom", delta: 20 },
          ],
        },
        timestamp: "1940-07-01",
      },
    ],
    branchPriors: { plausibility: 20, coherence: 80, novelty: 50 },
    renderPack: {
      sceneBible:
        "June 1940. The Meuse River at Sedan, swollen with rain. Burning wreckage of German pontoon bridges. French 75mm guns firing from concealed positions on the west bank. Panzer IIIs stranded on muddy east-bank slopes. Smoke and chaos under grey skies.",
      anchorImageUrl: null,
    },
  },

  // Branch 2: Britain negotiates peace with Germany
  {
    forkDescription:
      "After the fall of France, Lord Halifax prevails over Churchill in the War Cabinet. Britain, exhausted and isolated, accepts German peace terms: recognition of German continental hegemony in exchange for preservation of the British Empire. Churchill resigns in disgust.",
    matchKeywords: ["britain", "peace", "halifax", "churchill", "armistice", "negotiation", "fall of france"],
    forkDelta: {
      entityChanges: [
        { entityId: "uk", field: "warStatus", from: "belligerent", to: "armistice" },
        { entityId: "churchill", field: "role", from: "prime minister", to: "resigned" },
        { entityId: "germany", field: "westernThreat", from: "active", to: "neutralized" },
      ],
      factChanges: [
        { fact: "Britain fights on alone after Fall of France", from: true, to: false },
        { fact: "Anglo-German armistice signed 1940", from: false, to: true },
      ],
      causalVarChanges: [
        { variable: "germanStrategicFreedom", delta: 50 },
        { variable: "alliedCauseViability", delta: -60 },
        { variable: "americanInterventionLikelihood", delta: -30 },
      ],
    },
    explanation:
      "In late May 1940, the British War Cabinet genuinely debated seeking peace terms. Halifax argued for negotiation through Mussolini; Churchill narrowly won the argument to fight on. Had Halifax prevailed — or had Dunkirk gone worse — Britain might have left the war, fundamentally altering the global balance of power.",
    forkEventSpec: {
      title: "The Halifax Armistice",
      description:
        "Lord Halifax, now Prime Minister, signs an armistice with Germany through Italian mediation. Britain retains its fleet and empire but accepts German dominion over continental Europe. The war in the West ends with a whimper.",
      category: "diplomatic",
    },
    continuations: [
      {
        eventSpec: {
          title: "Hitler Turns East Unopposed",
          description:
            "With no western front to worry about, Germany concentrates its full military might against the Soviet Union. Operation Barbarossa, launched with an additional 30 divisions freed from occupation duties, strikes with overwhelming force.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "germany", field: "availableDivisions", from: "145 for East", to: "175+ for East" },
            { entityId: "ussr", field: "strategicPosition", from: "threatened", to: "gravely threatened" },
            { entityId: "stalin", field: "allianceOptions", from: "potential Western allies", to: "isolated" },
          ],
          factChanges: [
            { fact: "Germany fights one-front war against USSR", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "sovietSurvivalChance", delta: -30 },
            { variable: "germanEasternStrength", delta: 40 },
          ],
        },
        timestamp: "1941-05-15",
      },
      {
        eventSpec: {
          title: "Roosevelt's Dilemma",
          description:
            "With Britain out of the war, Roosevelt loses his primary argument for American intervention. Isolationism surges. The America First Committee swells in membership. Lend-Lease dies in Congress. The United States turns inward.",
          category: "political",
        },
        deltas: {
          entityChanges: [
            { entityId: "usa", field: "foreignPolicy", from: "pro-Allied neutral", to: "isolationist" },
            { entityId: "roosevelt", field: "politicalPosition", from: "interventionist momentum", to: "domestically constrained" },
          ],
          factChanges: [
            { fact: "Lend-Lease enacted", from: true, to: false },
            { fact: "US isolationism prevails through 1941", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "usIsolationism", delta: 40 },
            { variable: "globalDemocraticProspects", delta: -35 },
          ],
        },
        timestamp: "1940-09-01",
      },
    ],
    branchPriors: { plausibility: 12, coherence: 75, novelty: 70 },
    renderPack: {
      sceneBible:
        "July 1940. A wood-paneled room in Whitehall. Lord Halifax at a long table, pen in hand, German diplomats opposite. Churchill's empty chair. Through the window, barrage balloons still float over London—soon to be deflated. A Union Jack at half-mast outside.",
      anchorImageUrl: null,
    },
  },

  // Branch 3: French fleet defects to the Allies en masse
  {
    forkDescription:
      "Admiral Darlan, rather than allowing the French fleet to fall under Vichy or German control, orders the entire Marine Nationale to sail for British and French colonial ports. The combined Anglo-French naval force becomes the most powerful fleet in the world.",
    matchKeywords: ["french fleet", "darlan", "marine nationale", "mers-el-kebir", "navy", "vichy"],
    forkDelta: {
      entityChanges: [
        { entityId: "france", field: "navalAssets", from: "under Vichy control", to: "with the Allies" },
        { entityId: "uk", field: "navalSuperiority", from: "stretched thin", to: "overwhelming" },
        { entityId: "germany", field: "navalProspects", from: "improving", to: "hopeless" },
      ],
      factChanges: [
        { fact: "Mers-el-Kebir attack occurs", from: true, to: false },
        { fact: "French fleet joins Free France en masse", from: false, to: true },
      ],
      causalVarChanges: [
        { variable: "alliedNavalPower", delta: 45 },
        { variable: "mediterraneanControl", delta: 40 },
        { variable: "freeFrenchLegitimacy", delta: 35 },
      ],
    },
    explanation:
      "The fate of the French fleet was one of the great anxieties of 1940. Churchill ordered the attack at Mers-el-Kébir because he couldn't risk it falling to Germany. Darlan was a pragmatist who ultimately sided with the Allies in 1942. Had he acted earlier, the Royal Navy would have gained a powerful ally and avoided one of the war's most tragic friendly-fire incidents.",
    forkEventSpec: {
      title: "Darlan's Defection",
      description:
        "Admiral Darlan signals his captains: 'Appareillage immédiat pour les ports alliés.' The Strasbourg, Dunkerque, Jean Bart, and Richelieu lead the French fleet out of Toulon and Mers-el-Kébir under cover of darkness. By dawn, the Marine Nationale sails under the Cross of Lorraine.",
      category: "military",
    },
    continuations: [
      {
        eventSpec: {
          title: "The Mediterranean Sealed",
          description:
            "The combined Anglo-French fleet dominates the Mediterranean. Italian naval power is bottled up in port. Supply lines to North Africa are severed. Mussolini's dreams of a new Roman Empire die before they begin.",
          category: "military",
        },
        deltas: {
          entityChanges: [
            { entityId: "italy", field: "navalPosition", from: "challenging Allied control", to: "blockaded" },
            { entityId: "uk", field: "mediterraneanControl", from: "contested", to: "dominant" },
          ],
          factChanges: [
            { fact: "Allied Mediterranean supremacy achieved 1940", from: false, to: true },
          ],
          causalVarChanges: [
            { variable: "italianWarCapacity", delta: -30 },
            { variable: "northAfricanCampaignScope", delta: -25 },
          ],
        },
        timestamp: "1940-08-10",
      },
      {
        eventSpec: {
          title: "De Gaulle's Government-in-Exile Gains Legitimacy",
          description:
            "With the fleet behind him and colonial governors following Darlan's lead, de Gaulle's Free French movement transforms from a radio voice into a credible government-in-exile commanding real military assets and territory across Africa and the Pacific.",
          category: "political",
        },
        deltas: {
          entityChanges: [
            { entityId: "france", field: "freeFrenchStrength", from: "symbolic", to: "substantial military force" },
            { entityId: "uk", field: "allyReliability", from: "France collapsed", to: "France fights on meaningfully" },
          ],
          factChanges: [
            { fact: "Free France controls significant military assets", from: false, to: true },
            { fact: "Vichy France controls the colonies", from: true, to: false },
          ],
          causalVarChanges: [
            { variable: "freeFrenchMilitaryPower", delta: 50 },
            { variable: "vichyLegitimacy", delta: -40 },
          ],
        },
        timestamp: "1940-09-15",
      },
    ],
    branchPriors: { plausibility: 18, coherence: 80, novelty: 55 },
    renderPack: {
      sceneBible:
        "Pre-dawn, summer 1940. The harbor at Toulon. Warships slipping anchor in darkness—the battleship Strasbourg's massive silhouette against a star-filled Mediterranean sky. Sailors working in silence. Signal lamps blinking between ships. The tricolor hauled down, replaced by the Cross of Lorraine. Open sea ahead.",
      anchorImageUrl: null,
    },
  },
];
