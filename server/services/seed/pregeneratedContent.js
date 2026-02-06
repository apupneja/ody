import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PREGEN_PATH = join(__dirname, "pregenerated.json");

let cache = null;

function load() {
  if (cache !== null) return cache;
  try {
    const raw = readFileSync(PREGEN_PATH, "utf-8");
    cache = JSON.parse(raw);
    console.log(`[Pregen] Loaded ${Object.keys(cache).length} pre-generated entries`);
  } catch {
    cache = {};
  }
  return cache;
}

/**
 * Look up pre-generated content by stable content key.
 * Returns { narrationText, audioUrl, anchorImageUrl } or null.
 */
export function getPregenerated(contentKey) {
  if (!contentKey) return null;
  const data = load();
  return data[contentKey] ?? null;
}

export function hasPregenerated(contentKey) {
  return getPregenerated(contentKey) !== null;
}
