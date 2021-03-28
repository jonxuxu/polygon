import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import axios from "axios";
import annotations from "../annotationsTemp.json";
import styled from "styled-components";
import { wordCollider } from "../utils/collisions";

const videoWidth = 1200;
const videoHeight = 676;

// console.log(annotations);

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const baseCanvas = useRef(null);
  const secondayCanvas = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [cursorPoint, setCursorPoint] = useState(false);

  var offsetX;
  var offsetY;
  var baseContext;
  var secondaryContext;

  useEffect(() => {
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
      // If the browser supports MSE, use hls.js to play the video
      var hls = new Hls({
        // This configuration is required to insure that only the
        // viewer can access the content by sending a session cookie
        // to api.video service
        xhrSetup: function (xhr, url) {
          xhr.withCredentials = true;
          // xhr.setRequestHeader(
          //   "Access-Control-Allow-Headers",
          //   "Content-Type, Accept, X-Requested-With"
          // );
          // xhr.setRequestHeader(
          //   "Access-Control-Allow-Origin",
          //   "http:localhost:3000"
          // );
          // xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");
        },
      });
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
  }, []);

  useEffect(() => {
    if (playing) {
      videoRef.current.play();
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

    baseContext.drawImage(video, 0, 0, video.width, video.height);
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
    if (annotations[millis]) {
      collision = wordCollider(
        mouseX,
        mouseY,
        videoWidth,
        videoHeight,
        annotations[millis],
        (word) => {
          secondaryContext.clearRect(
            0,
            0,
            secondaryContext.canvas.width,
            secondaryContext.canvas.height
          );
          secondaryContext.fillText(word.text, mouseX, mouseY);
          setCursorPoint(true);
        }
      );
    }

    // console.log(cursorPoint, collision);
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

  function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    const mouseX = e.clientX - offsetX;
    const mouseY = e.clientY - offsetY;
    const millis = Math.floor(videoRef.current.currentTime * 10) * 100;
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

  function zoomIn(word) {
    var scale = 1;
    var originx = 0;
    var originy = 0;

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
    baseContext.translate(originx, originy);

    // Compute the new visible origin. Originally the word is at a
    // distance word/scale from the corner, we want the point under
    // the word to remain in the same place after the zoom, but this
    // is at word/new_scale away from the corner. Therefore we need to
    // shift the origin (coordinates of the corner) to account for this.
    originx -= centerx / (scale * zoom) - centerx / scale;
    originy -= centery / (scale * zoom) - centery / scale;

    console.log(originx, originy);

    baseContext.save();

    // Ease animation for 100 frames
    for (const frame = 0; frame < 100; frame++) {
      getEase(currentProgress, params.xFrom, distance, steps, 3);
      // Scale it (centered around the origin due to the trasnslate above).
      baseContext.scale(zoom, zoom);
      // Offset the visible origin to it's proper position.
      baseContext.translate(-originx, -originy);

      // Update scale and others.
      // scale *= zoom;

      baseContext.drawImage(
        videoRef.current,
        0,
        0,
        videoRef.current.width,
        videoRef.current.height
      );
    }
  }

  return (
    <div>
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
