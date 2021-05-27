import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";

const Footer = () => {
  const router = useRouter();

  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (router.route === "/how-it-works") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [router.route]);

  return (
    <FooterDiv theme={theme}>
      <img
        src={theme === "dark" ? "/logo/logo-light.svg" : "/logo/logo-dark.svg"}
        height={50}
      />
      <div style={{ display: "flex" }}>
        <FooterLink
          target="_blank"
          rel="noopener noreferrer"
          href="https://discord.gg/5YD75HFTSe"
          theme={theme}
          style={{ marginRight: 20 }}
        >
          Discord
        </FooterLink>
        <Link href="/manifesto">Manifesto</Link>
      </div>
    </FooterDiv>
  );
};

export default Footer;

const FooterDiv = styled.div`
  background-color: ${(props) =>
    props.theme === "dark" ? "#EE3699" : "#FCFCFC"};
  color: ${(props) => (props.theme === "dark" ? "white" : "#55504B")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  ${(props) => props.theme === "light" && "border-top: 1px solid #C4C4C4;"}
`;

const FooterLink = styled.a`
  color: ${(props) => (props.theme === "dark" ? "white" : "#55504B")};
`;
