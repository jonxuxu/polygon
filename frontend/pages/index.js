import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import axios from "axios";
import annotations from "../annotationsTemp.json";
import styled from "styled-components";
import { wordCollider, boundsCollider } from "../utils/collisions";
import { getEase } from "../utils/transitions";
import { roundRect } from "../utils/shapes";
import Head from "next/head";

// Video player dimensions
const videoWidth = 1200;
const videoHeight = 676;
var offsetX;
var offsetY;

// Canvas contexts
var baseContext;
var secondaryContext;

// Zoom variables
var speakBounds = null;
var zoomedIn = false;
var translationText = null;
var focusText = null;

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const voiceRef = useRef(null);
  const baseCanvas = useRef(null);
  const secondayCanvas = useRef(null);

  const [playing, setPlaying] = useState(false);

  const [cursorPoint, setCursorPoint] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    // Loads font
    document.fonts.load('900 48px "Font Awesome 5 Free"');

    // Fetch Video URL
    const hlsUrl =
      "https://storage.googleapis.com/video-world-source/test-walk.mp4";
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
    secondaryContext.fillStyle = "blue";
    secondaryContext.strokeStyle = "blue";
  }, []);

  useEffect(() => {
    if (playing) {
      console.log("playing");
      if (secondaryContext) {
        secondaryContext.restore();
        secondaryContext.clearRect(
          0,
          0,
          videoRef.current.width,
          videoRef.current.height
        );
      }

      videoRef.current.play();
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
            // secondaryContext.clearRect(
            //   0,
            //   0,
            //   secondaryContext.canvas.width,
            //   secondaryContext.canvas.height
            // );
            // secondaryContext.fillText(word.text, mouseX, mouseY);
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
    console.log(zoomedIn);
    if (zoomedIn && speakBounds !== null) {
      console.log("zoomed in and speak bounds");
      // Play text if user clicks on speaker
      boundsCollider(mouseX, mouseY, speakBounds, async () => {
        console.log("speaker clicked!!");
        const res = await axios.get("/api/speak", {
          params: {
            text: focusText,
            language: translationText.detectedSourceLanguage,
          },
        });
        const audioData = res.data.audio;
        const blob = new Blob(audioData.audioContent, { type: "audio/ogg" });
        // console.log(audioData);
        voiceRef.current.pause();
        voiceRef.current.src = window.URL.createObjectURL(blob);
        voiceRef.current.play();
      });
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

  const drawTranslation = async (ctx, word, zoom, endx, endy) => {
    const text = word.text;
    const res = await axios.get("/api/translate", {
      params: { text: text, target: "en" },
    });
    translationText = res.data.translation;

    ctx.font = `30px Arial`;
    const width = ctx.measureText(text).width + 60; // 30 padding in rect
    const height = 15 + 36 + 15 + 18 + 15;
    const isLeft = word.boundingBox[0].x > 1 - word.boundingBox[2].x;
    const translateStartX = (word.boundingBox[0].x * videoWidth - endx) * zoom;
    const translateEndX = (word.boundingBox[2].x * videoWidth - endx) * zoom;
    const translateStartY = (word.boundingBox[0].y * videoHeight - endy) * zoom;
    const rectX = isLeft ? translateStartX - width - 30 : translateEndX + 30;
    const rectY = translateStartY;

    ctx.strokeStyle = "blue";
    ctx.fillStyle = "rgba(255, 255, 255, .7)";
    roundRect(ctx, rectX, rectY, width, height, 10, true);

    ctx.fillStyle = "blue";
    ctx.fillText(text, rectX + 15, rectY + 15 + 36);

    ctx.font = `18px Arial`;
    ctx.fillStyle = "black";
    ctx.fillText(
      translationText.translatedText,
      rectX + 15,
      rectY + 15 + 48 + 15
    );

    ctx.fillStyle = "red";
    ctx.fillRect(rectX + width - 30, rectY + 32, 16, 16);

    ctx.fillStyle = "blue";
    ctx.font = '900 14px "Font Awesome 5 Free"';
    ctx.fillText("\uF028", rectX + width - 30, rectY + 15 + 30);

    const speak_x_start = rectX + width - 30;
    const speak_x_end = speak_x_start + 16;
    const speak_y_start = rectY + 32;
    const speak_y_end = speak_y_start + 16;
    speakBounds = [
      { x: speak_x_start, y: speak_y_start },
      { x: speak_x_end, y: speak_y_end },
    ];
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
        // secondaryContext.restore();
        // secondaryContext.scale(zoom, zoom);
        // secondaryContext.translate(-endx, -endy);
        drawTranslation(secondaryContext, word, zoom, endx, endy);
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

  return (
    <div>
      <Head>
        <title>My page title</title>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
        />
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
      <div style={{ position: "relative" }}>
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
      </div>
    </div>
  );
}

const MouseCanvas = styled.canvas`
  cursor: ${(props) => (props.pointer ? "pointer" : "default")};
`;
