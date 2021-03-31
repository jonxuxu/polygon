require("dotenv").config();
const speech = require("@google-cloud/speech");
const fs = require("fs");
// const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
// const ffmpeg = require("fluent-ffmpeg");
// ffmpeg.setFfmpegPath(ffmpegPath);

// Creates a client
const client = new speech.SpeechClient({
  credentials: {
    private_key: process.env.GCP_PRIVATE_KEY,
    client_email: "owner-107@video-world-308113.iam.gserviceaccount.com",
  },
});

/**
 *    input - string, path of input file
 *    output - string, path of output file
 *    callback - function, node-style callback fn (error, result)
 */
// function convert(input, output, callback) {
//   ffmpeg(input)
//     .output(output)
//     .on("end", function () {
//       console.log("conversion ended");
//       callback(null);
//     })
//     .on("error", function (err) {
//       console.log("error: ", err);
//       callback(err);
//     })
//     .run();
// }

// convert("./test-speech.mp4", "./output.wav", async function (err) {
//   if (!err) {
//     console.log("conversion complete");
//   } else {
//     console.log("ERROR ", err);
//   }
// });

// Parse and upload
async function parseBoi() {
  // config: {
  //     languageCode: "en-US",
  //     model: "video",
  //     enableWordTimeOffsets: true,
  //     audioChannelCount: 2,
  //     diarizationConfig: {
  //       enableSpeakerDiarization: true,
  //     },
  //   },
  const request = {
    config: {
      languageCode: "en-US",
      model: "video",
      enableWordTimeOffsets: true,
      audioChannelCount: 2,
    },
    audio: {
      uri: "gs://video-world-audio/output.wav",
    },
    outputConfig: {
      gcsUri: "gs://video-world-transcription/output.wav",
    },
  };

  // Detects speech in the audio file
  console.log("starting transcription job...");
  const [operation] = await client.longRunningRecognize(request);
  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();

  console.log("formatting json...");
  const annotations = {};
  response.results.forEach((result) => {
    if (result.alternatives[0].transcript) {
      const entry = {
        text: result.alternatives[0].transcript,
      };
      annotations[result.alternatives[0].words[0].startTime.seconds] = entry;
    }
  });

  //   const transcription = response.results
  //     .map((result) => result.alternatives[0].transcript)
  //     .join("\n");
  //   console.log(`Transcription: ${transcription}`);
  fs.writeFileSync("transcriptionsTemp.json", JSON.stringify(annotations));
}

parseBoi();
