const os = require("os");
const fs = require("fs");

const { Storage } = require("@google-cloud/storage");
const { Pool } = require("pg");
const connectionString = process.env.POSTGRES_URL;
const pool = new Pool({ connectionString });

const setTranscribeSuccess = async (cuid) => {
  const res = await pool.query(
    "UPDATE videos SET transcription_url = $1, transcribe_state = 'success' WHERE cuid = $2",
    [`https://storage.googleapis.com/video-world-transcription/${cuid}`, cuid]
  );
};

exports.parseTranscribe = async (event) => {
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
      const transcriptions = JSON.parse(buffer).results;
      const timedTranscriptions = {};

      //   Parse raw annotation
      if (transcriptions) {
        transcriptions.forEach((result) => {
          if (result.alternatives[0].transcript) {
            result.alternatives[0].words.forEach((word) => {
              var second =
                word.start_offset.seconds - (word.start_offset.seconds % 3);
              if (isNaN(second)) {
                second = 0;
              }
              if (timedTranscriptions[second]) {
                timedTranscriptions[second] = timedTranscriptions[
                  second
                ].concat(word.word);
              } else {
                timedTranscriptions[second] = word.word;
              }
            });
          }
        });
      }

      // Upload processed annotation to bucket
      console.log("Uploading to bucket...");
      let data = JSON.stringify(timedTranscriptions);

      fs.writeFileSync(os.tmpdir() + "/transcriptionTemp.json", data);
      await storage
        .bucket("video-world-transcription")
        .upload(os.tmpdir() + "/transcriptionTemp.json", {
          destination: name,
        });

      console.log("Updating db...");
      await setTranscribeSuccess(name);

      console.log(
        "Deleting old files from video-world-transcription-raw bucket..."
      );

      storage.bucket("video-world-transcription-raw").file(name).delete();
      storage.bucket("video-world-audio").file(name).delete();

      console.log("Done parsing transcriptions");
    });
};
