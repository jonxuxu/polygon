// Listens for new videos and starts transcode and annotate job

"use strict";
const Video = require("@google-cloud/video-intelligence");
const axios = require("axios");

function transcodeVid(bucket, filename) {
  // Tells our transcode vm to transcode the videos on FFMPEG
  try {
    axios.post("http://23.22.196.188:8080", {
      api_key: process.env.TRANSCODE_API_KEY,
      cuid: filename,
    });
  } catch (error) {
    throw new Error(error);
  }
  console.log("sent transcode request succesfully");
}

async function annotateVid(bucket, filename) {
  const video = new Video.VideoIntelligenceServiceClient();

  const videoUri = `gs://${bucket}/${filename}`;

  const destName = filename.replace(/\.[^/.]+$/, "");
  const request = {
    inputUri: videoUri,
    features: ["TEXT_DETECTION"],
    outputUri: `gs://video-world-annotations-raw/${destName}`,
  };
  // Detects text in a video
  console.log("Annotating video...");
  video.annotateVideo(request);
  console.log("Sent annotation video job");
}

exports.processVid = async (event) => {
  const { bucket, name } = event;

  if (!bucket) {
    throw new Error(
      'Bucket not provided. Make sure you have a "bucket" property in your request'
    );
  }
  if (!name) {
    throw new Error(
      'Filename not provided. Make sure you have a "name" property in your request'
    );
  }

  await Promise.all([annotateVid(bucket, name), transcodeVid(bucket, name)]);
};
