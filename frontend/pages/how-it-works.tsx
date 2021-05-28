import Image from "next/image";
import { useRef } from "react";
import { SnippetPreview, Snippet } from "components/sidebar/SnippetView";
import { Transcription } from "../utils/types";
import { ChevronRightIcon, StarIcon } from "@heroicons/react/solid";
import Footer from "components/Footer";

import Link from "next/link";
import { useMe, useVideo } from "utils/fetcher";
import VideoPlayer from "components/VideoPlayer";

const features = [
  {
    name: "Definitions",
    sub: "Look up the meaning of words and phrases.",
    icon: "translate_outlined.svg",
  },
  {
    name: "Caption Highlighting",
    sub: "The current word gets highlighted in speech.",
    icon: "speaker_notes_outlined.svg",
  },
  {
    name: "Bubble Navigation",
    sub: "Jump to the right sign bubble using keyboard shortcuts only.",
    icon: "navigation_outlined.svg",
  },
  {
    name: "Comments",
    sub: "Comment and discuss inside and outside the video.",
    icon: "sort.svg",
  },
  {
    name: "Spaced Repitition",
    sub: "Create flashcards on mobile and desktop so you remember for life.",
    icon: "repeat.svg",
  },
  {
    name: "Live Streaming",
    sub: "All the features of Polygon applied to live video.",
    icon: "live_tv.svg",
  },
  {
    name: "GPS Integration",
    sub: "Scroll through a video based on geography instead of time.",
    icon: "gps_fixed.svg",
  },
  {
    name: "Timeline Sharing",
    sub: "Discover strangers and friends on your video timeline.",
    icon: "timeline.svg",
  },
  {
    name: "Influencer Collab",
    sub: "Limited drops, exclusive followings, and hype festivals.",
    icon: "whatshot.svg",
  },
];

function FeaturesGrid() {
  return (
    <div
      className="relative bg-white py-16 sm:py-24 lg:py-32 bg-center bg-no-repeat xl:bg-cover lg:bg-bottom-8"
      style={{
        backgroundImage: `url(/how-it-works/stripes.svg)`,
      }}
    >
      <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-5xl">
        <p className="mt-2 text-4xl font-extrabold text-gray-800 sm:text-5xl sm:tracking-tight lg:text-6xl ">
          Incoming Features
        </p>

        <div className="mt-12">
          <div className="grid gap-4 sm:gap-8 grid-cols-2 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-white rounded-lg shadow-lg px-3 sm:px-6 pb-8">
                  <div className="mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3">
                        <Image
                          src={"/icons/" + feature.icon}
                          height={45}
                          width={45}
                        />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.sub}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Page = () => {
  const voiceRef = useRef(null);

  const { video } = useVideo({ cuid: "ckokxczrz000009kua3j1eu0l" });
  const videoRef = useRef(null);

  const snippets: Transcription[] = [
    {
      original: "芋圓現做品質看得到",
      color: "red",
      translatedText: "You can see the quality of taro balls freshly made",
      time: 18,
      detectedSourceLanguage: "zh",
    },
    {
      original: "我們喜歡珍珠奶茶",
      color: "blue",
      translatedText: "We all enjoy bubble milk tea",
      time: 18,
      detectedSourceLanguage: "zh",
    },
    {
      original: "Один билет, пожалуйста",
      color: "green",
      translatedText: "One ticket, please.",
      time: 18,
      detectedSourceLanguage: "ru",
    },
  ];

  return (
    <div>
      <HeroSection />
      <audio ref={voiceRef} />
      <div className="">
        <div className="relative my-16">
          <h2 className="text-center leading-8 title text-gray-900">
            Learn through Immersion
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
            Learn a foreign language by being there. [Pause] the video to
            interact with signs and speech. Translate, copy, and listen, all
            within the player.
          </p>
        </div>

        <div className="flex gap-6">
          <Image
            src="/how-it-works/player1.png"
            height={281 * 1.5}
            width={499 * 1.5}
          />
          <Image
            src="/how-it-works/player2.png"
            height={281 * 1.5}
            width={499 * 1.5}
          />
          <Image
            src="/how-it-works/player3.png"
            height={281 * 1.5}
            width={499 * 1.5}
          />
        </div>
      </div>
      <CollectionSection snippets={snippets} />
      {/* Interactive Captions  */}
      <div className="bg-white  flex items-center justify-center">
        <div
          className="bg-gradient w-full md:rounded-lg md:w-3/5 p-8"
          style={{ width: "90vw" }}
        >
          <div
            className="max-w-4xl mx-auto py-16 px-4 "
            style={{ paddingBottom: -10 }}
          >
            <div className="text-left">
              <div className="flex flex-col items-center justify-center">
                <p className="mt-1  title text-white mb-2">
                  Interactive Captions
                </p>
                <p className="mt-1 text-lg text-white mb-2">
                  Click on captions to hear their pronunciations
                </p>
                <div className="md:-mb-24">
                  {video && video.url && (
                    <VideoPlayer
                      videoRow={video}
                      snippets={snippets}
                      setSnippets={() => {}}
                      videoRef={videoRef}
                    />
                  )}
                  {/* <Image
                    className=""
                    src="/how-it-works/caption-screenshot.png"
                    height={281 * 1.2}
                    width={499 * 1.2}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FeaturesGrid />
      {/* BG-black  */}
      <Conclusion />
    </div>
  );
};

function Conclusion() {
  const { me } = useMe();
  return (
    <div className="">
      <div className="relative overflow-hidden ">
        <div className="pt-10 bg-black sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
          <div className="mx-auto max-w-7xl lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="mt-12 -mb-16 sm:-mb-48 hidden lg:block lg:m-0 lg:relative">
                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                  <img
                    className="w-full max-w-sm mx-auto"
                    src="/how-it-works/hero-pattern.png"
                  />
                </div>
              </div>
              <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                <div className="lg:py-24 pb-20">
                  <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                    <span className="block">Join the video</span>
                    <span className="block bg-gradient text-transparent bg-clip-text">
                      <h1>revolution</h1>
                    </span>
                  </h1>
                  <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    Apply to be an insider creator to upload your own videos. Be
                    the first to enjoy our upcoming monetization and influencer
                    features.
                  </p>
                  <div className="mt-10 sm:mt-12">
                    <form action="#" className="sm:max-w-xl sm:mx-auto lg:mx-0">
                      <div className="flex items-center justify-center lg:justify-start">
                        <div className="p-1 bg-gradient rounded-md">
                          <Link href={me ? "/uploads" : "/login"}>
                            <button
                              type="submit"
                              className="block border-0 border-primary-500 py-3 px-4 rounded-md shadow bg-black text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 focus:ring-offset-gray-900 w-40"
                            >
                              Apply
                            </button>
                          </Link>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Page;

function HeroSection() {
  return (
    <div className="bg-white pb-8 sm:pb-12 lg:pb-12">
      <div className="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-48">
        <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
          <div>
            {/* <div>
              <img
                className="h-11 w-auto"
                src="/pink-logo.png"
                alt="Workflow"
              />
            </div> */}
            <div className="mt-20">
              <div className="mt-6 sm:max-w-xl">
                <h1 className="title text-gray-900">
                  Be Part of the Experience
                </h1>
                <p className="mt-6 text-xl text-gray-500">
                  We made Polygon to explore new ways we can interact with
                  videos. Augment your viewing experience and play with the
                  content.
                </p>
              </div>
              <form action="#" className="mt-12 sm:max-w-lg sm:w-full sm:flex">
                <div className="mt-4 sm:mt-0 sm:ml-3">
                  <Link href="/">
                    <button
                      type="submit"
                      className="block w-full rounded-md border border-transparent px-5 py-3  bg-gradient text-base font-medium text-white shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:px-10"
                    >
                      Explore
                    </button>
                  </Link>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-3">
                  <Link href="/manifesto">
                    <button
                      type="submit"
                      className="block w-full rounded-md border-2 border-black px-5 py-3 bg-white text-base font-medium text-black shadow  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:px-10"
                    >
                      Manifesto
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="sm:mx-auto sm:max-w-3xl sm:px-6">
          <div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div className="hidden sm:block">
              <div className="absolute inset-y-0 left-1/2 w-screen bg-gradient opacity-50 rounded-l-3xl lg:left-80 lg:right-0 lg:w-full" />
              <svg
                className="absolute top-8 right-1/2 -mr-3 lg:m-0 lg:left-0"
                width={404}
                height={392}
                fill="none"
                viewBox="0 0 404 392"
              >
                <defs>
                  <pattern
                    id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x={0}
                      y={0}
                      width={4}
                      height={4}
                      className="text-gray-200"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width={404}
                  height={392}
                  fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
                />
              </svg>
            </div>
            <div className="relative pl-4 -mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full lg:pl-12 ">
              {/* <img
                className="w-full rounded-md  lg:h-full lg:w-auto lg:max-w-none z-0"
                src="/hero-pattern.png"
                alt=""
              /> */}
              <img
                className="w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none z-10"
                src="/how-it-works/hero-screenshot.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CollectionSection = ({ snippets }) => (
  <div className="bg-white">
    <div className="max-w-7xl mx-auto pt-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div className="flex flex-row mt-12 items-center justify-center gap-4 md:gap-8  md:mb-8">
        {snippets.map((snippet, i) => (
          <div
            key={i}
            className={`md:w-80 ${i === 1 && "mb-24"}`}
            style={{ animation: `mover 2.${i * 3}s infinite alternate` }}
          >
            <Image
              src={`/how-it-works/snippets/snippet${i + 1}.svg`}
              height={109}
              width={269}
            />
          </div>
        ))}
      </div>
      <div className="text-center">
        <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">
          Then
        </h2>
        <p className="mt-1 title text-gray-900">Build your collection</p>
        <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
          Add snippets to your card deck, and review them at your own time.
        </p>
        <div className="flex flex-row mt-12 items-center justify-center gap-4 md:gap-8 pb-20 md:pb-16">
          {snippets.map((snippet, i) => (
            <div
              key={i}
              className={`md:w-80 ${i === 1 && "-mb-24"}`}
              style={{
                animation: `mover 2.${i * 3}s infinite alternate`,
                // marginBottom: "-20px",
              }}
            >
              <Image
                src={`/how-it-works/snippets/snippet${i + 4}.svg`}
                height={109}
                width={269}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
