// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import axios from "axios";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import tinycolor from "tinycolor2";

import { copyToClipboard } from "../utils/text";
import { speak } from "../utils/sounds";

import { fetcher } from "utils/fetcher";
import { videos } from ".prisma/client";

// Content variables
var annotations = [];
var transcriptions = [];

// Video player variables
var controlTimeout = null;

export default function VideoPlayer({
  videoRow,
  targetLang,
}: {
  videoRow: videos;
  targetLang: string;
}) {
  const videoRef = useRef(null);
  const voiceRef = useRef(null);
  const translationRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const [translationBox, setTranslationBox] = useState(false);
  const [translationPos, setTranslationPos] = useState([0, 0]);
  const [translationText, setTranslationText] = useState({
    translatedText: null,
    original: null,
    detectedSourceLanguage: null,
  });
  const [transColor, setTransColor] = useState("#000000");
  const [snippets, setSnippets] = useState<
    { original: string; translation: string }[]
  >([]);

  useEffect(() => {
    // increment views
    fetcher("/api/video/view", { cuid: videoRow.cuid });

    document.fonts.load('900 48px "Font Awesome 5 Free"');

    // Fetch Video URL
    // const hlsUrl =
    //   "https://storage.googleapis.com/video-world-source/test-speech.mp4";
    // const hlsUrl = `https://dq86krv8mpwpa.cloudfront.net/f5cc4e0a-292e-4e5d-b838-2911cc154f18/hls/Laptop Repair.m3u8`;
    // const hlsUrl = `https://storage.googleapis.com/video-world-transcode/test-speech/manifest.m3u8`;
    if (!videoRow || !videoRow.url) return;
    const hlsUrl = videoRow ? videoRow.url : null;
    const video = videoRef.current;
    // video.src = hlsUrl;
    if (video.canPlayType("application/vnd.apple.mpegURL")) {
      console.log("natively supported");
      // If HLS is natively supported, let the browser do the work!
      video.src = hlsUrl;
    } else if (Hls.isSupported()) {
      console.log("not natively supported");
      // If the browser supports MSE, use hls.js to play the video
      var hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
    } else {
      alert("Please use a modern browser to play the video");
    }

    // Connect video to progress bar
    // video.addEventListener("timeupdate", updateProgressBar, false);
    video.addEventListener(
      "play",
      () => {
        setPlaying(true);
      },
      false
    );
    video.addEventListener(
      "pause",
      () => {
        setPlaying(false);
      },
      false
    );

    // Fetch annotations
    const annotationUrl = videoRow ? videoRow.annotation_url : null;
    (async () => {
      if (annotationUrl) {
        const res = await axios.get(annotationUrl);
        annotations = res.data;
      }
    })();

    // Fetch transcriptions
    const transcriptionUrl = videoRow ? videoRow.transcription_url : null;
    (async () => {
      if (transcriptionUrl) {
        const res = await axios.get(transcriptionUrl);
        transcriptions = res.data;
      }
    })();
  }, []);

  useEffect(() => {
    if (playing) {
      console.log("playing");
      // videoRef.current.play();
      setTranslationBox(false);
    } else {
      console.log("pausing");
      // videoRef.current.pause();
    }
  }, [playing]);

  // Mouse move function
  function handleMouseMove() {
    setShowControls(true);
    if (controlTimeout) {
      clearTimeout(controlTimeout);
    }
    controlTimeout = setTimeout(function () {
      setShowControls(false);
    }, 1000);
  }

  const drawTranslation = async (word, zoom, endx, endy) => {
    const text = word.text;
    console.log("lang:", targetLang);

    const res: {
      data: {
        translation: { translatedText: string; detectedSourceLanguage: string };
      };
    } = await axios.get("/api/translate", {
      params: { text: text, target: targetLang },
    });
    console.log(
      "transation:",
      res.data.translation,
      res.data.translation.translatedText
    );

    setTranslationText({ ...res.data.translation, original: word.text });
    setSnippets([
      ...snippets,
      { original: word.text, translation: res.data.translation.translatedText },
    ]);

    setTranslationBox(true);

    const videoWidth = videoRef.current.offsetWidth;
    const videoHeight = videoRef.current.offsetHeight;

    const width = translationRef.current.offsetWidth;
    const isLeft = word.boundingBox[0].x > 1 - word.boundingBox[2].x;
    const translateStartX = (word.boundingBox[0].x * videoWidth - endx) * zoom;
    const translateEndX = (word.boundingBox[2].x * videoWidth - endx) * zoom;
    const translateStartY = (word.boundingBox[0].y * videoHeight - endy) * zoom;
    const rectX = isLeft ? translateStartX - width - 30 : translateEndX + 30;
    const rectY = translateStartY;

    setTranslationPos([rectX, rectY]);
  };

  const captionChars = [];
  // todo
  if ("0" in transcriptions) {
    for (var i = 0; i < transcriptions["0"].text.length; i++) {
      const word = transcriptions["0"].text.charAt(i);
      captionChars.push(
        <Caption
          key={i}
          onClick={() => {
            speak(voiceRef, word, "zh", true);
          }}
        >
          {word}
        </Caption>
      );
    }
  }

  return (
    <div className="flex" style={{ width: "100%" }}>
      <div style={{ flex: 1 }}>
        {/* Video controls */}
        <audio ref={voiceRef} />
        <div
          style={{
            position: "relative",
            width: "100%",
          }}
        >
          {showControls && !playing && (
            <ToolTips
              annotations={annotations}
              videoRef={videoRef}
              setTransColor={setTransColor}
              drawTranslation={drawTranslation}
            />
          )}
          <video ref={videoRef} controls={true} onMouseMove={handleMouseMove} />
          <InfoBox
            x={translationPos[0]}
            y={translationPos[1]}
            hide={!translationBox}
            borderColor={transColor}
            ref={translationRef}
          >
            <div style={{ display: "flex" }}>
              <div>
                <span
                  style={{
                    fontFamily: "Arial",
                    fontSize: 30,
                    color: tinycolor(transColor).darken(20),
                  }}
                >
                  {translationText.original}
                </span>
                <div
                  style={{ fontFamily: "Arial", fontSize: 14, marginTop: 10 }}
                >
                  {translationText.translatedText}
                </div>
              </div>
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
                    style={{ cursor: "pointer", marginTop: 10 }}
                    onClick={() => {
                      copyToClipboard(translationText.original);
                    }}
                  />
                </div>
              </div>
            </div>
          </InfoBox>

          <div
            style={{
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              bottom: 40,
              left: 0,
              width: "100%",
              zIndex: 4,
              pointerEvents: "none", // passthrough of hover and click
            }}
          >
            {captionChars}
          </div>
        </div>
      </div>
      {
        <div className="ml-5">
          {snippets.length > 0 && <h2>Your Snippets</h2>}
          {snippets.map(({ original, translation }, i) => (
            <div
              key={i}
              className="border-2 rounded-md py-3 px-4 my-2 border-primary-300"
            >
              <span className="text-xl text-gray-700">{original}</span> <br />{" "}
              {translation}{" "}
            </div>
          ))}
        </div>
      }
    </div>
  );
}

const ToolTips = ({
  annotations,
  videoRef,
  setTransColor,
  drawTranslation,
}) => {
  if (videoRef.current === undefined) {
    return <div></div>;
  }

  const millis = Math.floor(videoRef.current.currentTime * 10) * 100;

  var tooltips = [];

  if (annotations[millis] !== null && annotations[millis] !== undefined) {
    const videoWidth = videoRef.current.offsetWidth;
    const videoHeight = videoRef.current.offsetHeight;

    var canvas = document.createElement("canvas");
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    var canvasContext = canvas.getContext("2d");
    canvasContext.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

    tooltips = annotations[millis].map((word, i) => {
      const x = word.boundingBox[0].x * videoWidth;
      const y = word.boundingBox[0].y * videoHeight;
      const p = canvasContext.getImageData(x, y, 1, 1).data;
      const hex = tinycolor({ r: p[0], g: p[1], b: p[2] }).toHexString();
      return (
        <div
          key={i}
          style={{
            width: 20,
            height: 20,
            borderRadius: 20,
            border: "3px solid white",
            backgroundColor: hex,
            position: "absolute",
            top: y,
            left: x,
            cursor: "pointer",
            zIndex: 4,
          }}
          onClick={() => {
            setTransColor(hex);
            drawTranslation(word, 1, 0, 0);
          }}
        />
      );
    });
  }
  return <>{tooltips}</>;
};

const Caption = styled.span`
  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
  font-size: 30px;
  margin: 0px 1px;
  cursor: pointer;
  pointer-events: auto;
  &:hover {
    color: #ee3699;
  }
`;

const InfoBox = styled.div`
  position: absolute;
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
  display: ${(props) => (props.hide ? "none" : "inline-block")};
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  padding: 15px;
  border: 2px solid ${(props) => props.borderColor};
`;
