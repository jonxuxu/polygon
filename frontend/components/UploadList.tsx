import { useMe } from "utils/fetcher";
import Link from "next/link";

export function UploadList() {
  // const { feed } = useFeed();
  const { me } = useMe();
  return (
    <div className="">
      <div className="flex mb-3">
        <h1 className="text-xl text-gray-700 mb-4">Uploads</h1>
        <Link href="/uploads/new">
          <button className="primary  ml-5 ">Upload New Video</button>
        </Link>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              {me ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Title",
                        "Description",
                        "Duration (sec)",
                        "Thumbnail",
                        "Upload State",
                        "Transcode State",
                        "Transcription State",
                      ].map((title) => (
                        <th
                          key={title}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {title}
                        </th>
                      ))}

                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {me.videos.map((video, videoIdx) => (
                      <tr
                        key={videoIdx}
                        className={
                          videoIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }
                      >
                        {[
                          <Link href={`/video/${video.cuid}`}>
                            <a href="#" className="link">
                              {video.title}
                            </a>
                          </Link>,
                          video.description,
                          video.duration
                            ? Math.ceil(video.duration) + " s"
                            : "Unknown",
                          video.thumbnail_url,
                          video.upload_state,
                          video.transcode_state,
                          video.transcribe_state,
                        ].map((state, i) => (
                          <td
                            key={i}
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              i == 0
                                ? "font-medium text-gray-900 "
                                : "text-gray-500"
                            }`}
                          >
                            {state}
                          </td>
                        ))}

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/video/${video.cuid}/edit`}>
                            <a href="#" className="link">
                              Edit
                            </a>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>loading...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
