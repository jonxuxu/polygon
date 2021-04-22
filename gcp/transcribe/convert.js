const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

/**
 *    input - string, path of input file
 *    output - string, path of output file
 *    callback - function, node-style callback fn (error, result)
 */
function convert(input, output, callback) {
  ffmpeg(input)
    .output(output)
    .on("end", function () {
      console.log("conversion ended");
      callback(null);
    })
    .on("error", function (err) {
      console.log("error: ", err);
      callback(err);
    })
    .run();
}

convert("./test-speech.mp4", "./audio.wav", async function (err) {
  if (!err) {
    console.log("conversion complete");
  } else {
    console.log("ERROR ", err);
  }
});
