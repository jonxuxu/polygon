import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function VideoPlayer() {
  const videoRef = useRef(null);

  useEffect(() => {
    const hlsUrl = `https://dq86krv8mpwpa.cloudfront.net/f5cc4e0a-292e-4e5d-b838-2911cc154f18/hls/Laptop Repair.m3u8`;
    const video = videoRef.current;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      console.log("natively supported");
      // If HLS is natively supported, let the browser do the work!
      video.src = "hlsUrl";
      video.addEventListener("loadedmetadata", function () {
        video.play();
      });
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
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
    } else {
      alert("Please use a modern browser to play the video");
    }
  }, []);

  return (
    <div>
      <div>thing1</div>
      <video ref={videoRef} />
      <div>thing2</div>
    </div>
  );
}
