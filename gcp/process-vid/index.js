// Listens for new videos and starts transcode and annotate job

"use strict";
// Imports the Google Cloud Video Intelligence library
const Video = require("@google-cloud/video-intelligence");
const { TranscoderServiceClient } = require("@google-cloud/video-transcoder");

async function transcodeVid(bucket, filename) {
  // Instantiates a client
  const transcoderServiceClient = new TranscoderServiceClient();
  const projectId = "video-world-308113";
  const location = "us-central1";
  const inputUri = `gs://${bucket}/${filename}`;
  const folderName = filename.replace(/\.[^/.]+$/, "");
  const outputUri = `gs://video-world-transcode/${folderName}/`;
  const preset = "preset/web-hd";

  // Construct request
  const request = {
    parent: transcoderServiceClient.locationPath(projectId, location),
    job: {
      inputUri: inputUri,
      outputUri: outputUri,
      templateId: preset,
    },
  };

  // Run request
  const [response] = await transcoderServiceClient.createJob(request);
  console.log(`Job: ${response.name}`);
}

async function annotateVid(bucket, filename) {
  const video = new Video.VideoIntelligenceServiceClient();

  const videoUri = `gs://${bucket}/${filename}`;

  const destName = filename.replace(/\.[^/.]+$/, "") + ".json";
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

  // TODO: Get rid of this, move to another cloud function that listens for annotate and transcode finish
  await Promise.all([annotateVid(bucket, name), transcodeVid(bucket, name)]);
};
