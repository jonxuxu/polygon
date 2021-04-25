// Listens for pushes to the intermediate annotation storage bucket, parses the file and stores the processed annotations in another bucket

"use strict";
const { Storage } = require("@google-cloud/storage");
const { Pool } = require("pg");
const connectionString = process.env.POSTGRES_URL;
const pool = new Pool({ connectionString });

const os = require("os");
const fs = require("fs");

const setAnnotateSucess = async (cuid) => {
  const res = await pool.query(
    "UPDATE videos SET annotation_url = $1, annotate_state = 'success' WHERE cuid = $2",
    [
      `https://storage.googleapis.com/video-world-annotations/${cuid}.json`,
      cuid,
    ]
  );
};

exports.parseAnnotate = async (event) => {
  const { bucket, name } = event;
  let buffer = "";

  console.log("file " + name + " uploaded to " + bucket);

  const storage = new Storage();
  const remoteFile = storage.bucket(bucket).file(name);

  remoteFile
    .createReadStream()
    .on("error", function (err) {
      console.log(err);
    })
    .on("data", function (data) {
      //   buffer += decoder.write(data);
      buffer += data;
    })
    .on("end", async function () {
      const textAnnotations = JSON.parse(buffer).annotation_results[0]
        .text_annotations;
      const timedAnnotations = {};

      //   Parse raw annotation
      textAnnotations.forEach((textAnnotation) => {
        const text = textAnnotation.text;
        // console.log(text);
        textAnnotation.segments.forEach((segment) => {
          segment.frames.forEach((frame) => {
            const seconds = frame.time_offset.seconds
              ? frame.time_offset.seconds * 1000
              : 0;
            const timeOffset =
              seconds + Math.floor(frame.time_offset.nanos / 100000000) * 100;
            const entry = {
              text: text,
              boundingBox: frame.rotated_bounding_box.vertices,
            };
            if (timeOffset in timedAnnotations) {
              timedAnnotations[timeOffset].push(entry);
            } else {
              timedAnnotations[timeOffset] = [entry];
            }
          });
        });
      });

      // Upload processed annotation to bucket
      console.log("Uploading to bucket...");
      let data = JSON.stringify(timedAnnotations);

      fs.writeFileSync(os.tmpdir() + "/annotationsTemp.json", data);
      await storage
        .bucket("video-world-annotations")
        .upload(os.tmpdir() + "/annotationsTemp.json", {
          destination: name + ".json",
        });

      console.log("Updating db...");
      await setAnnotateSucess(name);

      console.log("Deleting from video-world-annotations-raw bucket...");
      storage.bucket("video-world-annotations-raw").file(name).delete();

      console.log("Done parsing annotations");
    });
};
