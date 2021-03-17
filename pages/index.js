import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function VideoPlayer() {
  const videoRef = useRef(null);

  useEffect(() => {
    const hlsUrl = `https://dq86krv8mpwpa.cloudfront.net/e8ed9c5a-8859-49cc-becf-b6e4836ff990/hls/Walking Around Taipei - Taiwan's Capital City [4K60].m3u8`;
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
