// Video transcode

"use strict";

// [START gae_node_request_example]
const express = require("express");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Hello, world!").end();
});

app.post("/", (req, res) => {
  try {
    const command = ffmpeg(
      "https://storage.googleapis.com/video-world-source/test-walk.mp4"
    )
      .outputOptions([
        "-c copy",
        "-start_number 0",
        "-hls_time 10",
        "-hls_list_size 0",
        "-f hls",
      ])
      .output("./converted/outputfile.m3u8")
      .on("error", function (err) {
        console.log("An error occurred: " + err.message);
      })
      .on("stderr", function (stderrLine) {
        console.log("Stderr output: " + stderrLine);
      })
      .on("progress", function (progress) {
        console.log("... frames: " + progress.frames);
      })
      .on("end", function () {
        console.log("Finished processing");
      })
      .run();
  } catch (e) {
    console.log(e);
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
