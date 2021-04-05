import axios from "axios";
var prevSpeak = null;

export async function speak(ref, text, language) {
  if (prevSpeak === null || prevSpeak !== text) {
    const res = await axios.get("/api/speak", {
      params: {
        text: text,
        language: language,
      },
    });
    const audioData = res.data.audio;
    const audioArr = new Uint8Array(audioData.audioContent.data);
    const blob = new Blob([audioArr], {
      type: "audio/ogg",
    });
    ref.current.src = URL.createObjectURL(blob);
  }
  prevSpeak = text;
  ref.current.play();
}
