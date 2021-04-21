// Video transcode

"use strict";

// [START gae_node_request_example]
const express = require("express");
const bodyParser = require("body-parser");
// UNCOMMENT FOR LOCAL DEV
// const path = require("path");
// require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const { Storage } = require("@google-cloud/storage");
const { Pool } = require("pg");
const connectionString = process.env.POSTGRES_URL;
const pool = new Pool({ connectionString });

var fs = require("fs");

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY,
  },
});

const audioBucket = storage.bucket("video-world-audio");
const transcodeBucket = storage.bucket("video-world-transcode");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const setSuccess = async (cuid) => {
  const res = await pool.query(
    "UPDATE videos SET url = $1, transcode_state = 'success' WHERE cuid = $2",
    [
      `https://storage.googleapis.com/video-world-transcode/${cuid}/output.m3u8`,
      cuid,
    ]
  );
};

const setProcessing = async (cuid) => {
  const res = await pool.query(
    "UPDATE videos SET transcode_state = 'processing' WHERE cuid = $1",
    [cuid]
  );
  console.log(res);
};

const setFailed = async (cuid) => {
  const res = await pool.query(
    "UPDATE videos SET transcode_state = 'failed' WHERE cuid = $1",
    [cuid]
  );
  console.log(res);
};

const checkExists = async (cuid) => {
  const res = await pool.query("SELECT COUNT(*) FROM videos WHERE cuid = $1", [
    cuid,
  ]);
  return res.rows[0].count === "1";
};

app.get("/", (req, res) => {
  res.status(200).send("Hello, world!").end();
});

app.post("/", async (req, res) => {
  if (!req.body) {
    return res.status(401).json({ error: "no body" });
  }
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

    await setProcessing(cuid);

    const command = ffmpeg(
      `https://storage.googleapis.com/video-world-source/${cuid}`
    )
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
        setFailed(cuid);
        return res.status(500).send("An error occurred: " + err.message);
      })
      // .on("stderr", function (stderrLine) {
      //   console.log("Stderr output: " + stderrLine);
      // })
      .on("progress", function (progress) {
        console.log("... frames: " + progress.frames);
      })
      .on("end", function () {
        console.log("Finished processing");
        // uploading converted files to bucket

        fs.readdir("./converted", function (err, files) {
          if (err) {
            console.error("Could not list the directory.", err);
            setFailed(cuid);
            return res.status(500).json({ "directory error": err });
          }
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
                    setFailed(cuid);
                    return res.status(500).json({ "upload error": err });
                  }
                  console.log("uploaded " + file);
                  counter += 1;
                  if (counter === files.length) {
                    console.log("file upload complete");
                    await setSuccess(cuid);
                    return res
                      .status(200)
                      .send("successfully processed " + cuid);
                  }
                }
              );
            });
          }
        });
      })
      .run();
  } catch (err) {
    console.error("error: ", err);
    await setFailed(cuid);
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
