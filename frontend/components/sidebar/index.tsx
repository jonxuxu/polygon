import { SnippetPreview } from "./SnippetView";
import { CommentView } from "./CommentView";
import { useState } from "react";
import styled from "styled-components";

const Sidebar = ({ snippets, videoRef }) => {
  const [tab, setTab] = useState("snippets");

  return (
    <div
      style={{
        width: 400,
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #E5E5E5",
      }}
    >
      <div
        style={{
          display: "flex",
          padding: 10,
          borderTop: "1px solid #E5E5E5",
          borderBottom: "1px solid #E5E5E5",
        }}
      >
        <TabButton
          isActive={tab === "snippets"}
          onClick={() => {
            setTab("snippets");
          }}
        >
          Snippets
        </TabButton>
        <TabButton
          isActive={tab === "comments"}
          onClick={() => {
            setTab("comments");
          }}
        >
          Comments
        </TabButton>
      </div>
      <div style={{ flexGrow: 1, overflowY: "scroll" }}>
        {tab === "snippets" && (
          <SnippetPreview snippets={snippets} videoRef={videoRef} />
        )}
        {tab === "comments" && <CommentView />}
      </div>
    </div>
  );
};

export default Sidebar;

const TabButton = styled.span`
  cursor: pointer;
  margin-left: 20px;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  ${(props) =>
    props.isActive &&
    `font-weight: bold;
    background: linear-gradient(93.12deg, #EE3699 -20.79%, #8036DF  109.75%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    `}
`;
