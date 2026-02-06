export const INITIAL_ENTITIES = {
  germany: { type: "faction", name: "Nazi Germany", status: "aggressive", properties: { territory: "central-europe", military: "strong", industry: "high", leader: "hitler" } },
  uk: { type: "faction", name: "United Kingdom", status: "at-war", properties: { territory: "british-isles", military: "moderate", industry: "high", leader: "chamberlain" } },
  france: { type: "faction", name: "France", status: "at-war", properties: { territory: "western-europe", military: "moderate", industry: "moderate", leader: "daladier" } },
  ussr: { type: "faction", name: "Soviet Union", status: "neutral", properties: { territory: "eastern-europe-asia", military: "large", industry: "growing", leader: "stalin" } },
  usa: { type: "faction", name: "United States", status: "neutral", properties: { territory: "north-america", military: "small", industry: "massive", leader: "roosevelt" } },
  japan: { type: "faction", name: "Empire of Japan", status: "aggressive", properties: { territory: "east-asia-pacific", military: "strong-navy", industry: "moderate", leader: "hirohito" } },
  poland: { type: "faction", name: "Poland", status: "invaded", properties: { territory: "eastern-europe", military: "weak", industry: "low" } },
  italy: { type: "faction", name: "Fascist Italy", status: "aggressive", properties: { territory: "southern-europe", military: "moderate", industry: "moderate", leader: "mussolini" } },
  hitler: { type: "person", name: "Adolf Hitler", status: "alive", properties: { role: "fuhrer", nation: "germany" } },
  churchill: { type: "person", name: "Winston Churchill", status: "alive", properties: { role: "politician", nation: "uk" } },
  roosevelt: { type: "person", name: "Franklin D. Roosevelt", status: "alive", properties: { role: "president", nation: "usa" } },
  stalin: { type: "person", name: "Joseph Stalin", status: "alive", properties: { role: "general-secretary", nation: "ussr" } },
  mussolini: { type: "person", name: "Benito Mussolini", status: "alive", properties: { role: "il-duce", nation: "italy" } },
};

export const INITIAL_FACTS = {
  "war-europe": { type: "hard", statement: "Germany has invaded Poland, starting World War II in Europe", confidence: 100 },
  "uk-france-alliance": { type: "hard", statement: "UK and France are allied against Germany", confidence: 100 },
  "molotov-ribbentrop": { type: "hard", statement: "Germany and USSR have a non-aggression pact", confidence: 100 },
  "us-neutrality": { type: "hard", statement: "The United States maintains official neutrality", confidence: 100 },
  "axis-forming": { type: "soft", statement: "Germany, Italy, and Japan are forming an Axis alliance", confidence: 85 },
  "blitzkrieg-doctrine": { type: "hard", statement: "Germany employs blitzkrieg rapid-assault tactics", confidence: 100 },
  "atlantic-trade": { type: "soft", statement: "Atlantic trade routes are vital for Allied supply", confidence: 90 },
  "japan-china-war": { type: "hard", statement: "Japan is engaged in war with China since 1937", confidence: 100 },
};

export const INITIAL_CAUSAL_VARS = {
  escalation: 60,
  logistics: 50,
  intelligence: 40,
  morale: 65,
  techLevel: 45,
};
