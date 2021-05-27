import React from "react";
import styled from "styled-components";

const paragraphs = [
  {
    title: "Full Interaction",
    content:
      "We believe that all the content in a video should be interactive. There’s so much data and information that sits idle, never to be touched or used. There’s really nothing that should prevent you from clicking on the text, the speech, the objects and the people in a video. Frame aims to make that happen with smart design, computer vision and speech to text algorithms.",
  },
  {
    title: "Adaptive and Fun",
    content:
      "We want to bring control and flexibility back in to the hands of our users. Instead of rigid playlists and algorithm-fed videos, we want to encourage genuine exploration and curiosity. Specificaly to the player, this includes being able to zoom, tilt, enhance, and translate important sections of the video frame, when and where it’s needed.",
  },
  {
    title: "Social and Collaborative",
    content:
      "Why has video watching now become the lonely experience of bingeing on content? We have plans to change this through indie content creation, first person footage, timeline sharing and live shows. Frame will aim to use the discovery experience that comes with greater interactivity to bring some life back into the internet.",
  },
  {
    title: "Linking Things Together",
    content:
      "We see a huge potential to bring videos to the 2020’s with next-level integrations. Translate foreign text, listen to them and add them to your collection. Search up a character in a show, or buy a piece of clothing you like. Save a lecture whiteboard for later, or jump to the video mentioned as a prerequisite. All within the Frame player.",
  },
];

const Manifesto = () => (
  <div>
    <div
      className="h-60 flex flex-col items-center justify-center text-white"
      style={{ background: "linear-gradient(10deg, #8036df, #ee3699)" }}
    >
      <h1 className="text-6xl mt-7">Manifesto</h1>
      <h1 className="mt-5">Bringing real interaction to video</h1>
      {/* <p className="text-white text-md">Bringing real interaction to video</p> */}
    </div>
    <div className="max-w-xl mx-auto mt-12 mb-24 flex flex-col text-left">
      <Title>The Paralyzing Player</Title>
      <Section>
        YouTube, Vimeo, IGTV, Youku all do the same thing. You go on the site,
        click a thumbnail, sit back, and watch.
      </Section>
      <Section>
        All we can do with video is play and pause. No matter how stimulating
        the content or engaging the story, the interaction is one-directional.
        We can only watch and passively take the content in. Nothing about this
        interaction has changed since the 90’s.
      </Section>
      <GradientDivider />
      <Section>
        We made Frame in response to the uncapitalized potential we see in the
        current video ecosystem, and with enthusiasm towards what it can become
        in the future. Below are some of the core idealogies guiding the
        construction of Frame. We have a lot planned, and hope you’ll enjoy the
        experience as much as we do.
      </Section>
      <Section>&mdash;Kunal and Jonathan, co-founders</Section>
      <div style={{ height: 20 }} />
      {paragraphs.map(({ title, content }) => (
        <div key={title}>
          <Title>{title}</Title>
          <Section>{content}</Section>
        </div>
      ))}
      <div style={{ height: 80 }} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/logo/shape.svg" width={50} />
      </div>
    </div>
  </div>
);

export default Manifesto;

const Title = ({ children }) => (
  <p style={{ fontSize: 25, marginTop: 35, fontWeight: "bold" }}>{children}</p>
);
const Section = ({ children }) => <p className="mt-5">{children}</p>;

const GradientDivider = styled.div`
  background: linear-gradient(45deg, #d819f8, #ee3699);
  height: 1px;
  margin-top: 40px;
  margin-bottom: 20px;
`;
