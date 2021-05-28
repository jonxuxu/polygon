import { useState } from "react";
import styled from "styled-components";
import OutsideClicker from "components/OutsideClicker";
import Link from "next/link";
import dynamic from "next/dynamic";

const TourNoSSR = dynamic(() => import("reactour"), { ssr: false });

const tourSteps = [
  {
    selector: "#tourPlayer",
    content: () => (
      <div>
        <div style={{ fontSize: 18 }}>Keyboard Shortcuts</div>
        <div style={{ fontSize: 14 }}>[space bar] : play/pause</div>
        <div style={{ fontSize: 14 }}>[↑] : increase volume</div>
        <div style={{ fontSize: 14 }}>[↓] : decrease volume</div>
        <div style={{ fontSize: 14 }}>[←] : jump back 30 seconds</div>
        <div style={{ fontSize: 14 }}>[→] : jump forward 30 seconds</div>
        <div style={{ fontSize: 14 }}>[m] : toggle mute</div>
      </div>
    ),
  },
];

const HelpButton = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <ButtonDiv
        onClick={() => {
          setShowOptions(true);
        }}
      >
        ?
      </ButtonDiv>
      {showOptions && (
        <OutsideClicker onOutside={() => setShowOptions(false)}>
          <div
            style={{
              position: "absolute",
              top: -100,
              left: -120,
              backgroundColor: "white",
              boxShadow:
                "rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px",
              borderRadius: 5,
              padding: "5px 0",
            }}
          >
            <OptionDiv>
              <OptionLink href="mailto: hello@polygon.video">
                Send us a message
              </OptionLink>
            </OptionDiv>
            {/* <OptionDiv>Give feedback</OptionDiv> */}
            <OptionDiv>
              <OptionLink
                target="_blank"
                rel="noopener noreferrer"
                href="/how-it-works"
              >
                How it works
              </OptionLink>
            </OptionDiv>
            <OptionDiv
              onClick={() => {
                setShowOptions(false);
                setShowShortcuts(true);
              }}
            >
              Keyboard shortcuts
            </OptionDiv>
            {/* <OptionDiv>Terms & privacy</OptionDiv> */}
            <OptionDiv>
              <OptionLink
                target="_blank"
                rel="noopener noreferrer"
                href="https://discord.gg/5YD75HFTSe"
              >
                Discord
              </OptionLink>
            </OptionDiv>
          </div>
        </OutsideClicker>
      )}
      <TourNoSSR
        // @ts-ignore
        steps={tourSteps}
        isOpen={showShortcuts}
        onRequestClose={() => setShowShortcuts(false)}
        rounded={5}
        disableKeyboardNavigation={true}
        showButtons={false}
        showNavigation={false}
        showNavigationNumber={false}
        showNumber={false}
        showCloseButton={false}
      />
    </div>
  );
};

export default HelpButton;

const ButtonDiv = styled.button`
  border-radius: 5px;
  border: 2px solid #e5e5e5;
  cursor: pointer;
  padding: 2px 10px;
  font-weight: bold;
  &:focus {
    outline: none;
  }
`;

const OptionDiv = styled.div`
  cursor: pointer;
  padding: 0px 10px;
  color: rgb(107, 114, 128);
  font-size: 14px;
  &:hover {
    background-color: #e6e6e6;
  }
`;

const OptionLink = styled.a`
  color: rgb(107, 114, 128);
`;
