import textToSpeech from "@google-cloud/text-to-speech";

const client = new textToSpeech.TextToSpeechClient();

async function listVoices() {
  const [result] = await client.listVoices();
  result.voices.forEach((v) => {
    console.log(
      `${v.name} | ${v.languageCodes.join(", ")} | ${v.ssmlGender}`
    );
  });
}

listVoices();
