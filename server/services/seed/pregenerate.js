#!/usr/bin/env node
/**
 * Pre-generation script for WW2 scenario content.
 *
 * Usage:
 *   node server/services/seed/pregenerate.js          # generate all ~50 nodes
 *   node server/services/seed/pregenerate.js --test    # generate first 2 mainline events only
 *   node server/services/seed/pregenerate.js --dry-run # show prompts that would be sent, no API calls
 *
 * Requires env vars: ANTHROPIC_API_KEY, ELEVENLABS_API_KEY, FAL_KEY
 * Outputs: server/services/seed/pregenerated.json
 *
 * Supports resume: skips keys that already exist in the output file.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { buildMainlineEvents } from "./mainlineEvents.js";
import { polandBranches } from "./branches/branch-poland.js";
import { franceBranches } from "./branches/branch-france.js";
import { pearlHarborBranches } from "./branches/branch-pearlharbor.js";
import { DDAY_BRANCHES } from "./branches/branch-dday.js";
import { VJDAY_BRANCHES } from "./branches/branch-vjday.js";
import { EventNode } from "../../models/EventNode.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "pregenerated.json");

const isTest = process.argv.includes("--test");
const isDryRun = process.argv.includes("--dry-run");

// ─── Claude API (direct HTTP, no SDK dependency) ────────────────────────────

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function callClaude(systemPrompt, userPrompt, { model = "claude-sonnet-4-5-20250929", maxTokens = 1024 } = {}) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("No ANTHROPIC_API_KEY");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? "";
}

// ─── Narration generation ───────────────────────────────────────────────────

const NARRATION_SYSTEM = `You are a world-class documentary narrator in the style of Ken Burns and Peter Coyote. You write vivid, precise, emotionally resonant narration for a historical simulation app.

Rules:
- Write exactly 2-3 sentences of narration in present tense
- Be cinematic and evocative but historically grounded
- For alternate history branches, treat the counterfactual as real — narrate it with the same gravity as actual history
- Use specific details: names, places, dates, numbers
- No editorializing or meta-commentary
- No "In this timeline..." framing — just narrate the event as if it IS happening
- The narration will be read aloud by a TTS voice, so write for the ear, not the eye`;

function buildNarrationPrompt(eventNode) {
  const { title, description, category } = eventNode.eventSpec;
  const isAlt = eventNode.branchId !== "main";
  const worldContext = eventNode.worldState?.toJSON?.() ?? {};

  return `Narrate this ${isAlt ? "alternate history" : "historical"} event:

EVENT: ${title}
DESCRIPTION: ${description}
CATEGORY: ${category}
DATE: ${eventNode.timestamp}
TIMELINE: ${isAlt ? "Alternate history branch" : "Mainline history"}
${eventNode.forkDescription ? `FORK PREMISE: ${eventNode.forkDescription}` : ""}

WORLD CONTEXT (key entities and their states):
${Object.entries(worldContext.entities || {}).map(([id, e]) => `  ${e.name || id}: ${e.status || "unknown"}`).join("\n")}

Write 2-3 sentences of narration for this moment.`;
}

// ─── Image prompt generation ────────────────────────────────────────────────

const IMAGE_PROMPT_SYSTEM = `You are a master cinematographer and art director creating image prompts for an AI image generator (FLUX). You create photorealistic, historically grounded scene descriptions.

Rules:
- Write exactly ONE paragraph (3-5 sentences) describing a single powerful visual moment
- Include: specific camera angle, lighting conditions, time of day, weather
- Include: concrete physical details (uniforms, vehicles, architecture, terrain)
- Include: human elements (faces, gestures, crowds, soldiers)
- Style: photorealistic war photography / historical documentary still
- Aspect ratio: 16:9 widescreen
- NEVER include text, labels, captions, or watermarks in the image
- NEVER mention "alternate history" — depict it as real
- Use dramatic, cinematic lighting (golden hour, chiaroscuro, harsh flash, moonlight)
- Reference real photographic styles: Robert Capa, Dorothea Lange, LIFE Magazine`;

function buildImagePromptPrompt(eventNode) {
  const { title, description, category } = eventNode.eventSpec;
  const isAlt = eventNode.branchId !== "main";

  // Use sceneBible if available from branch renderPack
  const sceneBible = eventNode._sceneBible || "";

  return `Create a photorealistic image prompt for this ${isAlt ? "counterfactual" : "historical"} scene:

EVENT: ${title}
DESCRIPTION: ${description}
CATEGORY: ${category}
DATE: ${eventNode.timestamp}
${sceneBible ? `SCENE DIRECTION: ${sceneBible}` : ""}

Write a single paragraph image prompt. Return ONLY the prompt text, nothing else.`;
}

// ─── Narration + image prompt wrappers ──────────────────────────────────────

async function generateNarration(eventNode) {
  if (!ANTHROPIC_API_KEY) {
    // Fallback to mock
    const mock = await import("../../agents/mockOrchestrator.js");
    return mock.generateNarration(eventNode);
  }

  return callClaude(NARRATION_SYSTEM, buildNarrationPrompt(eventNode), {
    model: "claude-sonnet-4-5-20250929",
    maxTokens: 300,
  });
}

async function generateImagePrompt(eventNode) {
  if (!ANTHROPIC_API_KEY) {
    const mock = await import("../../agents/mockOrchestrator.js");
    return mock.generateImagePrompt(eventNode);
  }

  return callClaude(IMAGE_PROMPT_SYSTEM, buildImagePromptPrompt(eventNode), {
    model: "claude-haiku-4-5-20251001",
    maxTokens: 300,
  });
}

// ─── TTS (ElevenLabs) ──────────────────────────────────────────────────────

async function generateTTS(text) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  if (!apiKey) {
    console.log("  [skip] No ELEVENLABS_API_KEY");
    return null;
  }
  if (!text) return null;

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "xi-api-key": apiKey },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.6, similarity_boost: 0.75, style: 0.3 },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs ${response.status}: ${errText}`);
  }

  const buf = await response.arrayBuffer();
  return `data:audio/mpeg;base64,${Buffer.from(buf).toString("base64")}`;
}

// ─── Image generation (fal.ai) ─────────────────────────────────────────────

async function generateImage(eventNode) {
  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    console.log("  [skip] No FAL_KEY");
    return null;
  }

  const { fal } = await import("@fal-ai/client");
  fal.config({ credentials: falKey });

  const imagePrompt = await generateImagePrompt(eventNode);
  console.log(`  image prompt: ${imagePrompt.slice(0, 100)}...`);

  const result = await fal.subscribe("fal-ai/flux-pro/v1.1", {
    input: { prompt: imagePrompt, width: 1344, height: 768, num_images: 1 },
  });

  return result?.data?.images?.[0]?.url ?? null;
}

// ─── Build content list ─────────────────────────────────────────────────────

function buildContentList() {
  const mainlineData = buildMainlineEvents();
  const allBranches = [polandBranches, franceBranches, pearlHarborBranches, DDAY_BRANCHES, VJDAY_BRANCHES];
  const items = [];

  const mainlineLimit = isTest ? 2 : mainlineData.length;

  for (let i = 0; i < mainlineLimit; i++) {
    const data = mainlineData[i];
    const node = new EventNode({
      id: data.id,
      parentId: i > 0 ? mainlineData[i - 1].id : null,
      branchId: "main",
      timestamp: data.timestamp,
      eventSpec: data.eventSpec,
      deltas: data.deltas,
      worldState: data.worldState,
      isUserFork: false,
    });
    items.push({ contentKey: `main-${i}`, node, label: data.eventSpec.title });

    if (!isTest) {
      const branches = allBranches[i] || [];
      for (let b = 0; b < branches.length; b++) {
        const branch = branches[b];
        const forkNode = new EventNode({
          id: `pregen-fork-${i}-${b}`,
          parentId: data.id,
          branchId: `pregen-branch-${i}-${b}`,
          timestamp: data.timestamp,
          eventSpec: branch.forkEventSpec,
          worldState: data.worldState,
          isUserFork: true,
          forkDescription: branch.forkDescription,
        });
        // Attach sceneBible for richer image prompts
        forkNode._sceneBible = branch.renderPack?.sceneBible || "";
        items.push({ contentKey: `branch-${i}-${b}`, node: forkNode, label: branch.forkEventSpec.title });

        for (let c = 0; c < (branch.continuations || []).length; c++) {
          const cont = branch.continuations[c];
          const contNode = new EventNode({
            id: `pregen-cont-${i}-${b}-${c}`,
            parentId: forkNode.id,
            branchId: `pregen-branch-${i}-${b}`,
            timestamp: cont.timestamp,
            eventSpec: cont.eventSpec,
            worldState: data.worldState,
            isUserFork: false,
          });
          items.push({ contentKey: `branch-${i}-${b}-cont-${c}`, node: contNode, label: cont.eventSpec.title });
        }
      }
    }
  }

  return items;
}

// ─── Dry run ────────────────────────────────────────────────────────────────

function dryRun(items) {
  console.log(`\n=== DRY RUN: Showing prompts for ${Math.min(3, items.length)} items ===\n`);

  const samples = [
    items[0],                                              // mainline
    items.find((i) => i.contentKey.startsWith("branch-") && !i.contentKey.includes("cont")), // branch
    items.find((i) => i.contentKey.includes("cont")),      // continuation
  ].filter(Boolean);

  for (const { contentKey, node, label } of samples) {
    console.log("━".repeat(80));
    console.log(`${contentKey}: ${label}`);
    console.log("━".repeat(80));

    console.log("\n── NARRATION REQUEST ──");
    console.log(`Model: claude-sonnet-4-5-20250929 | Max tokens: 300`);
    console.log(`\nSystem prompt:\n${NARRATION_SYSTEM}`);
    console.log(`\nUser prompt:\n${buildNarrationPrompt(node)}`);

    console.log("\n── IMAGE PROMPT REQUEST ──");
    console.log(`Model: claude-haiku-4-5-20251001 | Max tokens: 300`);
    console.log(`\nSystem prompt:\n${IMAGE_PROMPT_SYSTEM}`);
    console.log(`\nUser prompt:\n${buildImagePromptPrompt(node)}`);

    console.log("\n── TTS REQUEST ──");
    console.log(`ElevenLabs API: POST /v1/text-to-speech/{voiceId}`);
    console.log(`Model: eleven_multilingual_v2`);
    console.log(`Voice settings: { stability: 0.6, similarity_boost: 0.75, style: 0.3 }`);
    console.log(`Input: [narration text from Claude above]`);

    console.log("\n── IMAGE GENERATION REQUEST ──");
    console.log(`fal.ai: fal-ai/flux-pro/v1.1`);
    console.log(`Input: { prompt: [image prompt from Claude above], width: 1344, height: 768, num_images: 1 }`);
    console.log("");
  }

  console.log(`\nTotal items that would be generated: ${items.length}`);
  console.log(`Estimated Claude API calls: ${items.length * 2} (${items.length} narration + ${items.length} image prompts)`);
  console.log(`Estimated cost: ~$${(items.length * 2 * 0.003).toFixed(2)} (narration) + ~$${(items.length * 0.001).toFixed(2)} (image prompts)`);
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n=== Pre-generation Script ${isTest ? "(TEST MODE)" : ""} ${isDryRun ? "(DRY RUN)" : ""} ===\n`);

  if (ANTHROPIC_API_KEY) {
    console.log("[Claude] Using Anthropic API for narration + image prompts");
  } else {
    console.log("[Claude] No ANTHROPIC_API_KEY — using template fallback");
  }

  const items = buildContentList();
  console.log(`Total items to generate: ${items.length}\n`);

  if (isDryRun) {
    dryRun(items);
    return;
  }

  // Load existing output for resume support
  let output = {};
  if (existsSync(OUTPUT_PATH)) {
    try {
      output = JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"));
      console.log(`Resuming: ${Object.keys(output).length} entries already generated\n`);
    } catch {
      output = {};
    }
  }

  let generated = 0;
  let skipped = 0;

  for (let idx = 0; idx < items.length; idx++) {
    const { contentKey, node, label } = items[idx];

    if (output[contentKey]) {
      skipped++;
      console.log(`[${idx + 1}/${items.length}] SKIP ${contentKey}: ${label}`);
      continue;
    }

    console.log(`[${idx + 1}/${items.length}] Generating ${contentKey}: ${label}`);

    try {
      const narrationText = await generateNarration(node);
      console.log(`  narration: ${narrationText?.length ?? 0} chars`);

      const audioUrl = await generateTTS(narrationText);
      console.log(`  audio: ${audioUrl ? `${Math.round(audioUrl.length / 1024)}KB` : "skipped"}`);

      const anchorImageUrl = await generateImage(node);
      console.log(`  image: ${anchorImageUrl ? "generated" : "skipped"}`);

      output[contentKey] = { narrationText, audioUrl, anchorImageUrl };
      generated++;

      // Save after each item for crash resilience
      writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      // Continue to next item
    }
  }

  console.log(`\n=== Done: ${generated} generated, ${skipped} skipped ===`);
  console.log(`Output: ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
