const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1";

if (ELEVENLABS_API_KEY) {
  console.log("[TTSService] ElevenLabs configured");
} else {
  console.log("[TTSService] No ELEVENLABS_API_KEY, TTS disabled");
}

export async function generateSpeech(text) {
  if (!ELEVENLABS_API_KEY) return null;
  if (!text || text.trim().length === 0) return null;

  try {
    const response = await fetch(
      `${ELEVENLABS_BASE_URL}/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.75,
            style: 0.3,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`ElevenLabs API error ${response.status}: ${errText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    console.log("[TTSService] Speech generated, size:", audioBuffer.byteLength);
    return audioUrl;
  } catch (err) {
    console.error("[TTSService] Speech generation failed:", err.message);
    return null;
  }
}
