import React, { useEffect, useRef } from "react";
import tinycolor from "tinycolor2";
import { TranslationActionIcons } from "./TranslationActionIcons";

export function SnippetPreview({ snippets, videoRow }) {
  return (
    <div
      style={{
        overflowY: "scroll",
        backgroundColor: "#F9F9F9",
        width: 400,
      }}
      className="mt-10 pt-5"
    >
      <h2 style={{ paddingLeft: 70 }}>Your Snippets</h2>
      {snippets.length === 0 && <div>You have no snippets</div>}

      {snippets.map((t, i) => {
        const isFirst = i === 0 || snippets[i - 1].time !== snippets[i].time;
        return <Snippet t={t} isFirst={isFirst} key={i} videoRow={videoRow} />;
      })}
    </div>
  );
}

const Snippet = ({ t, isFirst, videoRow }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
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
  }, []);

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
            visibility: isFirst ? "initial" : "hidden",
          }}
        >
          {new Date(t.time * 1000).toISOString().substr(11, 8)}
        </div>
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
          <canvas
            ref={canvasRef}
            width={80}
            height={80}
            style={{ borderRadius: 10 }}
          />
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
        <TranslationActionIcons
          translationText={t}
          video={videoRow}
          time={t.time}
        />
      </div>
    </div>
  );
};
