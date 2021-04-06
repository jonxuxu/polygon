import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import axios from "axios";
import styled from "styled-components";
import Head from "next/head";

import annotations from "../annotationsTemp.json";
import transcriptions from "../transcriptionsTemp.json";
import { wordCollider } from "../utils/collisions";
import { getEase } from "../utils/transitions";
import { copyToClipboard } from "../utils/text";
import { speak } from "../utils/sounds";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp, faCopy } from "@fortawesome/free-solid-svg-icons";

// Video player dimensions
const videoWidth = 1200;
const videoHeight = 676;
var offsetX;
var offsetY;

// Canvas contexts
var baseContext;
var secondaryContext;

// Zoom variables
var zoomedIn = false;
var focusText = null;

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const voiceRef = useRef(null);
  const translationRef = useRef(null);
  const baseCanvas = useRef(null);
  const secondayCanvas = useRef(null);

  const [playing, setPlaying] = useState(false);

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
    const hlsUrl =
      "https://storage.googleapis.com/video-world-source/test-speech.mp4";
    // const hlsUrl = `https://dq86krv8mpwpa.cloudfront.net/f5cc4e0a-292e-4e5d-b838-2911cc154f18/hls/Laptop Repair.m3u8`;
    const video = videoRef.current;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      console.log("natively supported");
      // If HLS is natively supported, let the browser do the work!
      video.src = hlsUrl;
    } else if (Hls.isSupported()) {
      console.log("not natively supported");
      video.src = hlsUrl;
      // If the browser supports MSE, use hls.js to play the video
      // var hls = new Hls({
      //   // This configuration is required to insure that only the
      //   // viewer can access the content by sending a session cookie
      //   // to api.video service
      //   xhrSetup: function (xhr, url) {
      //     xhr.withCredentials = true;
      //     // xhr.setRequestHeader(
      //     //   "Access-Control-Allow-Headers",
      //     //   "Content-Type, Accept, X-Requested-With"
      //     // );
      //     // xhr.setRequestHeader(
      //     //   "Access-Control-Allow-Origin",
      //     //   "http:localhost:3000"
      //     // );
      //     // xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");
      //   },
      // });
      // hls.loadSource(hlsUrl);
      // hls.attachMedia(video);
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
  }, []);

  useEffect(() => {
    if (playing) {
      console.log("playing");
      // if (secondaryContext) {
      //   secondaryContext.restore();
      //   secondaryContext.clearRect(
      //     0,
      //     0,
      //     videoRef.current.width,
      //     videoRef.current.height
      //   );
      // }

      videoRef.current.play();
      setTranslationBox(false);
      zoomedIn = false;
    } else {
      videoRef.current.pause();
    }
  }, [playing]);

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

    // console.log(cursorPoint, collision);
    if (!zoomedIn) {
      if (cursorPoint && !collision) {
        setCursorPoint(false);
        secondaryContext.clearRect(
          0,
          0,
          secondaryContext.canvas.width,
          secondaryContext.canvas.height
        );
      }
    }
  }

  function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

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
    console.log("box width: ", width);
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
        <title>My page title</title>
      </Head>
      {/* Video controls */}
      {playing ? (
        <button
          onClick={() => {
            videoRef.current.pause();
            setPlaying(false);
          }}
        >
          pause
        </button>
      ) : (
        <button
          onClick={() => {
            videoRef.current.play();
            setPlaying(true);
          }}
        >
          play
        </button>
      )}
      <progress
        id="progress-bar"
        min="0"
        max="100"
        style={{ width: 200 }}
        value={videoProgress}
        onClick={(e) => {
          const currentTargetRect = e.currentTarget.getBoundingClientRect();
          const left = e.pageX - currentTargetRect.left;
          const percentage = left / 200;
          const vidTime = videoRef.current.duration * percentage;
          videoRef.current.currentTime = vidTime;
          setPlaying(true);
        }}
      >
        {videoProgress}% played
      </progress>
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
          style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}
        />
        <div
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            bottom: 40,
            left: 0,
            width: videoWidth,
            zIndex: 2,
          }}
        >
          {captionChars}
        </div>
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
      </div>
    </div>
  );
}

const MouseCanvas = styled.canvas`
  cursor: ${(props) => (props.pointer ? "pointer" : "default")};
`;

const Caption = styled.span`
  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
  font-size: 30px;
  margin: 0px 1px;
  cursor: pointer;
  &:hover {
    color: #ee3699;
  }
`;

const InfoBox = styled.div`
  position: absolute;
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
  display: ${(props) => (props.hide ? "none" : "inline-block")};
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  padding: 15px;
  border: 2px solid blue;
`;
