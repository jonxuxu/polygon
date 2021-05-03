const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const Video = require("@google-cloud/video-intelligence");

const video = new Video.VideoIntelligenceServiceClient({
  credentials: {
    private_key: process.env.GCP_PRIVATE_KEY,
    client_email: process.env.GCP_CLIENT_EMAIL,
  },
});

const request = {
  inputUri: "gs://video-world-source/ckny3wl4d00007ou9c2gqd73g",
  features: ["TEXT_DETECTION"],
  outputUri: "gs://video-world-annotations-raw/ckny3wl4d00007ou9c2gqd73g",
};
// Detects text in a video
console.log("Annotating video...");
video.annotateVideo(request);
console.log("Sent annotation video job");
