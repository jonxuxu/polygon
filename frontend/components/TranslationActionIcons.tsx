import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCopy, faPlus } from "@fortawesome/free-solid-svg-icons";
import { videos } from ".prisma/client";

import { copyToClipboard } from "../utils/text";
import { speak } from "../utils/sounds";
import { Transcription } from "./VideoPlayer";
import { fetcher } from "utils/fetcher";

export const TranslationActionIcons = ({
  translationText,
  video,
  time,
}: {
  translationText: Transcription;
  video: videos;
  time: number;
}) => {
  const [added, setAdded] = React.useState(false);
  const voiceRef = useRef(null);

  return (
    <div style={{ paddingLeft: 10, paddingTop: 3, color: "#454545" }}>
      <audio ref={voiceRef} />
      <img
        src="/turtle.svg"
        alt="slow"
        style={{
          width: 20,
          height: 20,
          cursor: "pointer",
          marginBottom: 5,
        }}
        onClick={() => {
          speak(
            voiceRef,
            translationText.original,
            translationText.detectedSourceLanguage,
            true
          );
        }}
      />
      <img
        src="/rabbit.svg"
        alt="fast"
        style={{ width: 20, height: 20, cursor: "pointer" }}
        onClick={() => {
          speak(
            voiceRef,
            translationText.original,
            translationText.detectedSourceLanguage,
            false
          );
        }}
      />
      <div>
        <FontAwesomeIcon
          icon={faCopy}
          style={{ cursor: "pointer", marginTop: 10, height: "15px" }}
          onClick={() => {
            copyToClipboard(translationText.original);
          }}
        />
      </div>
      <div>
        <FontAwesomeIcon
          icon={added ? faCheck : faPlus}
          style={{ cursor: "pointer", marginTop: 10, height: "15px" }}
          onClick={async () => {
            if (added) return;
            setAdded(true);
            await fetcher("/api/user/update", {
              snippets: {
                create: {
                  time,
                  video_id: video.id,
                  original: translationText.original,
                  translation: translationText.translatedText,
                },
              },
            });
          }}
        />
      </div>
    </div>
  );
};
