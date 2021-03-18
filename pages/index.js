import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null)

  useEffect(() => {
    const hlsUrl = `https://dq86krv8mpwpa.cloudfront.net/f5cc4e0a-292e-4e5d-b838-2911cc154f18/hls/Laptop Repair.m3u8`;
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

    video.addEventListener(
      "play",
      () => {
        requestAnimationFrame(updateCanvas);
      },
      false
    );
  }, []);

  const updateCanvas = () => {
    const video = videoRef.current
    const canvasContext = canvasRef.current.getContext("2d")
    if (video.ended || video.paused) {
      return;
    }

    canvasContext.drawImage(
      video,
      0,
      0,
      video.width,
      video.height
    );

    requestAnimationFrame(updateCanvas);
  }

  return (
    <div>
      <video ref={videoRef} controls width="600"
        height="338"/>
      <div>
      <canvas ref={canvasRef} id="canvas" width="600" height="338"/>
    </div>
    </div>
  );
}
