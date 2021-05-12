import React, { useEffect, useRef } from "react";
import tinycolor from "tinycolor2";
import { TranslationActionIcons } from "./TranslationActionIcons";
import styled from "styled-components";

import { Transcription } from "../utils/types";

export function SnippetPreview({
  snippets,
  videoRef,
}: {
  snippets: Transcription[];
  videoRef?: React.MutableRefObject<any>;
}) {
  return (
    <div
      style={{
        overflowY: "scroll",
        backgroundColor: "#F9F9F9",
        width: 400,
        position: "relative",
        marginBottom: 30,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
      }}
      className="mt-10 pt-5"
    >
      <div
        style={{
          position: "absolute",
          borderLeft: "3px solid #EE3699",
          height: "100%",
          top: 0,
          left: 35,
        }}
      />
      <div style={{ zIndex: 1, position: "absolute" }}>
        <h2 style={{ paddingLeft: 70 }}>Your Snippets</h2>
        {snippets.length === 0 && (
          <div style={{ paddingLeft: 70 }}>
            You have no snippets. Click on any bubbles to add to your
            collection.
          </div>
        )}

        {snippets.map((t, i) => {
          const isFirst = i === 0 || snippets[i - 1].time !== snippets[i].time;
          return (
            <Snippet t={t} isFirst={isFirst} key={i} videoRef={videoRef} />
          );
        })}
      </div>
    </div>
  );
}

const Snippet = ({ t, isFirst, videoRef }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (t.image) {
      const canvasCtx = canvasRef.current.getContext("2d");
      // console.log(t.image);
      // console.log(t.image.width);
      // canvasCtx.drawImage(
      //   t.image,
      //   0,
      //   0,
      //   t.image.width,
      //   t.image.height,
      //   0,
      //   0,
      //   canvasCtx.width,
      //   canvasCtx.height
      // );
      canvasCtx.putImageData(t.image, 0, 0);
    }
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <div>
        <TimeBubble
          isFirst={isFirst}
          onClick={() => {
            if (videoRef) {
              videoRef.current.currentTime = t.time;
            }
          }}
        >
          {new Date(t.time * 1000).toISOString().substr(11, 8)}
        </TimeBubble>
      </div>
      <div
        className="border-2 rounded-md py-3 px-4 my-2 flex justify-between"
        style={{
          borderColor: t.color,
          flexGrow: 1,
          backgroundColor: "white",
        }}
      >
        <div className="flex">
          {t.image && <canvas ref={canvasRef} width={80} height={80} />}
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
        </div>
        <TranslationActionIcons translationText={t} time={t.time} />
      </div>
    </div>
  );
};

const TimeBubble = styled.div`
  border: 1px solid #ee3699;
  background-color: white;
  width: 50px;
  border-radius: 10px;
  font-size: 10px;
  text-align: center;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 8px;
  visibility: ${(props) => (props.isFirst ? "initial" : "hidden")};
  cursor: pointer;
  transition-duration: 0.25s;
  &:hover {
    background-color: #ee3699;
    color: white;
  }
`;
