import { SnippetPreview } from "components/SnippetPreview";
import { useState } from "react";
import styled from "styled-components";

const Sidebar = ({ snippets, videoRef }) => {
  const [tab, setTab] = useState("snippets");

  return (
    <div style={{ width: 400, backgroundColor: "#f9f9f9" }}>
      <div style={{ display: "flex", padding: "10px 10px" }}>
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
      {tab === "snippets" && (
        <SnippetPreview snippets={snippets} videoRef={videoRef} />
      )}
      {tab === "comments" && <div>Comments</div>}
    </div>
  );
};

export default Sidebar;

const TabButton = styled.span`
  cursor: pointer;
  margin-left: 20px;
  ${(props) =>
    props.isActive &&
    `font-weight: bold;
    background: linear-gradient(93.12deg, #EE3699 -20.79%, #8036DF  109.75%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    `}
`;
