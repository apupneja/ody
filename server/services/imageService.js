import * as agentService from "./agentService.js";

let fal = null;

if (process.env.FAL_KEY) {
  try {
    const falModule = await import("@fal-ai/client");
    fal = falModule.fal;
    fal.config({ credentials: process.env.FAL_KEY });
    console.log("[ImageService] fal.ai configured");
  } catch (err) {
    console.warn("[ImageService] Failed to load @fal-ai/client:", err.message);
  }
} else {
  console.log("[ImageService] No FAL_KEY, image generation disabled");
}

export async function generateImage(eventNode) {
  if (!fal) return null;

  try {
    const imagePrompt = await agentService.generateImagePrompt(eventNode);

    const result = await fal.subscribe("fal-ai/nano-banana-pro", {
      input: {
        prompt: imagePrompt,
        aspect_ratio: "16:9",
        output_format: "jpeg",
        num_images: 1,
      },
    });

    const imageUrl = result?.data?.images?.[0]?.url ?? null;
    if (imageUrl) {
      console.log("[ImageService] Image generated for node:", eventNode.id);
    }
    return imageUrl;
  } catch (err) {
    console.error("[ImageService] Image generation failed:", err.message);
    return null;
  }
}
