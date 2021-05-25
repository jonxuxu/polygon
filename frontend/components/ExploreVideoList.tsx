import { useFeed } from "utils/fetcher";
import Link from "next/link";
import dayjs from "dayjs";

import { ImagePreview } from "./ImagePreview";
import { useState } from "react";
import VideoLoader from "./VideoLoader";

export function ExploreVideoList() {
  const { feed } = useFeed();
  const [search, setSearch] = useState("");
  return (
    <div>
      <div className="mb-4 mx-2">
        <input
          type="text"
          name="search"
          id="search"
          className="text-input"
          placeholder="Search Videos... "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-12 gap-6">
        {feed // && false
          ? feed
              .filter(
                (v) =>
                  v.isPublic &&
                  v.transcode_state === "success" &&
                  (!search ||
                    v.title.toLowerCase().includes(search.toLowerCase()) ||
                    v.description
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    v.language.toLowerCase().includes(search.toLowerCase()) ||
                    v.user.name.toLowerCase().includes(search.toLowerCase()))
              )
              .map((video) => (
                <div
                  key={video.id}
                  className="col-span-6 md:col-span-4 xl:col-span-3 p-2 relative rounded-lg bg-white  flex space-x-3 hover:border-primary-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-300"
                >
                  <div className="flex-1 min-w-0">
                    <Link href={`/video/${video.cuid}`}>
                      <a className="focus:outline-none">
                        <ImagePreview video={video}></ImagePreview>
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-lg md:text-xl font-medium text-gray-700 mt-2 line-clamp overflow-hidden">
                          {video.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {video.description}
                        </p>
                        <div className="flex items-center align-middle mt-4">
                          <img
                            className="h-8 w-8 rounded-full mr-2"
                            src={video.user.image}
                            alt="User creator"
                          />
                          <p className="text-sm text-gray-500 truncate">
                            {video.user.name}
                            <br />
                            {video.views + video.viewBoost} views |{" "}
                            {/* @ts-ignore */}
                            {dayjs(video.created).from(dayjs())}
                          </p>
                        </div>
                      </a>
                    </Link>
                  </div>
                </div>
              ))
          : Array(10)
              .fill(0)
              .map((l, i) => <VideoLoader key={i} />)}
      </div>
    </div>
  );
}
