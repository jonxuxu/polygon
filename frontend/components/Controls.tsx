import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const VideoControls = ({ videoRef, show }) => {
  const video = videoRef.current;
  const progressRef = useRef(null);
  const [volumeSelect, setVolumeSelect] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (video) {
      video.volume = volume;
    }
  }, [volume]);

  if (video === undefined || video === null || !show) {
    return <div />;
  }

  return (
    <ControlDiv id="video-controls">
      <div
        style={{
          display: "flex",
          position: "relative",
          top: 10,
        }}
      >
        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            pointerEvents: "auto",
            alignItems: "center",
          }}
          onMouseEnter={() => {
            setVolumeSelect(true);
          }}
          onMouseLeave={() => {
            setVolumeSelect(false);
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
          <VolumeSlider
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => {
              setVolume(e.target.value);
            }}
            hide={!volumeSelect}
          />
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
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
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <ControlBtn src="/icons/message-alt.svg" size={17} />
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <ProgressBar
          value={video.currentTime}
          max={video.duration}
          onClick={(e) => {
            const currentTargetRect = e.currentTarget.getBoundingClientRect();
            const left = e.pageX - currentTargetRect.left;
            const percentage = left / currentTargetRect.width;
            const vidTime = video.duration * percentage;
            video.currentTime = vidTime;
          }}
          // onMouseMove={(e) => {
          //   const currentTargetRect = e.currentTarget.getBoundingClientRect();
          //   const left = e.pageX - currentTargetRect.left;
          //   setBarHover(left);
          // }}
          // onMouseLeave={() => {
          //   setBarHover(0);
          // }}
          // ref={progressRef}
        />
        {/* <SelectBar
          max={progressRef.current?.offsetWidth ?? 100}
          value={barHover}
          style={{
            height: progressRef.current?.offsetHeight ?? 4,
          }}
        /> */}
      </div>
    </ControlDiv>
  );
};

export default VideoControls;

const ControlDiv = styled.div`
  width: 100%;
  padding: 0px 2.5%;
  position: absolute;
  bottom: 0px;
  pointer-events: none;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
`;

const ProgressBar = styled.progress`
  pointer-events: auto;
  cursor: pointer;
  width: 100%;
  height: 4px;
  background-color: rgba(0, 0, 0, 0);
  transition-duration: 0.2s;
  position: relative;
  z-index: 2;

  &::-webkit-progress-bar {
    background-color: rgba(255, 255, 255, 0.5);
  }
  &::-webkit-progress-value {
    background-color: rgba(246, 91, 175, 0.2);
  }
  &:hover {
    height: 8px;
    transform: translate(0, 2px);
  }
`;

const SelectBar = styled.progress`
  position: absolute;
  z-index: 1;
  top: 12px;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0);

  &::-webkit-progress-bar {
    background-color: rgba(255, 255, 255, 0);
  }
  &::-webkit-progress-value {
    background-color: blue;
  }
`;

const ControlBtn = styled.img`
  pointer-events: auto;
  cursor: pointer;
  width: ${(props) => props.size}px;
`;

const VolumeSlider = styled.input`
  width: 60px;
  height: 8px;
  visibility: ${(props) => (props.hide ? "hidden" : "visible")};
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: rgba(0, 0, 0, 0);
  margin-left: 10px;

  &::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    background: linear-gradient(45deg, #ee3699, #8036df);
    height: 3px;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    border-radius: 50%;
    height: 10px;
    width: 10px;
    max-width: 80px;
    position: relative;
    bottom: 4px;
    background-color: white;
    cursor: -webkit-grab;

    -webkit-transition: border 1000ms ease;
    transition: border 1000ms ease;
  }
`;
