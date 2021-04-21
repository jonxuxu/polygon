import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import axios from "axios";
import styled from "styled-components";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp, faCopy } from "@fortawesome/free-solid-svg-icons";

import annotations from "../annotationsTemp.json";
import transcriptions from "../transcriptionsTemp.json";

import { wordCollider } from "../utils/collisions";
import { getEase } from "../utils/transitions";
import { copyToClipboard } from "../utils/text";
import { speak } from "../utils/sounds";
import { exitFullScreen, enterFullScreen } from "../utils/video";
import { useRouter } from "next/router";

import Controls from "./Controls";
import { useVideo } from "utils/fetcher";
import { videos } from ".prisma/client";

// Video player variables
var offsetX;
var offsetY;
var controlTimeout = null;

// Canvas contexts
var baseContext;
var secondaryContext;

// Zoom variables
var zoomedIn = false;
var focusText = null;

export default function VideoPlayer({ videoRow }: { videoRow: videos }) {
  const [videoWidth, setVideoWidth] = useState(1200);
  const [videoHeight, setVideoHeight] = useState(676);

  const videoRef = useRef(null);
  const voiceRef = useRef(null);
  const translationRef = useRef(null);
  const baseCanvas = useRef(null);
  const secondayCanvas = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const [cursorPoint, setCursorPoint] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const [translationBox, setTranslationBox] = useState(false);
  const [translationPos, setTranslationPos] = useState([0, 0]);
  const [translationText, setTranslationText] = useState({
    translatedText: null,
    original: null,
    detectedSourceLanguage: null,
  });

  useEffect(() => {
    // Loads font
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

    // Connect video to canvas
    video.addEventListener(
      "play",
      () => {
        requestAnimationFrame(updateCanvas);
      },
      false
    );

    // Connect video to progress bar
    video.addEventListener("timeupdate", updateProgressBar, false);

    // Fetch annotations
    // const annotationUrl =
    //   "https://storage.googleapis.com/video-world-annotations/test-walk.json";
    // (async () => {
    //   const res = await axios.get(annotationUrl);
    //   console.log(res.data);
    // })();

    // Canvas toolitp to top canvas
    const canvas = secondayCanvas.current;
    var BB = canvas.getBoundingClientRect();
    offsetX = BB.left;
    offsetY = BB.top;
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);

    // Set global vars for easy access
    baseContext = baseCanvas.current.getContext("2d");
    secondaryContext = secondayCanvas.current.getContext("2d");
  }, [videoRow]);

  useEffect(() => {
    if (playing) {
      console.log("playing");
      videoRef.current.play();
      setTranslationBox(false);
      zoomedIn = false;
    } else {
      console.log("pausing");
      videoRef.current.pause();
    }
  }, [playing]);

  useEffect(() => {
    if (fullScreen) {
      enterFullScreen(videoRef);
      setVideoWidth(screen.width);
      setVideoHeight(screen.height);
    } else {
      exitFullScreen();
      setVideoWidth(1200);
      setVideoHeight(676);
    }
  }, [fullScreen]);

  // Draw canvas
  const updateCanvas = () => {
    const video = videoRef.current;
    if (video.ended || video.paused) {
      return;
    }

    // Draw the current frame of the video
    baseContext.drawImage(video, 0, 0, video.width, video.height);

    // If not zoomed in, draw rectangles over all the signs the user can click on
    if (!zoomedIn) {
      const millis = Math.floor(video.currentTime * 10) * 100;
      if (annotations[millis]) {
        annotations[millis].forEach((word) => {
          baseContext.strokeStyle = "red";
          const vidX = word.boundingBox[0].x * video.width;
          const vidY = word.boundingBox[0].y * video.height;
          const width =
            (word.boundingBox[2].x - word.boundingBox[0].x) * video.width;
          const height =
            (word.boundingBox[2].y - word.boundingBox[0].y) * video.height;
          baseContext.strokeRect(vidX, vidY, width, height);
        });
      }
    }
    requestAnimationFrame(updateCanvas);
  };

  // Mouse move function
  function handleMouseMove(e) {
    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();

    const mouseX = e.clientX - offsetX;
    const mouseY = e.clientY - offsetY;
    const millis = Math.floor(videoRef.current.currentTime * 10) * 100;

    var collision = false;
    if (!zoomedIn) {
      if (annotations[millis]) {
        collision = wordCollider(
          mouseX,
          mouseY,
          videoWidth,
          videoHeight,
          annotations[millis],
          (word) => {
            setCursorPoint(true);
          }
        );
      }
    }
    if (!collision && cursorPoint) {
      setCursorPoint(false);
    }

    setShowControls(true);
    if (controlTimeout) {
      clearTimeout(controlTimeout);
    }
    controlTimeout = setTimeout(function () {
      setShowControls(false);
    }, 2000);
  }

  function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    console.log("click");

    const mouseX = e.clientX - offsetX;
    const mouseY = e.clientY - offsetY;
    const millis = Math.floor(videoRef.current.currentTime * 10) * 100;
    // console.log(mouseX, mouseY);
    if (zoomedIn) {
      console.log("clicked when zoomin");
    } else {
      wordCollider(
        mouseX,
        mouseY,
        videoWidth,
        videoHeight,
        annotations[millis],
        (word) => {
          console.log("click on word");
          zoomIn(word);
        }
      );
    }
  }

  const drawTranslation = async (word, zoom, endx, endy) => {
    const text = word.text;
    const res = await axios.get("/api/translate", {
      params: { text: text, target: "en" },
    });

    setTranslationText({ ...res.data.translation, original: word.text });

    setTranslationBox(true);

    const width = translationRef.current.offsetWidth;
    const isLeft = word.boundingBox[0].x > 1 - word.boundingBox[2].x;
    const translateStartX = (word.boundingBox[0].x * videoWidth - endx) * zoom;
    const translateEndX = (word.boundingBox[2].x * videoWidth - endx) * zoom;
    const translateStartY = (word.boundingBox[0].y * videoHeight - endy) * zoom;
    const rectX = isLeft ? translateStartX - width - 30 : translateEndX + 30;
    const rectY = translateStartY;

    setTranslationPos([rectX, rectY]);
  };

  const zoomIn = (word) => {
    console.log("zoom in to " + word.text);
    setPlaying(false);

    const width = word.boundingBox[2].x - word.boundingBox[0].x;
    const height = word.boundingBox[2].y - word.boundingBox[0].y;

    const centerx =
      word.boundingBox[0].x < 0.5
        ? word.boundingBox[0].x * videoWidth
        : word.boundingBox[2].x * videoWidth;
    const centery =
      word.boundingBox[0].y < 0.5
        ? word.boundingBox[0].y * videoHeight
        : word.boundingBox[2].y * videoHeight;

    // Compute zoom factor.
    const zoom = width > height ? 0.3 / width : 0.5 / height;

    // Translate so the visible origin is at the context's origin.
    baseContext.translate(0, 0);

    // Compute the new visible origin. Originally the word is at a
    // distance word/scale from the corner, we want the point under
    // the word to remain in the same place after the zoom, but this
    // is at word/new_scale away from the corner. Therefore we need to
    // shift the origin (coordinates of the corner) to account for this.
    const scale = 1;
    const endx = -(centerx / (scale * zoom) - centerx / scale);
    const endy = -(centery / (scale * zoom) - centery / scale);

    const params = {
      startZoom: 1,
      endZoom: zoom,
      startX: 0,
      endX: endx,
      startY: 0,
      endY: endy,
      progress: 0,
      callback: () => {
        zoomedIn = true;
        console.log("focus word set to ", word.text);
        focusText = word.text;
        drawTranslation(word, zoom, endx, endy);
      },
    };

    zoomAnimate(params);
  };

  const zoomAnimate = (params) => {
    // Ease animation for 100 frames
    if (params.progress < 100) {
      let zoomProgress = params.progress;
      let xProgress = params.progress;
      let yProgress = params.progress;
      const frameZoom = getEase(
        zoomProgress,
        params.startZoom,
        params.endZoom - params.startZoom,
        100,
        3
      );
      const frameOriginX = getEase(
        xProgress,
        params.startX,
        params.endX - params.startX,
        100,
        3
      );
      const frameOriginY = getEase(
        yProgress,
        params.startY,
        params.endY - params.startY,
        100,
        3
      );

      // console.log(params.progress, frameZoom, frameOriginX, frameOriginY);

      baseContext.save();
      // Scale it (centered around the origin due to the trasnslate above).
      baseContext.scale(frameZoom, frameZoom);
      // Offset the visible origin to it's proper position.
      baseContext.translate(-frameOriginX, -frameOriginY);

      // Update scale and others.
      // scale *= zoom;

      baseContext.drawImage(
        videoRef.current,
        0,
        0,
        videoRef.current.width,
        videoRef.current.height
      );
      baseContext.restore();

      params.progress += 1;
      requestAnimationFrame(zoomAnimate.bind(null, params));
    } else {
      params.callback();
    }
  };

  function updateProgressBar() {
    var percentage = Math.floor(
      (100 / videoRef.current.duration) * videoRef.current.currentTime
    );

    setVideoProgress(percentage);
  }

  const captionChars = [];
  for (var i = 0; i < transcriptions["0"].text.length; i++) {
    const word = transcriptions["0"].text.charAt(i);
    captionChars.push(
      <Caption
        key={i}
        onClick={() => {
          speak(voiceRef, word, "zh");
        }}
      >
        {word}
      </Caption>
    );
  }

  return (
    <div>
      <Head>
        <title>Video World</title>
      </Head>
      {/* Video controls */}
      <audio ref={voiceRef} />

      <video
        ref={videoRef}
        width={videoWidth}
        height={videoHeight}
        style={{ display: "none" }}
      />
      <div
        style={{ position: "relative", width: videoWidth, height: videoHeight }}
      >
        <canvas
          ref={baseCanvas}
          width={videoWidth}
          height={videoHeight}
          style={{ position: "absolute", left: 0, top: 0, zIndex: 0 }}
        />
        <MouseCanvas
          ref={secondayCanvas}
          width={videoWidth}
          height={videoHeight}
          pointer={cursorPoint}
          hide={!showControls}
          style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}
        />
        <InfoBox
          x={translationPos[0]}
          y={translationPos[1]}
          hide={!translationBox}
          ref={translationRef}
        >
          <div style={{ display: "flex" }}>
            <div>
              <span
                style={{ fontFamily: "Arial", fontSize: 30, color: "blue" }}
              >
                {translationText.original}
              </span>

              <div style={{ fontFamily: "Arial", fontSize: 14, marginTop: 10 }}>
                {translationText.translatedText}
              </div>
            </div>
            <div style={{ paddingLeft: 10, paddingTop: 10 }}>
              <div>
                <FontAwesomeIcon
                  icon={faVolumeUp}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    speak(
                      voiceRef,
                      translationText.original,
                      translationText.detectedSourceLanguage
                    );
                  }}
                />
              </div>
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
        {showControls && (
          <Controls
            videoRef={videoRef}
            setPlaying={setPlaying}
            playing={playing}
            progress={videoProgress}
            setFullScreen={setFullScreen}
            fullScreen={fullScreen}
          />
        )}
        <div
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            bottom: 40,
            left: 0,
            width: videoWidth,
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

const MouseCanvas = styled.canvas`
  cursor: ${(props) => {
    if (props.hide) {
      return "none";
    }
    return props.pointer ? "pointer" : "default";
  }};
`;

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
  border: 2px solid blue;
`;
