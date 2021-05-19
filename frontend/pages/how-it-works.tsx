import Topbar from "../components/Topbar";
import Image from "next/image";
import { useRef } from "react";
import { SnippetPreview, Snippet } from "components/SnippetPreview";
import { Transcription } from "../utils/types";
import { ChevronRightIcon, StarIcon } from "@heroicons/react/solid";

const Page = () => {
  const voiceRef = useRef(null);

  const snippet: Transcription = {
    original: "芋圓現做品質看得到",
    color: "red",
    translatedText: "You can see the quality of taro balls freshly made",
    time: 18,
    detectedSourceLanguage: "zh",
  };

  return (
    <div>
      <Topbar />
      <HeroSection />
      <audio ref={voiceRef} />
      <div className="">
        <div className="relative my-16">
          <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Learn through immersion
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
            Learn a foreign language by being there. [Pause] the video to
            interact with signs and speech. Translate, copy, and listen, all
            within the player.
          </p>
        </div>
        {/* <div className="m-10 md:w-4/5 flex">
          <div className="mb-8 text-3xl text-gray-700 w-1/2">
            Learn through immersion
          </div>
          <div className="my-4 w-1/2">
            Learn a foreign language by being there. [Pause] the video to
            interact with signs and speech. Translate, copy, and listen, all
            within the player.
          </div>
        </div> */}
        <div className="flex gap-6">
          <Image src="/how-it-works/player1.png" height={281} width={499} />
          <Image src="/how-it-works/player2.png" height={281} width={499} />
          <Image src="/how-it-works/player3.png" height={281} width={499} />
        </div>
      </div>
      {/* Build your collection  */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">
              Then
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Build your collection
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Add snippets to your card deck, and review them at your own time.
            </p>
            <div className="w-80 animate-bounce">
              <Snippet
                t={snippet}
                isFirst={false}
                videoRef={null}
                isPreview={true}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Interactive Captions  */}
      <div className="bg-white p-8 flex items-center justify-center">
        <div className="bg-gradient-to-br from-primary-400 to-fuchsia-400 rounded-lg w-4/5">
          <div
            className="max-w-7xl mx-auto py-16 px-4 "
            style={{ paddingBottom: -10 }}
          >
            <div className="text-left">
              <div className="flex flex-col items-center justify-center">
                <p className="mt-1 text-4xl font-extrabold text-white mb-2">
                  Interactive Captions
                </p>
                <Image
                  src="/how-it-works/caption-screenshot.png"
                  height={281 * 1.2}
                  width={499 * 1.2}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* BG-black  */}
      <Conclusion />
    </div>
  );
};

function Conclusion() {
  return (
    <div className="">
      <div className="relative overflow-hidden ">
        <div className="pt-10 bg-gray-900 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
          <div className="mx-auto max-w-7xl lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                <div className="lg:py-24">
                  <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                    <span className="block">Join the video</span>
                    <span className="block bg-gradient-to-br from-primary-400 to-purple-500 text-transparent bg-clip-text">
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
                      <div className="flex items-center justify-center">
                        <div className="p-1 bg-gradient-to-br from-primary-400 to-purple-700 rounded-md">
                          <button
                            type="submit"
                            className="block border-0 border-primary-500 py-3 px-4 rounded-md shadow bg-black text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 focus:ring-offset-gray-900 w-40"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative">
                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                  {/* Illustration taken from Lucid Illustrations: https://lucid.pixsellz.io/ */}
                  <img
                    className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                    src="/how-it-works/hero-pattern.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* More main page content here... */}
        <div className="bg-primary-400 text-white h-40 flex items-center p-20 text-xl">
          <img src="/logo.png" className="h-10" />
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
            <div>
              <img
                className="h-11 w-auto"
                src="/pink-logo.png"
                alt="Workflow"
              />
            </div>
            <div className="mt-20">
              <div className="mt-6 sm:max-w-xl">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
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
                  <button
                    type="submit"
                    className="block w-full rounded-md border border-transparent px-5 py-3  bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-base font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:px-10"
                  >
                    Notify me
                  </button>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-3">
                  <button
                    type="submit"
                    className="block w-full rounded-md border border-transparent px-5 py-3 bg-white text-base font-medium text-black shadow  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:px-10"
                  >
                    Manifesto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="sm:mx-auto sm:max-w-3xl sm:px-6">
          <div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div className="hidden sm:block">
              <div className="absolute inset-y-0 left-1/2 w-screen bg-primary-50 rounded-l-3xl lg:left-80 lg:right-0 lg:w-full" />
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
