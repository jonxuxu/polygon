const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { SpeechClient } = require("@google-cloud/speech").v1p1beta1;

const speechClient = new SpeechClient({
  credentials: {
    private_key: process.env.GCP_PRIVATE_KEY,
    client_email: process.env.GCP_CLIENT_EMAIL,
  },
});

const request = {
  config: {
    languageCode: "zh",
    alternativeLanguageCodes: ["zh", "en-US"],
    enableWordTimeOffsets: true,
    enableAutomaticPunctuation: true,
    model: "default",
    audioChannelCount: 0,
  },
  audio: {
    uri: "gs://video-world-audio/ckokxczrz000009kua3j1eu0l",
  },
  outputConfig: {
    gcsUri: "gs://video-world-transcription-raw/ckokxczrz000009kua3j1eu0l",
  },
};

async function quickstart() {
  const [operation] = await speechClient.longRunningRecognize(request);
  operation.on("progress", (metadata, apiResponse) => {
    console.log("> New progress:");
    console.log(metadata);
    if (apiResponse.done && !apiResponse.response) {
      operation.emit("error");
    }
  });
  operation.on("error", (err) => {
    console.log("error");
    console.log(err);
  });
  const [response] = await operation.promise();
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  console.log(`Transcription: ${transcription}`);
}
quickstart();
