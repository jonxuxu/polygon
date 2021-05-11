import React from "react";
import tinycolor from "tinycolor2";
import { videos } from ".prisma/client";
import { TranslationActionIcons } from "./TranslationActionIcons";
import { Transcription } from "./VideoPlayer";

export function SnippetPreview({
  i,
  snippets,
  t,
  voiceRef,

  videoRef,
}: {
  i: number;
  snippets: Transcription[];
  t: Transcription;
  voiceRef: React.MutableRefObject<any>;

  videoRef?: React.MutableRefObject<any>;
}): JSX.Element {
  return (
    <div style={{ display: "flex" }}>
      <div>
        <div
          style={{
            border: "1px solid #EE3699",
            width: 50,
            borderRadius: 10,
            fontSize: 10,
            textAlign: "center",
            marginLeft: 10,
            marginRight: 10,
            marginTop: 8,
            visibility:
              i === 0 || snippets[i - 1].time !== snippets[i].time
                ? "initial"
                : "hidden",
          }}
        >
          {new Date(t.time * 1000).toISOString().substr(11, 8)}
        </div>
      </div>
      <div
        key={i}
        className="border-2 rounded-md py-3 px-4 my-2 flex justify-between"
        style={{
          borderColor: t.color,
          flexGrow: 1,
          backgroundColor: "white",
        }}
      >
        <span style={{ fontFamily: "Arial" }}>
          <span
            style={{
              fontSize: 18,
              color: tinycolor(t.color).darken(20),
            }}
          >
            {t.original}
          </span>
          <br />
          <span style={{ fontSize: 12 }}>{t.translatedText}</span>
        </span>
        <TranslationActionIcons
          voiceRef={voiceRef}
          translationText={t}
          time={
            videoRef && videoRef.current
              ? videoRef.current.currentTime
              : undefined
          }
        />
      </div>
    </div>
  );
}
