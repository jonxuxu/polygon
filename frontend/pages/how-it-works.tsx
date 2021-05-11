import Topbar from "../components/Topbar";
import Image from "next/image";
import { useRef } from "react";
import { SnippetPreview } from "components/SnippetPreview";
import { Transcription } from "components/VideoPlayer";

const Page = () => {
  const voiceRef = useRef(null);

  const snippet: Transcription = {
    original: "芋圓現做品質看得到",
    color: "red",
    translatedText: "You can see the quality of taro balls freshly made",
    time: 18,
    detectedSourceLanguage: "zh",
  };

  return (
    <div>
      <Topbar />
      <audio ref={voiceRef} />
      <div className="m-10 md:w-4/5">
        <div className="mb-8 text-2xl text-gray-700 ">How it Works</div>
        <div className="my-4">
          Polygon is an interactive video platform that lets you click on words
          to translate them. You can then hear the pronunciation out loud, copy
          the word, or save it to your personal collection of snippets.
        </div>
        <div className="my-4">
          When viewing a video with foreign words or phrases, pause the video
          and hover over the words to reveal the clickable indicators.
        </div>
        <Image src={`/jiufen-screenshot.png`} width={1000} height={700} />
        Use the icons on the right of the snippet overlay to interact with it.
        <SnippetPreview
          i={0}
          snippets={[snippet]}
          t={snippet}
          voiceRef={voiceRef}
        />
        <div className="my-4">Built by Jonathan Xu and Kunal Shah</div>
      </div>
    </div>
  );
};

export default Page;
