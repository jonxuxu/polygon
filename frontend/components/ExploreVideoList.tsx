import { useFeed } from "utils/fetcher";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import dayjs from "dayjs";
import styled from "styled-components";

import SpeechLanguages from "../constants/speechLanguages.json";

export function ExploreVideoList() {
  const { feed } = useFeed();
  return (
    <div className="grid grid-cols-12 gap-6">
      {feed ? (
        feed
          .filter((v) => v.isPublic && v.transcode_state === "success")
          .map((video) => (
            <div
              key={video.id}
              className="col-span-6 md:col-span-4 xl:col-span-3 p-2 relative rounded-lg bg-white  flex space-x-3 hover:border-primary-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-300"
            >
              <div className="flex-1 min-w-0">
                <Link href={`/video/${video.cuid}`}>
                  <a className="focus:outline-none">
                    <div
                      className="h-100 w-100"
                      style={{ position: "relative" }}
                    >
                      <Image
                        width={500}
                        height={300}
                        className="rounded-md mx-1 object-cover shadow-sm "
                        src={
                          video.thumbnail_url ?? "/default-video-thumbnail.jpg"
                        }
                        alt="Thumbnail"
                      />
                      {video.language &&
                        SpeechLanguages.some(
                          (lang) => lang.code === video.language
                        ) && (
                          <GreyPill
                            style={{
                              position: "absolute",
                              bottom: 10,
                              left: 7,
                            }}
                          >
                            {
                              SpeechLanguages.filter(
                                (lang) => lang.code === video.language
                              )[0].name
                            }
                          </GreyPill>
                        )}
                      {video.duration && (
                        <GreyPill
                          style={{ position: "absolute", bottom: 10, right: 7 }}
                        >
                          {new Date(video.duration * 1000)
                            .toISOString()
                            .substr(11, 8)}
                        </GreyPill>
                      )}
                    </div>
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-xl font-medium text-gray-700 mt-2">
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
                        {video.views} views | {/* @ts-ignore */}
                        {dayjs(video.created).from(dayjs())}
                      </p>
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          ))
      ) : (
        <div className="p-3 col-span-6">
          <Skeleton count={5} />
        </div>
      )}
    </div>
  );
}

const GreyPill = styled.div`
  background-color: rgba(40, 40, 40, 0.8);
  color: white;
  border-radius: 3px;
  font-size: 11px;
  padding: 2px 6px;
`;
