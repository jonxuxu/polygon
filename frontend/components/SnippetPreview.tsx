import React, { useEffect, useRef, useState } from "react";
import tinycolor from "tinycolor2";
import { TranslationActionIcons } from "./TranslationActionIcons";
import styled from "styled-components";

import { Transcription } from "../utils/types";

export function SnippetPreview({
  snippets,
  videoRef,
}: {
  snippets: Transcription[];
  videoRef?: React.MutableRefObject<any>;
}) {
  const sidebarRef = useRef(null);

  return (
    <SidebarDiv>
      <div
        style={{
          borderRight: "3px solid #EE3699",
          top: 0,
          // left: 35,
          width: 30,
        }}
      />
      <div style={{ flexGrow: 1 }} ref={sidebarRef}>
        <h2 className="pl-2 sm:pl-12">Your Snippets</h2>
        {snippets.length === 0 && (
          <div className="text-sm pl-2 sm:pl-12">
            You have no snippets. Click on any bubbles to add to your
            collection.
          </div>
        )}

        {snippets.map((t, i) => {
          const isFirst = i === 0 || snippets[i - 1].time !== snippets[i].time;
          return (
            <Snippet
              t={t}
              isFirst={isFirst}
              key={i}
              videoRef={videoRef}
              isPreview={false}
            />
          );
        })}
      </div>
    </SidebarDiv>
  );
}

export const Snippet = ({ t, isFirst, videoRef, isPreview }) => {
  const [showControls, setShowControls] = useState(false);

  return (
    <div style={{ display: "flex" }}>
      <div>
        <TimeBubble
          isFirst={isFirst}
          onClick={() => {
            if (videoRef) {
              videoRef.current.currentTime = t.time;
            }
          }}
        >
          {new Date(t.time * 1000).toISOString().substr(11, 8)}
        </TimeBubble>
      </div>

      <SnippetCard
        isPreview={isPreview}
        color={t.color}
        onMouseEnter={() => {
          setShowControls(true);
        }}
        onMouseLeave={() => {
          setShowControls(false);
        }}
      >
        <div className="flex">
          {t.image && <img src={t.image} width={80} height={80} />}
          <span style={{ fontFamily: "Arial", paddingLeft: 15 }}>
            <span
              style={{
                fontSize: 18,
                color: tinycolor(t.color).darken(20),
              }}
            >
              {t.original}
            </span>
            <br />
            <span style={{ fontSize: 12 }}>{t.translatedText}</span>
          </span>
        </div>
        <TranslationActionIcons
          translationText={t}
          time={t.time}
          hide={!showControls}
        />
      </SnippetCard>
    </div>
  );
};

const SidebarDiv = styled.div`
  overflow-y: scroll;
  background-color: #f9f9f9;
  width: 400px;
  position: relative;
  padding-top: 1.25rem;
  height: 100%;
  display: flex;
`;

const TimeBubble = styled.div`
  border: 1px solid #ee3699;
  background-color: white;
  width: 50px;
  border-radius: 10px;
  font-size: 10px;
  text-align: center;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 8px;
  visibility: ${(props) => (props.isFirst ? "initial" : "hidden")};
  cursor: pointer;
  transition-duration: 0.25s;
  position: absolute;
  left: -10px;

  &:hover {
    background-color: #ee3699;
    color: white;
  }
`;

const SnippetCard = styled.div`
  border: 2px solid ${(props) => props.color};
  border-radius: 20px;
  flex-grow: 1;
  background-color: white;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  margin-left: ${(props) => (props.isPreview ? `0px` : "50px")};
  margin-right: ${(props) => (props.isPreview ? `0px` : "20px")};
`;
