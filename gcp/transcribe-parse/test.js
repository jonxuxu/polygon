const transcriptions = require("./example.json");
const fs = require("fs");

const timedTranscriptions = {};

if (transcriptions) {
  transcriptions.results.forEach((result) => {
    if (result.alternatives[0].transcript) {
      result.alternatives[0].words.forEach((word) => {
        var second = word.start_offset.seconds ?? 0;
        var secondChunk = second - (second % 3);
        second += (word.start_offset.nanos ?? 0) / 1000000000;

        if (timedTranscriptions[secondChunk]) {
          timedTranscriptions[secondChunk][second] = word.word;
        } else {
          // const newWords = new Map();
          // newWords.set(second, word.word);
          const newWords = {};
          newWords[second] = word.word;
          timedTranscriptions[secondChunk] = newWords;
        }
      });
    }
  });
}

// console.log(timedTranscriptions);

const mapToObj = (m) => {
  return Array.from(m).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});
};

// for (const [key, value] of Object.entries(timedTranscriptions)) {
//   timedTranscriptions[key] = mapToObj(value);
// }

fs.writeFile("./out.json", JSON.stringify(timedTranscriptions), () => {});
