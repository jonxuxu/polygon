import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faForward,
  faBackward,
  faExpand,
  faCompress,
} from "@fortawesome/free-solid-svg-icons";

const VideoControls = ({
  videoRef,
  setPlaying,
  playing,
  progress,
  setFullScreen,
  fullScreen,
}) => {
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
          justifyContent: "space-between",
          color: "white",
          padding: "5px 25px",
          backgroundColor: "rgba(40, 40, 40, 0.6)",
        }}
      >
        <div style={{ display: "flex" }}>
          <FontAwesomeIcon icon={faBackward} style={{ cursor: "pointer" }} />
          <FontAwesomeIcon
            icon={playing ? faPause : faPlay}
            onClick={() => {
              setPlaying(!playing);
            }}
            style={{ cursor: "pointer", marginLeft: 20, marginRight: 15 }}
          />
          <FontAwesomeIcon icon={faForward} style={{ cursor: "pointer" }} />
          {videoRef.current && videoRef.current.duration && (
            <span style={{ marginLeft: 20 }}>
              {`${new Date(videoRef.current.currentTime * 1000)
                .toISOString()
                .substr(11, 8)} / ${new Date(videoRef.current.duration * 1000)
                .toISOString()
                .substr(11, 8)}`}
            </span>
          )}
        </div>
        <FontAwesomeIcon
          icon={fullScreen ? faCompress : faExpand}
          style={{ cursor: "pointer" }}
          onClick={() => {
            setFullScreen(!fullScreen);
          }}
        />
      </div>
    </div>
  );
};

export default VideoControls;
