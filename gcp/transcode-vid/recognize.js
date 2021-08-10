const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { SpeechClient } = require("@google-cloud/speech").v1p1beta1;
const languages = require("./languages.json");

const speechClient = new SpeechClient({
  credentials: {
    private_key: process.env.GCP_PRIVATE_KEY,
    client_email: process.env.GCP_CLIENT_EMAIL,
  },
});

const cuid = "ckny3wl4d00007ou9c2gqd73g"
const languageCode = languages["Chinese Simplified"].listen;

const request = {
  config: {
    languageCode: languageCode,
    alternativeLanguageCodes: [languageCode, "en-US"],
    enableWordTimeOffsets: true,
    enableAutomaticPunctuation: true,
    model: "default",
    audioChannelCount: 0,
    sampleRateHertz: 16000,
  },
  audio: {
    uri: `gs://video-world-audio/${cuid}`,
  },
  outputConfig: {
    gcsUri: `gs://video-world-transcription-raw/${cuid}`,
  },
};

async function quickstart() {
  const [operation] = await speechClient.longRunningRecognize(request);
  console.log(operation);
  // operation.on("progress", (metadata, apiResponse) => {
  //   console.log("> New progress:");
  //   console.log(metadata);
  //   if (apiResponse.done && !apiResponse.response) {
  //     operation.emit("error");
  //   }
  // });
  // operation.on("error", (err) => {
  //   console.log("error");
  //   console.log(err);
  // });
  const [response] = await operation.promise();
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  console.log(`Transcription: ${transcription}`);
}
quickstart();
