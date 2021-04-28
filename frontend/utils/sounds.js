import axios from "axios";
var prevSpeak = null;
var prevSlow = true;

export async function speak(ref, text, language, slow) {
  console.log("slow", slow);
  const res = await axios.get("/api/speak", {
    params: {
      text: text,
      language: language,
      speed: slow ? 0.5 : 1,
    },
  });
  const audioData = res.data.audio;
  const audioArr = new Uint8Array(audioData.audioContent.data);
  const blob = new Blob([audioArr], {
    type: "audio/ogg",
  });
  ref.current.src = URL.createObjectURL(blob);

  ref.current.play();
}
