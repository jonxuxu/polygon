import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import { mutate } from "swr";
import dayjs from "dayjs";

import { fetcher, useMe, useVideo } from "utils/fetcher";
import { Transcription } from "utils/types";

import Topbar from "components/Topbar";
import VideoPlayer from "components/VideoPlayer";
import { SnippetPreview } from "components/SnippetPreview";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const App = () => {
  const router = useRouter();
  const videoRef = useRef(null);

  const { video } = useVideo({ cuid: router.query?.cuid });
  const { me } = useMe();

  const [snippets, setSnippets] = useState<Transcription[]>([]);

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
                snippets={snippets}
                setSnippets={setSnippets}
                videoRef={videoRef}
              />
              <div className="mx-10">
                <div className="my-2 text-xl text-gray-700">
                  {video.title}{" "}
                  {me && (
                    <button
                      className="primary mt-2 flex "
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
                      <img
                        src="/add-list.svg"
                        alt="save"
                        style={{
                          width: 20,
                          height: 20,
                          cursor: "pointer",
                          marginRight: 10,
                        }}
                      />
                      <span className="text-gray-500">
                        {video.savedBy.find((u) => u.id === me.id)
                          ? "Unsave"
                          : "Save"}
                      </span>
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
        <SnippetPreview snippets={snippets} videoRef={videoRef} />
      </div>
    </div>
  );
};

export default App;
