import React, { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import axios from "axios";
import styled from "styled-components";
import tinycolor from "tinycolor2";

import { speak } from "utils/sounds";
import { Transcription } from "utils/types";
import { fetcher, useMe } from "utils/fetcher";
import { positionTranslation } from "utils/positions";
import languages from "constants/languages.json";
import VideoControls from "components/Controls";

import { videos } from ".prisma/client";
import { TranslationActionIcons } from "./TranslationActionIcons";

// Content variables
var annotations = [];
var transcriptions = [];
var mouseTimeout;

export default function VideoPlayer({
  videoRow,
  snippets,
  setSnippets,
  videoRef,
  commentInputFocus,
}: {
  videoRow: videos;
  snippets: Transcription[];
  setSnippets: any;
  videoRef: React.MutableRefObject<any>;
  commentInputFocus: boolean;
}) {
  const { me } = useMe();

  const voiceRef = useRef(null);
  const translationRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [translationBox, setTranslationBox] = useState(false);
  const [translationPos, setTranslationPos] = useState([0, 0]);
  const [translationData, setTranslationData] = useState<Transcription>({
    translatedText: null,
    original: null,
    detectedSourceLanguage: null,
    color: null,
    time: null,
    image: null,
  });
  const [captionChars, setCaptionChars] = useState([]);
  const [targetLang, setTargetLang] = useState("English");
  const [showControls, setShowControls] = useState(false);

  // Keyboard listeners
  const handlekeydownEvent = useCallback((event) => {
    const { keyCode } = event;

    if (event.target.tagName === "VIDEO") {
      return;
    }
    // Space
    if (keyCode === 32) {
      event.preventDefault();
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    } else if (keyCode === 39) {
      // Right button
      videoRef.current.currentTime += 30;
    } else if (keyCode === 37) {
      // Left button
      videoRef.current.currentTime -= 30;
    } else if (keyCode === 38) {
      // Up arrow
      if (videoRef.current.volume <= 0.9) {
        videoRef.current.volume += 0.1;
      } else {
        videoRef.current.volume = 1;
      }
    } else if (keyCode === 40) {
      // Down arrow
      if (videoRef.current.volume >= 0.1) {
        videoRef.current.volume -= 0.1;
      } else {
        videoRef.current.volume = 0;
      }
    }
  }, []);

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
    video.addEventListener(
      "play",
      () => {
        setTranslationBox(false);
        setPlaying(true);
      },
      false
    );
    video.addEventListener(
      "pause",
      () => {
        // clearTimeout(mouseTimeout);

        setPlaying(false);
      },
      false
    );
    video.addEventListener(
      "timeupdate",
      () => {
        if (transcriptions && videoRef.current) {
          const currentText =
            transcriptions[
              videoRef.current.currentTime - (videoRef.current.currentTime % 3)
            ];
          // @ts-ignore
          if (currentText) {
            setCaptionChars(currentText.split(""));
          } else {
            setCaptionChars([]);
          }
        }
      },
      false
    );
    video.addEventListener("mousemove", () => {
      clearTimeout(mouseTimeout);
      setShowControls(true);
      mouseTimeout = setTimeout(function () {
        setShowControls(false);
      }, 2000);
      if (video.paused) {
        // setShowTooltips(true);
        // clearTimeout(mouseTimeout);
        // mouseTimeout = setTimeout(function () {
        //   setShowTooltips(false);
        // }, 500);
      }
    });

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
      } else {
        transcriptions = [];
      }
    })();

    document.addEventListener("keydown", handlekeydownEvent);
    return () => {
      document.removeEventListener("keydown", handlekeydownEvent);
    };
  }, []);

  // disable shortcuts when user is typing comments
  useEffect(() => {
    if (commentInputFocus) {
      document.removeEventListener("keydown", handlekeydownEvent);
    } else {
      document.addEventListener("keydown", handlekeydownEvent);
    }
  }, [commentInputFocus]);

  useEffect(() => {
    if (me) setTargetLang(me.language);
  }, [me]);

  // Add to snippets if translation text has not been added
  useEffect(() => {
    if (translationData.original !== null) {
      for (var i = 0; i < snippets.length; i++) {
        if (snippets[i].original === translationData.original) {
          return;
        }
      }
      const newSnippets = [...snippets, translationData];
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
  }, [translationData]);

  const drawTranslation = async (word, color) => {
    // calculate image
    const videoWidth = videoRef.current.offsetWidth;
    const videoHeight = videoRef.current.offsetHeight;
    const x1 = word.boundingBox[0].x * videoWidth;
    const y1 = word.boundingBox[0].y * videoHeight;

    var canvas = document.createElement("canvas");
    var canvasContext = canvas.getContext("2d");
    // Compute cropped image
    var pixelRatio = window.devicePixelRatio || 1;
    canvas.width = 80 * pixelRatio;
    canvas.height = 80 * pixelRatio;
    canvas.style.width = "80px";
    canvas.style.width = "80px";

    const textWidth = word.boundingBox[2].x - word.boundingBox[0].x + 0.05;
    const textHeight = word.boundingBox[2].y - word.boundingBox[0].y + 0.05;
    const centerx = x1 - 10;
    const centery = y1 - 10;
    const zoom =
      textWidth > textHeight
        ? (80 * pixelRatio) / (textWidth * videoWidth)
        : (80 * pixelRatio) / (textHeight * videoHeight);
    canvasContext.scale(zoom, zoom);
    canvasContext.translate(-centerx, -centery);
    console.log(-centerx, -centery);
    canvasContext.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

    const image = canvas.toDataURL("image/png");

    // text stuff
    const text = word.text;

    const res: {
      data: {
        translation: { translatedText: string; detectedSourceLanguage: string };
      };
    } = await axios.get("/api/translate", {
      params: { text: text, target: languages[targetLang].text },
    });

    setTranslationData({
      ...res.data.translation,
      original: word.text,
      color: color,
      time: videoRef.current.currentTime,
      image: image,
    });

    setTranslationBox(true);

    const position = positionTranslation(videoRef, translationRef, word);

    setTranslationPos(position);
  };

  return (
    <div className="mt-3 sm:mt-10 sm:ml-5 md:ml-10 sm:mr-5">
      {/* Video controls */}
      <audio ref={voiceRef} />
      <div
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        {videoRef.current && !playing && (
          <ToolTips videoRef={videoRef} drawTranslation={drawTranslation} />
        )}

        <video
          ref={videoRef}
          controls={false}
          onClick={() => {
            videoRef.current.paused
              ? videoRef.current.play()
              : videoRef.current.pause();
          }}
        />
        <VideoControls
          videoRef={videoRef}
          show={showControls || !videoRef.current || videoRef.current.paused}
        />
        <InfoBox
          x={translationPos[0]}
          y={translationPos[1]}
          hide={!translationBox}
          borderColor={translationData.color}
          ref={translationRef}
        >
          <div style={{ display: "flex" }}>
            <div>
              <span
                style={{
                  fontFamily: "Arial",
                  fontSize: 30,
                  color: tinycolor(translationData.color).darken(40),
                }}
              >
                {translationData.original}
              </span>
              <div style={{ fontFamily: "Arial", fontSize: 14, marginTop: 10 }}>
                {translationData.translatedText}
              </div>
            </div>
            <TranslationActionIcons
              translationText={translationData}
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
          {captionChars.map((c, i) => (
            <Caption
              key={i}
              onClick={() => {
                speak(voiceRef, c, languages[videoRow.language].speak, false);
              }}
            >
              {c}
            </Caption>
          ))}
        </div>
      </div>
    </div>
  );
}

const ToolTips = ({ videoRef, drawTranslation }) => {
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

    const hexColors = annotations[millis].map((word) => {
      const x = word.boundingBox[0].x * videoWidth;
      const y = word.boundingBox[0].y * videoHeight;

      // Calculate tooltip color
      const p = canvasContext.getImageData(x, y, 1, 1).data;
      const hex = tinycolor({ r: p[0], g: p[1], b: p[2] }).toHexString();
      return hex;
    });

    tooltips = annotations[millis].map((word, i) => {
      const x1 = word.boundingBox[0].x * videoWidth;
      const y1 = word.boundingBox[0].y * videoHeight;

      return (
        <TipCircle
          key={i}
          hex={hexColors[i]}
          style={{ position: "absolute", top: y1, left: x1 }}
          onClick={() => {
            drawTranslation(word, hexColors[i]);
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
  z-index: 20;
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
