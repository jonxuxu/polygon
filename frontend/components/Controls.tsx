import { useRef, useState } from "react";
import styled from "styled-components";

const VideoControls = ({ videoRef }) => {
  const [hidden, setHidden] = useState(false);
  const video = videoRef.current;

  if (video === undefined || video === null) {
    return <div />;
  }

  return (
    <ControlDiv id="video-controls" className="controls">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          top: 10,
        }}
      >
        {video.muted ? (
          <ControlBtn
            src="/icons/volume-off.svg"
            size={17}
            onClick={() => {
              video.muted = false;
            }}
          />
        ) : (
          <ControlBtn
            src="/icons/volume-up.svg"
            size={17}
            onClick={() => {
              video.muted = true;
            }}
          />
        )}

        {video.paused ? (
          <ControlBtn
            onClick={() => {
              video.play();
            }}
            src="/icons/play.svg"
            size={35}
          />
        ) : (
          <ControlBtn
            onClick={() => {
              video.pause();
            }}
            src="/icons/pause.svg"
            size={35}
          />
        )}
        <ControlBtn src="/icons/message-alt.svg" size={17} />
      </div>
      <ProgressBar
        id="progress"
        value={video.currentTime}
        max={video.duration}
        onClick={(e) => {
          const currentTargetRect = e.currentTarget.getBoundingClientRect();
          const left = e.pageX - currentTargetRect.left;
          const percentage = left / currentTargetRect.width;
          console.log(percentage);
          const vidTime = video.duration * percentage;
          video.currentTime = vidTime;
          // setPlaying(true);
        }}
      />
    </ControlDiv>
  );
};

export default VideoControls;

const ControlDiv = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0px;
  padding: 0px 2.5%;
`;

const ProgressBar = styled.progress`
  cursor: pointer;
  width: 100%;
  height: 4px;
  background-color: rgba(0, 0, 0, 0);

  &::-webkit-progress-bar {
    background-color: rgba(255, 255, 255, 0.5);
  }
  &::-webkit-progress-value {
    background-color: rgba(246, 91, 175, 0.2);
  }
`;

const ControlBtn = styled.img`
  cursor: pointer;
  width: ${(props) => props.size}px;
`;
