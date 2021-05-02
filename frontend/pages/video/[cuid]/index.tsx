import React, { useState } from "react";
import { fetcher, useMe, useVideo } from "utils/fetcher";
import Topbar from "components/Topbar";

import Link from "next/link";
import { useRouter } from "next/router";
import VideoPlayer from "components/VideoPlayer";
import Skeleton from "react-loading-skeleton";

import languages from "constants/translateLanguages.json";
import { mutate } from "swr";

const App = () => {
  const router = useRouter();

  const { video } = useVideo({ cuid: router.query?.cuid });
  const { me } = useMe();

  const [targetLang, setTargetLang] = useState("en");

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
      <div className="m-10">
        {video && video.url ? (
          <div>
            <VideoPlayer videoRow={video} targetLang={targetLang} />
            <div className="mb-2 text-2xl text-gray-700">
              {video.title}{" "}
              {me && me.id === video.creator && (
                <Link href={`/video/${video.cuid}/edit`}>
                  <a className="link text-sm ml-2">Edit </a>
                </Link>
              )}
            </div>

            <div className="mb text-md text-gray-700 mb-2">
              {video.user.name}
            </div>
            {/* Save button */}
            {me && (
              <button
                className="primary mt-2"
                onClick={async () => {
                  const savedBy = video.savedBy.find((u) => u.id === me.id)
                    ? { disconnect: { email: me.email } }
                    : { connect: { email: me.email } };
                  await fetcher("/api/video/update", {
                    id: video.id,
                    savedBy,
                  });
                  await mutate("/api/video/" + video.cuid);
                }}
              >
                {video.savedBy.find((u) => u.id === me.id) ? "Unsave" : "Save"}
              </button>
            )}
            {/* Language specifier */}
            <div>Choose your target language</div>
            <Dropdown />
          </div>
        ) : (
          <div className="p-3">
            <Skeleton count={5} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
