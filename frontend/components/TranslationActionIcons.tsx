import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { copyToClipboard } from "../utils/text";
import { speak } from "../utils/sounds";
import { Transcription } from "./VideoPlayer";

export const TranslationActionIcons = ({
  voiceRef,
  translationText,
}: {
  voiceRef: React.MutableRefObject<any>;
  translationText: Transcription;
}) => (
  <div style={{ paddingLeft: 10, paddingTop: 10 }}>
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
  </div>
);
