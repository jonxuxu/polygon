import Topbar from "components/Topbar";
import React from "react";

const Manifesto = () => (
  <div>
    {/* <Topbar /> */}
    <div className="bg-gradient-to-tr from-purple-500 to-primary-500 h-48 flex items-center justify-center">
      <h1 className="text-white text-3xl">Manifesto</h1>

      {/* <p className="text-white text-md">Bringing real interaction to video</p> */}
    </div>
    <div className="max-w-lg mx-auto mt-12 mb-24 flex flex-col text-left">
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
      <div className="border-t-2 border-primary-400 mt-5" />
      <Section>
        We made Polygon in response to the uncapitalized potential we see in the
        current video ecosystem, and with enthusiasm towards what it can become
        in the future. Below are some of the core idealogies guiding the
        construction of Polygon. We have a lot planned, and hope you’ll enjoy
        the experience as much as we do.
      </Section>
      <Section>&mdash;Kunal and Jonathan</Section>
      {[
        {
          title: "Full Interaction",
          content:
            "We believe that all the content in a video should be interactive. There’s so much data and information that sits idle, never to be touched or used. There’s really nothing that should prevent you from clicking on the text, the speech, the objects and the people in a video. Polygon aims to make that happen with smart design, computer vision and speech to text algorithms.",
        },
        {
          title: "Adaptive and Fun",
          content:
            "We want to bring control and flexibility back in to the hands of our users. Instead of rigid playlists and algorithm-fed videos, we want to encourage genuine exploration and curiosity. Specificaly to the player, this includes being able to zoom, tilt, enhance, and translate important sections of the video frame, when and where it’s needed.",
        },
        {
          title: "Social and Collaborative",
          content:
            "Why has video watching now become the lonely experience of bingeing on content? We have plans to change this through indie content creation, first person footage, timeline sharing and live shows. Polygon will aim to use the discovery experience that comes with greater interactivity to bring some life back into the internet.",
        },
        {
          title: "Linking Things Together",
          content:
            "We see a huge potential to bring videos to the 2020’s with next-level integrations. Translate foreign text, listen to them and add them to your collection. Search up a character in a show, or buy a piece of clothing you like. Save a lecture whiteboard for later, or jump to the video mentioned as a prerequisite. All within the Polygon player.",
        },
      ].map(({ title, content }) => (
        <div>
          <Title>{title}</Title>
          <Section>{content}</Section>
        </div>
      ))}
    </div>
  </div>
);

export default Manifesto;

const Title = ({ children }) => <p className="text-xl mt-10">{children}</p>;
const Section = ({ children }) => <p className="mt-5">{children}</p>;
