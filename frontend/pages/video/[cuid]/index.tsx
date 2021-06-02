import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { fetcher, useMe, useVideo } from "utils/fetcher";
import { Transcription } from "utils/types";
import dynamic from "next/dynamic";

import VideoPlayer from "components/VideoPlayer";
import Sidebar from "components/sidebar";
import { ShareButton } from "../../../components/ShareButton";
import { SaveButton } from "../../../components/SaveButton";
import { VideoLoading } from "components/Loading";

const TourNoSSR = dynamic(() => import("reactour"), { ssr: false });

const tourSteps = [
  {
    content:
      "Here's the Polygon video player. This is where the magic happens!",
  },
  {
    selector: "#tourSidebar",
    content: "Here is where you can comment on the video and make snippets.",
    style: { marginRight: 20 },
  },
  {
    selector: "#tourPlayer",
    content: "Click on the video to begin watching.",
  },
  {
    selector: "#tourPlayer",
    content: "When you see any text in the video, pause the video!",
  },
  {
    selector: "#tourToolTip",
    content: "Click on a bubble to read the sign, and create a snippet.",
    style: { marginLeft: 20, marginTop: 20 },
  },
  {
    selector: "#tourTranslation",
    content:
      "Here's the video text in a snippet! You can listen to the text, copy it, or add it to your collection using the buttons on the side.",
  },
  {
    content: "This concludes the tutorial. Have fun exploring Polygon!",
  },
];

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const App = () => {
  const router = useRouter();
  const videoRef = useRef(null);

  const { video, mutate } = useVideo({ cuid: router.query?.cuid });
  const { me } = useMe();

  const [snippets, setSnippets] = useState<Transcription[]>([]);
  const [mobile, setMobile] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    // if (navigator.userAgent) setMobile(true);
    const toMatch = [/Android/i, /iPhone/i, /iPad/i, /iPod/i, /Windows Phone/i];
    const isMobile = toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
    if (isMobile) setMobile(true);
    setTourOpen(router.query.tour === "true");
  }, []);

  return (
    <div>
      {mobile && (
        <div className="bg-yellow-50 text-yellow-700 flex items-center text-center rounded-md m-3 p-1">
          NOTE: Polygon's interactive video player does not yet support mobile
          devices.
        </div>
      )}
      <div
        className="flex"
        style={{ width: "100%", height: "calc(100vh - 64px)" }}
      >
        <div
          style={{ flex: 1, overflowY: "scroll", paddingBottom: 50 }}
          className="hide-scrollbar"
        >
          {video && video.url ? (
            <div>
              <div
                onClick={() => {
                  if (tourStep === 2) {
                    setTourStep(3);
                  } else if (tourStep === 3) {
                    setTimeout(function () {
                      setTourStep(4);
                    }, 500);
                  } else if (tourStep === 4) {
                    setTimeout(function () {
                      setTourStep(5);
                    }, 500);
                  }
                }}
              >
                <VideoPlayer
                  videoRow={video}
                  snippets={snippets}
                  setSnippets={setSnippets}
                  videoRef={videoRef}
                />
              </div>
              <div className="mx-3 sm:mx-10">
                <div className="mt-6 mb-2 text-xl text-gray-700">
                  {video.title}
                  {me && me.id === video.creator && (
                    <Link href={`/video/${video.cuid}/edit`}>
                      <a className="link text-sm ml-2">Edit </a>
                    </Link>
                  )}
                </div>
                <div className="text-gray-500 text-sm flex flex-row items-center justify-between mt-3">
                  <span className="">
                    {video.views + video.viewBoost} views - {/* @ts-ignore */}
                    {dayjs(video.created).from(dayjs())}
                  </span>
                  <div>
                    <SaveButton />
                    <ShareButton />
                  </div>
                </div>
                <hr className="mb-4" />
                <div className="mb text-md text-gray-700 mb-2 flex">
                  <img
                    className="h-8 w-8 rounded-full mr-2"
                    src={video.user.image}
                    alt="User creator"
                  />
                  {video.user.name}
                  <br />
                </div>
                <span className="text-sm text-gray-500">
                  {video.description}
                </span>
                {/* Save button */}
                <br />
                {/* <CommentsSection video={video} /> */}
              </div>
            </div>
          ) : (
            <VideoLoading />
          )}
        </div>
        <Sidebar snippets={snippets} videoRef={videoRef} />
      </div>
      <TourNoSSR
        // @ts-ignore
        showCloseButton={false}
        steps={tourSteps}
        isOpen={tourOpen}
        onRequestClose={() => setTourOpen(false)}
        maskSpace={0}
        getCurrentStep={(curr) => {
          setTourStep(curr);
        }}
        goToStep={tourStep}
        rounded={5}
      />
    </div>
  );
};

// const CommentsSection({video}) =>

export default App;
