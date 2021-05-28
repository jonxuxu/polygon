import React from "react";
import styled from "styled-components";

const TranslationBox = (props) => {
  const translationText = props.translationText;
  return (
    <InfoBox {...props}>
      <div>
        <span style={{ fontFamily: "Arial", fontSize: 30, color: "blue" }}>
          {translationText.original}
        </span>
      </div>

      <div style={{ fontFamily: "Arial", fontSize: 14, marginTop: 10 }}>
        {translationText.translatedText}
      </div>
    </InfoBox>
  );
};

export default TranslationBox;

const InfoBox = styled.div`
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  padding: 15px;
  border: ${(props) =>
    props.translationText.original ? "2px solid blue" : "none"};
`;
