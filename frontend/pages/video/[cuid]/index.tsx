import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import { mutate } from "swr";
import dayjs from "dayjs";

import { fetcher, useMe, useVideo } from "utils/fetcher";

import Topbar from "components/Topbar";
import VideoPlayer, { Transcription } from "components/VideoPlayer";
import languages from "constants/translateLanguages.json";
import { SnippetPreview } from "components/SnippetPreview";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const App = () => {
  const router = useRouter();

  const { video } = useVideo({ cuid: router.query?.cuid });
  const { me } = useMe();

  const [targetLang, setTargetLang] = useState("en");
  const [snippets, setSnippets] = useState<Transcription[]>([]);

  const Dropdown = () => {
    return (
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        {languages && (
          <select
            value={targetLang}
            onChange={(e) => {
              console.log(e.target.value);
              setTargetLang(e.target.value);
            }}
            // autoComplete="title"
            className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* {video && video.url && <VideoPlayer videoRow={video} />} */}
      <Topbar />
      <div className="flex" style={{ width: "100%" }}>
        <div style={{ flex: 1 }}>
          {video && video.url ? (
            <div>
              <VideoPlayer
                videoRow={video}
                targetLang={targetLang}
                snippets={snippets}
                setSnippets={setSnippets}
              />
              <div className="mx-10">
                <div className="my-2 text-2xl text-gray-700 ">
                  {video.title}{" "}
                  {me && (
                    <button
                      className="primary mt-2"
                      onClick={async () => {
                        const savedBy = video.savedBy.find(
                          (u) => u.id === me.id
                        )
                          ? { disconnect: { email: me.email } }
                          : { connect: { email: me.email } };
                        await fetcher("/api/video/update", {
                          id: video.id,
                          savedBy,
                        });
                        await mutate("/api/video/" + video.cuid);
                      }}
                    >
                      {video.savedBy.find((u) => u.id === me.id)
                        ? "Unsave"
                        : "Save"}
                    </button>
                  )}
                  {me && me.id === video.creator && (
                    <Link href={`/video/${video.cuid}/edit`}>
                      <a className="link text-sm ml-2">Edit </a>
                    </Link>
                  )}
                </div>
                <span className="text-gray-500">
                  {" "}
                  {video.views} views - {/* @ts-ignore */}
                  {dayjs(video.created).from(dayjs())}
                </span>
                <hr className="my-4" />

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
        <SnippetPreview snippets={snippets} videoRow={video} />
      </div>
    </div>
  );
};

export default App;
