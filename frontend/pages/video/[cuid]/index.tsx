import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import dayjs from "dayjs";

import { useMe, useVideo } from "utils/fetcher";
import { Transcription } from "utils/types";

import Topbar from "components/Topbar";
import VideoPlayer from "components/VideoPlayer";
import { SnippetPreview } from "components/SnippetPreview";
import { ShareButton } from "./ShareButton";
import { SaveButton } from "./SaveButton";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const App = () => {
  const router = useRouter();
  const videoRef = useRef(null);

  const { video } = useVideo({ cuid: router.query?.cuid });
  const { me } = useMe();

  const [snippets, setSnippets] = useState<Transcription[]>([]);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    // if (navigator.userAgent) setMobile(true);
    const toMatch = [/Android/i, /iPhone/i, /iPad/i, /iPod/i, /Windows Phone/i];
    const isMobile = toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
    if (isMobile) setMobile(true);
  }, []);

  return (
    <div>
      {/* {video && video.url && <VideoPlayer videoRow={video} />} */}
      <Topbar />
      {mobile && (
        <div className="bg-yellow-50 text-yellow-700 flex items-center text-center rounded-md m-3 p-1">
          NOTE: Polygon's interactive video player does not yet support mobile
          devices.
        </div>
      )}
      <div className="flex" style={{ width: "100%" }}>
        <div style={{ flex: 1 }}>
          {video && video.url ? (
            <div>
              <VideoPlayer
                videoRow={video}
                snippets={snippets}
                setSnippets={setSnippets}
                videoRef={videoRef}
              />
              <div className="mx-10">
                <div className="my-2 text-xl text-gray-700">
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
              </div>
            </div>
          ) : (
            <div className="p-3 m-10">
              <Skeleton count={5} />
            </div>
          )}
        </div>
        <SnippetPreview snippets={snippets} videoRef={videoRef} />
      </div>
    </div>
  );
};

export default App;
