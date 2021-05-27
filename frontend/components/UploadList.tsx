import { useMe } from "utils/fetcher";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import dayjs from "dayjs";
import { ImagePreview } from "./ImagePreview";

export function UploadList() {
  // const { feed } = useFeed();
  const { me } = useMe();
  const duration = (duration: number) => {
    if (!duration) return "Unknown";
    const hours = Math.floor(duration / 60 / 60) ?? "00";
    const minutes = Math.floor((duration % 3600) / 60) ?? "00";
    return hours + ":" + minutes + ":" + Math.floor(duration % 60);
  };
  return (
    <div className="">
      <div className=" mb-4">
        <div className="flex justify-between">
          <h1 className="text-xl text-gray-700 mb-4">Upload Center</h1>
          <Link href="/uploads/new">
            <button className="secondary   ">Upload a Video</button>
          </Link>
        </div>

        <p className="text-sm ">
          Upload, manage and track your videos here. <br />
          Congrats on being part of the Polygon early access circle!
        </p>
      </div>
      <div className="flex flex-col">
        {me ? (
          <div className="">
            {me.videos.map((video, videoIdx) => (
              <div
                key={videoIdx}
                className={"bg-white shadow-md my-4 rounded-md p-4"}
              >
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 sm:col-span-9 md:col-span-3">
                    <ImagePreview video={video} />
                  </div>

                  {/* Title and description  */}
                  <div className="col-span-12 md:col-span-6 md:flex md:flex-col ">
                    <h1 className="text-xl ">
                      <Link href={`/video/${video.cuid}`}>
                        <a href="#" className="link">
                          {video.title}
                        </a>
                      </Link>
                    </h1>
                    <h2 className="text-md text-gray-600 my-4 min-h-6  md:flex-grow">
                      {video.description}
                    </h2>
                    <div className="flex justify-between text-gray-700 float-bottom">
                      <div>{video.isPublic ? "Public" : "Private"}</div>
                      <div className="">
                        Uploaded {dayjs(video.created).format("MMM d, YYYY")}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-3">
                    <Link href={`/video/${video.cuid}/edit`}>
                      <button className="button primary float-right">
                        Edit
                      </button>
                    </Link>
                    {[
                      { label: "Upload", state: video.upload_state },
                      { label: "Transcode", state: video.transcode_state },
                      { label: "Transcribe", state: video.transcribe_state },
                      { label: "Annotate", state: video.annotate_state },
                    ].map(({ state, label }, i) => (
                      <div
                        key={i}
                        className="my-2 flex gap-1 items-center text-sm"
                      >
                        <div
                          key={i}
                          className={
                            state === "failed"
                              ? "bg-red-500 rounded-full p-1 h-2 w-2"
                              : state === "success"
                              ? "bg-green-500 rounded-full p-1 h-2 w-2"
                              : state === "processing" || state == "pending"
                              ? "bg-yellow-400 rounded-full p-1 h-2 w-2"
                              : "bg-gray-400 rounded-full p-1 h-2 w-2"
                          }
                        >
                          {" "}
                        </div>{" "}
                        {label} {state}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3">
            <Skeleton count={5} />
          </div>
        )}
      </div>
    </div>
  );
}
