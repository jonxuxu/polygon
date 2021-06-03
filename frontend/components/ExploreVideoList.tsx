import { useRouter } from "next/router";
import { useFeed } from "utils/fetcher";
import Link from "next/link";
import dayjs from "dayjs";
import dynamic from "next/dynamic";

import { ImagePreview } from "./ImagePreview";
import { useEffect, useState } from "react";
import { VideoLoader } from "./VideoLoader";
import { TourBanner } from "./TourBanner";

const TourNoSSR = dynamic(() => import("reactour"), { ssr: false });

const tourSteps = [
  {
    content: "This is the main video explorer on Polygon.",
  },
  {
    selector: "#tourVid",
    content: "Click on this video to check it out!",
  },
];

export function ExploreVideoList({ initialFeed }) {
  const router = useRouter();

  const { feed } = useFeed(initialFeed);
  const [search, setSearch] = useState("");
  const [tourOpen, setTourOpen] = useState(false);
  const [language, setLanguage] = useState("All");

  useEffect(() => {
    setTourOpen(router.query.tour === "true");
  }, [router.query]);

  return (
    <div>
      {router.query.tour !== "true" && <TourBanner />}

      <div className="m-2 sm:m-10 mt-8">
        <div className="mb-4 sm:mx-2 flex flex-row">
          <input
            type="text"
            name="search"
            id="search"
            className="text-input "
            placeholder="Search Videos... "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {feed && (
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
              }}
              // autoComplete="title"
              className="ml-1 md:ml-2 max-w-lg block w-2/3 md:w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
            >
              <option key={"All"} value={"All"}>
                All Languages
              </option>
              {Array.from(new Set(feed.map((v) => v.language))).map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="grid grid-cols-12 sm:gap-6">
          {feed
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
                      v.user.name
                        .toLowerCase()
                        .includes(search.toLowerCase())) &&
                    (language === "All" || v.language === language)
                )
                .map((video, i) => (
                  <div
                    key={video.id}
                    className="col-span-6 md:col-span-4 xl:col-span-3 p-2 relative rounded-lg bg-white  flex space-x-3 hover:border-primary-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-300"
                  >
                    <div
                      className="flex-1 min-w-0"
                      id={i === 0 ? "tourVid" : null}
                    >
                      <Link
                        href={{
                          pathname: `/video/${video.cuid}`,
                          query: tourOpen && i === 0 && { tour: tourOpen },
                        }}
                      >
                        <a className="focus:outline-none">
                          <ImagePreview video={video} />
                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          />
                          <p className="text-md sm:text-lg md:text-xl font-medium text-gray-700 mt-2 line-clamp overflow-hidden">
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
        <TourNoSSR
          // @ts-ignore
          steps={tourSteps}
          isOpen={tourOpen}
          onRequestClose={() => setTourOpen(false)}
          rounded={5}
        />
      </div>
    </div>
  );
}
