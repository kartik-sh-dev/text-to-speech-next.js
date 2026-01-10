import { NextResponse } from "next/server";
import textToSpeech from "@google-cloud/text-to-speech";

// Initialize client with credentials
const getClient = () => {
  if (process.env.GOOGLE_CLOUD_CREDENTIALS) {
    // Production/Vercel: use credentials from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
    return new textToSpeech.TextToSpeechClient({
      credentials,
    });
  }
  
  // Local: use credentials from file (default behavior)
  return new textToSpeech.TextToSpeechClient();
};

const client = getClient();

export async function POST(req: Request) {
  try {
    const {
      text,
      language = "en-US",
      voice = "en-US-Neural2-D",
      speed = 1,
      pitch = 0,
    } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: language,
        name: voice,
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: Number(speed),
        pitch: Number(pitch),
      },
    });

    if (!response.audioContent) {
      return NextResponse.json({ error: "No audio generated" }, { status: 500 });
    }

    const audioArray = new Uint8Array(
      response.audioContent as ArrayBuffer | Buffer
    );

    return new NextResponse(audioArray as BodyInit, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline; filename=speech.mp3",
      },
    });
  } catch (err) {
    console.error("TTS ERROR:", err);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}