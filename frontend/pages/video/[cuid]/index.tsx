import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import tinycolor from "tinycolor2";
import { mutate } from "swr";
import dayjs from "dayjs";

import { fetcher, useMe, useVideo } from "utils/fetcher";

import Topbar from "components/Topbar";
import VideoPlayer, { Transcription } from "components/VideoPlayer";
import { TranslationActionIcons } from "components/TranslationActionIcons";
import languages from "constants/translateLanguages.json";

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
        <Snippets snippets={snippets} videoRow={video} />
      </div>
    </div>
  );
};

const Snippets = ({ snippets, videoRow }) => {
  return (
    <div
      style={{
        overflowY: "scroll",
        backgroundColor: "#F9F9F9",
        borderRadius: 10,
        width: 400,
      }}
      className="mt-10 pt-5"
    >
      <h2 style={{ paddingLeft: 70 }}>Your Snippets</h2>
      {snippets.length === 0 && <div>You have no snippets</div>}

      {snippets.map((t, i) => (
        <div style={{ display: "flex" }}>
          <div>
            <div
              style={{
                border: "1px solid #EE3699",
                width: 50,
                borderRadius: 10,
                fontSize: 10,
                textAlign: "center",
                marginLeft: 10,
                marginRight: 10,
                marginTop: 8,
                visibility:
                  i === 0 || snippets[i - 1].time !== snippets[i].time
                    ? "initial"
                    : "hidden",
              }}
            >
              {new Date(t.time * 1000).toISOString().substr(11, 8)}
            </div>
          </div>
          <div
            key={i}
            className="border-2 rounded-md py-3 px-4 my-2 flex justify-between"
            style={{
              borderColor: t.color,
              flexGrow: 1,
              backgroundColor: "white",
            }}
          >
            <span style={{ fontFamily: "Arial" }}>
              <span
                style={{
                  fontSize: 18,
                  color: tinycolor(t.color).darken(20),
                }}
              >
                {t.original}
              </span>
              <br />
              <span style={{ fontSize: 12 }}>{t.translatedText}</span>
            </span>
            <TranslationActionIcons
              translationText={t}
              video={videoRow}
              time={t.time}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
