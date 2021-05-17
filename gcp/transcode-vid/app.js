// Video transcode
// Transcodes a video with provided cuid, to hls encoding, and uploads it to video-world-encoded
// Transcodes a video with provided cuid, to wav, and uploads it to video-world-audio

"use strict";

// [START gae_node_request_example]
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const { Storage } = require("@google-cloud/storage");
const { SpeechClient } = require("@google-cloud/speech").v1p1beta1;

const { Pool } = require("pg");
const connectionString = process.env.POSTGRES_URL;
const pool = new Pool({ connectionString });

var fs = require("fs");
const fsPromises = fs.promises;

const languages = require("./languages.json");

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY,
  },
});

const speechClient = new SpeechClient({
  credentials: {
    private_key: process.env.GCP_PRIVATE_KEY,
    client_email: process.env.GCP_CLIENT_EMAIL,
  },
});

const audioBucket = storage.bucket("video-world-audio");
const transcodeBucket = storage.bucket("video-world-transcode");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const setTranscodeSuccess = async (cuid) => {
  const res = await pool.query(
    "UPDATE videos SET url = $1, transcode_state = 'success' WHERE cuid = $2",
    [
      `https://storage.googleapis.com/video-world-transcode/${cuid}/output.m3u8`,
      cuid,
    ]
  );
};

const setTranscodeState = async (cuid, state) => {
  const res = await pool.query(
    "UPDATE videos SET transcode_state = $2 WHERE cuid = $1",
    [cuid, state]
  );
};

const setTranscribeState = async (cuid, state) => {
  const res = await pool.query(
    "UPDATE videos SET transcribe_state = $2 WHERE cuid = $1",
    [cuid, state]
  );
};

const checkExists = async (cuid) => {
  const res = await pool.query("SELECT COUNT(*) FROM videos WHERE cuid = $1", [
    cuid,
  ]);
  return res.rows[0].count === "1";
};

const getRow = async (cuid) => {
  const res = await pool.query(
    `SELECT language, "useSubtitles" FROM videos WHERE cuid = $1`,
    [cuid]
  );
  return res.rows[0];
};

// Runs speech to text to get the captions of video
const transcribe = async (cuid, res) => {
  const videoRow = await getRow(cuid);
  const languageCode = languages[videoRow.language].listen;
  console.log("the language is " + languageCode);

  if (
    languageCode === null ||
    languageCode.length === 0 ||
    !videoRow.useSubtitles
  ) {
    await setTranscribeState(cuid, "not computed");
    return res.status(200).send(`successfully processed and uploaded ${cuid}`);
  }

  console.log("Converting to wav...");
  setTranscribeState(cuid, "processing");
  ffmpeg(`https://storage.googleapis.com/video-world-source/${cuid}`)
    .outputOptions(["-ac 1", "-ar 16000", "-map_metadata 0"])
    .output("./audio.wav")
    .on("end", function () {
      console.log("conversion to wav done");
      const uploadOptions = {
        destination: cuid,
      };
      audioBucket.upload("./audio.wav", uploadOptions, async function (err, f) {
        if (err) {
          setTranscribeState(cuid, "failed");
          return res.status(500).json({ "upload error": err });
        }
        console.log("uploaded " + f.name);
        await fsPromises.unlink("./audio.wav");
        // Annotate video
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
        // Detects text in a video
        const [operation] = await speechClient.longRunningRecognize(request);
        console.log("transcription request sent: " + operation.name);
        return res
          .status(200)
          .send(`successfully processed and uploaded ${cuid}`);
      });
    })
    .on("error", function (err) {
      setTranscribeState(cuid, "failed");
      return res.status(500).json({ "transcribe error": err.message });
    })
    .run();
};

// Runs
const transcode = async (cuid, res) => {
  if (!fs.existsSync("./converted")) {
    fs.mkdirSync("./converted");
  }

  ffmpeg(`https://storage.googleapis.com/video-world-source/${cuid}`)
    .outputOptions([
      "-c copy",
      "-start_number 0",
      "-hls_time 10",
      "-hls_list_size 0",
      "-f hls",
    ])
    .output("./converted/output.m3u8")
    .on("error", function (err) {
      console.log("An error occurred: " + err.message);
      setTranscodeState(cuid, "failed");
      return res.status(500).send(`Transcode error: ${err.message}`);
    })
    // .on("stderr", function (stderrLine) {
    //   console.log("Stderr output: " + stderrLine);
    // })
    .on("progress", function (progress) {
      console.log("... frames: " + progress.frames);
    })
    .on("end", async function () {
      console.log("Finished processing");
      // uploading converted files to bucket

      const files = await fsPromises.readdir("./converted");

      if (Array.isArray(files) && files.length) {
        var counter = 0;

        files.map(function (file, index) {
          const uploadOptions = {
            destination: cuid + "/" + file,
            resumable: false,
            gzip: false,
          };

          // iterate through files in folder
          transcodeBucket.upload(
            "./converted/" + file,
            uploadOptions,
            async function (err, f) {
              if (err) {
                setTranscodeState(cuid, "failed");
                return res.status(500).json({ "upload error": err });
              }
              console.log("uploaded " + file);
              counter += 1;
              if (counter === files.length) {
                console.log("file upload complete");
                await setTranscodeSuccess(cuid);
                await fsPromises.rmdir("./converted", { recursive: true });
                // Run text to speech
                transcribe(cuid, res);
              }
            }
          );
        });
      }
    })
    .run();
};

app.get("/", (req, res) => {
  return res.status(200).send("Hello, world!");
});

app.post("/", async (req, res) => {
  if (!req.body) {
    return res.status(401).json({ error: "no body" });
  }
  // console.log(req.body.api_key);
  // console.log(process.env.TRANSCODE_API_KEY);
  if (req.body.api_key !== process.env.TRANSCODE_API_KEY) {
    return res
      .status(401)
      .json({ "auth error": "incorrect TRANSCODE_API_KEY" });
  }
  const cuid = req.body.cuid;

  try {
    const cuidExists = await checkExists(cuid);

    if (!cuidExists) {
      return res.status(401).json({ "cuid error": "cuid does not exist" });
    }
    await setTranscodeState(cuid, "processing");
    transcode(cuid, res);
  } catch (err) {
    console.error("error: ", err);
    await setTranscodeState(cuid, "failed");
    return res.status(500).json({ error: err });
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
// [END gae_node_request_example]

module.exports = app;
