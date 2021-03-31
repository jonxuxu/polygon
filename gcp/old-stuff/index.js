"use strict";

require("dotenv").config();
// Imports the Google Cloud Video Intelligence library
const Video = require("@google-cloud/video-intelligence");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const { time } = require("console");

async function main() {
  // Creates a client
  const video = new Video.VideoIntelligenceServiceClient({
    credentials: {
      private_key: process.env.GCP_PRIVATE_KEY,
      client_email: "owner-107@video-world-308113.iam.gserviceaccount.com",
    },
  });
  const storage = new Storage({
    credentials: {
      private_key: process.env.GCP_PRIVATE_KEY,
      client_email: "owner-107@video-world-308113.iam.gserviceaccount.com",
    },
  });

  const videoUri = "gs://video-world-source/test-walk.mp4";
  const annotationUri = "gs://video-world-annotations/test-walk.json";

  const request = {
    inputUri: videoUri,
    features: ["TEXT_DETECTION"],
  };
  // Detects text in a video
  console.log("Annotating video...");
  const [operation] = await video.annotateVideo(request);
  const results = await operation.promise();
  console.log("Processing JSON...");

  // Gets annotations for video
  const textAnnotations = results[0].annotationResults[0].textAnnotations;
  const timedAnnotations = {};
  //   console.log(textAnnotations);
  textAnnotations.forEach((textAnnotation) => {
    const text = textAnnotation.text;
    textAnnotation.segments.forEach((segment) => {
      segment.frames.forEach((frame) => {
        const seconds = frame.timeOffset.seconds
          ? frame.timeOffset.seconds * 1000
          : 0;
        const timeOffset =
          seconds + Math.floor(frame.timeOffset.nanos / 100000000) * 100;
        const entry = {
          text: text,
          boundingBox: frame.rotatedBoundingBox.vertices,
        };
        if (timeOffset in timedAnnotations) {
          timedAnnotations[timeOffset].push(entry);
        } else {
          timedAnnotations[timeOffset] = [entry];
        }
      });
    });
  });

  console.log("Uploading to bucket...");
  let data = JSON.stringify(timedAnnotations);
  fs.writeFileSync("annotationsTemp.json", data);
  const filename = "test-walk.json";
  const res = await storage
    .bucket("video-world-annotations")
    .upload("./annotationsTemp.json", {
      destination: filename,
    });
  // `mediaLink` is the URL for the raw contents of the file.
  // const url = res[0].metadata.mediaLink;
  console.log("Done");
}

main().catch(console.error);
