import { NextResponse } from "next/server";
import textToSpeech from "@google-cloud/text-to-speech";

const client = new textToSpeech.TextToSpeechClient();

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

    return new NextResponse(response.audioContent as Buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "attachment; filename=speech.mp3",
      },
    });
  } catch (err) {
    console.error("TTS ERROR:", err);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
