import { useFeed } from "utils/fetcher";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import dayjs from "dayjs";

export function ExploreVideoList() {
  const { feed } = useFeed();
  return (
    <div className="grid grid-cols-6 gap-6">
      {feed ? (
        feed
          .filter((v) => v.isPublic && v.transcode_state === "success")
          .map((video) => (
            <div
              key={video.id}
              className="col-span-6 md:col-span-3 xl:col-span-2 p-2 relative rounded-lg bg-white shadow-sm flex items-center space-x-3 hover:border-primary-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
            >
              <div className="flex-1 min-w-0">
                <Link href={`/video/${video.cuid}`}>
                  <a className="focus:outline-none">
                    <div className="h-100 w-100">
                      <Image
                        width={500}
                        height={300}
                        className="rounded-md mr-2 object-cover shadow-sm "
                        src={
                          video.thumbnail_url ?? "/default-video-thumbnail.jpg"
                        }
                        alt="Thumbnail"
                      />
                    </div>
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-2xl font-medium text-gray-700 mt-2">
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
