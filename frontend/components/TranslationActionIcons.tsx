import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCopy, faPlus } from "@fortawesome/free-solid-svg-icons";

import { copyToClipboard } from "../utils/text";
import { speak } from "../utils/sounds";
import { Transcription } from "../utils/types";
import { fetcher } from "utils/fetcher";
import { useRouter } from "next/router";
import styled from "styled-components";

export const TranslationActionIcons = ({
  translationText,
  time,
  hide,
}: {
  translationText: Transcription;
  time: number;
  hide?: boolean;
}) => {
  const [added, setAdded] = React.useState(false);
  const voiceRef = useRef(null);
  const router = useRouter();
  return (
    <div
      style={{
        paddingLeft: 10,
        paddingTop: 3,
        color: "#454545",
        visibility: hide ? "hidden" : "visible",
      }}
    >
      <audio ref={voiceRef} />
      <ImageIcon
        src="/turtle.svg"
        alt="slow"
        style={{ marginBottom: 5 }}
        onClick={() => {
          speak(
            voiceRef,
            translationText.original,
            translationText.detectedSourceLanguage,
            true
          );
        }}
      />
      <ImageIcon
        src="/rabbit.svg"
        alt="fast"
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
        <InteractiveIcon
          icon={faCopy}
          onClick={() => {
            copyToClipboard(translationText.original);
          }}
        />
      </div>
      <div>
        {router.query.cuid && (
          <InteractiveIcon
            icon={added ? faCheck : faPlus}
            onClick={async () => {
              if (added) return;
              setAdded(true);
              await fetcher("/api/user/update", {
                snippets: {
                  create: {
                    time,
                    video: { connect: { cuid: router.query.cuid } },
                    original: translationText.original,
                    translation: translationText.translatedText,
                  },
                },
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

const ImageIcon = styled.img`
  width: 15px;
  height: 15px;
  cursor: pointer;

  &:hover {
    filter: invert(43%) sepia(93%) saturate(4644%) hue-rotate(307deg)
      brightness(97%) contrast(92%);
  }
`;

const InteractiveIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  margin-top: 10px;
  height: 12px;
  color: black;

  &:hover {
    color: #ee3699;
  }
`;
