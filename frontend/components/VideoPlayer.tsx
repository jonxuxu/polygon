import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import axios from "axios";
import styled from "styled-components";
import tinycolor from "tinycolor2";

import { speak } from "../utils/sounds";

import { fetcher } from "utils/fetcher";
import { videos } from ".prisma/client";
import { TranslationActionIcons } from "./TranslationActionIcons";

// Content variables
var annotations = [];
var transcriptions = [];

// Video player variables
var controlTimeout = null;

export interface Transcription {
  original: string;
  translatedText: string;
  detectedSourceLanguage?: string;
  color: string;
  time: number;
}

export default function VideoPlayer({
  videoRow,
  targetLang,
  snippets,
  setSnippets,
}: {
  videoRow: videos;
  targetLang: string;
}) {
  const videoRef = useRef(null);
  const voiceRef = useRef(null);
  const translationRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [holdTooltips, setHoldTooltips] = useState(false);

  const [translationBox, setTranslationBox] = useState(false);
  const [translationPos, setTranslationPos] = useState([0, 0]);
  const [translationText, setTranslationText] = useState<Transcription>({
    translatedText: null,
    original: null,
    detectedSourceLanguage: null,
    color: null,
    time: null,
  });

  useEffect(() => {
    // increment views
    fetcher("/api/video/view", { cuid: videoRow.cuid });

    // @ts-ignore
    document.fonts.load('900 48px "Font Awesome 5 Free"');

    if (!videoRow || !videoRow.url) return;
    const hlsUrl = videoRow ? videoRow.url : null;
    const video = videoRef.current;

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

  // Add to snippets if translation text has not been added
  useEffect(() => {
    if (translationText.original !== null) {
      if (snippets.indexOf(translationText) === -1) {
        const newSnippets = [...snippets, translationText];
        newSnippets.sort((a, b) => {
          if (a.time < b.time) {
            return -1;
          }
          if (a.time > b.time) {
            return 1;
          }
          return 0;
        });
        setSnippets(newSnippets);
      }
    }
  }, [translationText]);

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

  const drawTranslation = async (word, color) => {
    const text = word.text;

    const res: {
      data: {
        translation: { translatedText: string; detectedSourceLanguage: string };
      };
    } = await axios.get("/api/translate", {
      params: { text: text, target: targetLang },
    });
    // console.log(
    //   "transation:",
    //   res.data.translation,
    //   res.data.translation.translatedText
    // );

    console.log("poggies", videoRef.current.currentTime);

    setTranslationText({
      ...res.data.translation,
      original: word.text,
      color: color,
      time: videoRef.current.currentTime,
    });

    setTranslationBox(true);

    const videoWidth = videoRef.current.offsetWidth;
    const videoHeight = videoRef.current.offsetHeight;

    const width = translationRef.current.offsetWidth;
    const isLeft = word.boundingBox[0].x > 1 - word.boundingBox[2].x;
    const translateStartX = word.boundingBox[0].x * videoWidth;
    const translateEndX = word.boundingBox[2].x * videoWidth;
    const translateStartY = word.boundingBox[0].y * videoHeight;
    const rectX = isLeft ? translateStartX - width - 30 : translateEndX + 30;
    const rectY = translateStartY;

    setTranslationPos([rectX, rectY]);
  };

  const captionChars = [];
  // todo
  if ("0" in transcriptions) {
    // @ts-ignore
    for (var i = 0; i < transcriptions["0"].text.length; i++) {
      //@ts-ignore
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
    <div className="mt-10 ml-10 mr-5">
      {/* Video controls */}
      <audio ref={voiceRef} />
      <div
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        {(holdTooltips || showControls) && !playing && (
          <ToolTips
            annotations={annotations}
            videoRef={videoRef}
            drawTranslation={drawTranslation}
            setHoldTooltips={setHoldTooltips}
          />
        )}
        <video ref={videoRef} controls={true} onMouseMove={handleMouseMove} />
        <InfoBox
          x={translationPos[0]}
          y={translationPos[1]}
          hide={!translationBox}
          borderColor={translationText.color}
          ref={translationRef}
        >
          <div style={{ display: "flex" }}>
            <div>
              <span
                style={{
                  fontFamily: "Arial",
                  fontSize: 30,
                  color: tinycolor(translationText.color).darken(20),
                }}
              >
                {translationText.original}
              </span>
              <div style={{ fontFamily: "Arial", fontSize: 14, marginTop: 10 }}>
                {translationText.translatedText}
              </div>
            </div>
            <TranslationActionIcons
              translationText={translationText}
              video={videoRow}
              time={videoRef.current ? videoRef.current.currentTime : undefined}
            />
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
  );
}

const ToolTips = ({
  annotations,
  videoRef,
  drawTranslation,
  setHoldTooltips,
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
        <TipCircle
          key={i}
          hex={hex}
          style={{ position: "absolute", top: y, left: x }}
          onClick={() => {
            drawTranslation(word, hex);
          }}
          onMouseEnter={() => {
            setHoldTooltips(true);
          }}
          onMouseLeave={() => {
            setHoldTooltips(false);
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

const TipCircle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 20px;
  border: 3px solid white;
  background-color: ${(props) => props.hex};
  cursor: pointer;
  z-index: 4;
  transition-timing-function: ease;
  transition-duration: 0.5s;

  &:hover {
    transform: scale(1.5, 1.5);
  }
`;
