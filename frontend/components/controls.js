import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faForward,
  faBackward,
} from "@fortawesome/free-solid-svg-icons";

const VideoControls = ({ videoRef, setPlaying, playing, progress }) => {
  const controlRef = useRef(null);

  return (
    <div
      ref={controlRef}
      style={{ position: "absolute", bottom: 0, width: "100%", zIndex: 4 }}
    >
      <progress
        min="0"
        max="100"
        style={{
          width: "100%",
          height: 5,
          width: "100%",
          cursor: "pointer",
          position: "relative",
          top: 1,
        }}
        value={progress}
        onClick={(e) => {
          const currentTargetRect = e.currentTarget.getBoundingClientRect();
          const left = e.pageX - currentTargetRect.left;
          const percentage = left / controlRef.current.offsetWidth;
          const vidTime = videoRef.current.duration * percentage;
          videoRef.current.currentTime = vidTime;
          setPlaying(true);
        }}
      />
      <div
        style={{
          display: "flex",
          color: "white",
          width: "100%",
          padding: "5px 25px",
          zIndex: 3,
          backgroundColor: "rgba(40, 40, 40, 0.6)",
        }}
      >
        <FontAwesomeIcon icon={faBackward} style={{ cursor: "pointer" }} />
        <div
          onClick={() => {
            setPlaying(!playing);
          }}
          style={{ cursor: "pointer", marginLeft: 20, marginRight: 15 }}
        >
          {playing ? (
            <FontAwesomeIcon icon={faPause} />
          ) : (
            <FontAwesomeIcon icon={faPlay} />
          )}
        </div>
        <FontAwesomeIcon icon={faForward} style={{ cursor: "pointer" }} />
        {videoRef.current && (
          <span style={{ marginLeft: 20 }}>
            {`${new Date(videoRef.current.currentTime * 1000)
              .toISOString()
              .substr(11, 8)} / ${new Date(videoRef.current.duration * 1000)
              .toISOString()
              .substr(11, 8)}`}
          </span>
        )}
      </div>
    </div>
  );
};

{
  /* <progress
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
</progress> */
}

export default VideoControls;
