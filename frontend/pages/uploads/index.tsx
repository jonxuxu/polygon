import Topbar from "../../components/Topbar";
import VideoPlayer from "../../components/VideoPlayer";
import { useSession } from "next-auth/client";
import { CheckCircleIcon } from "@heroicons/react/solid";

import { useEffect, useState } from "react";
import { fetcher, useFeed, useMe } from "utils/fetcher";
import Link from "next/link";

const App = () => {
  const [session, loading] = useSession();
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);

  useEffect(() => {
    return () => {
      if (video && !success)
        fetcher(`/api/video/update`, {
          id: video.id,
          upload_state: "failed",
        });
    };
  }, []);

  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);
    const { response, video } = await fetcher(`/api/video/upload-url`, {
      file: filename,
      email: session.user.email,
    });
    setVideo(video);
    const { url, fields } = response;
    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value);
    });

    const upload = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (upload.ok) {
      console.log("Uploaded successfully!", upload);
      setSuccess(true);
      await fetcher(`/api/video/update`, {
        id: video.id,
        upload_state: "success",
      });
    } else {
      console.error("Upload failed.");
    }
  };
  return (
    <div>
      <Topbar />
      <div className="">
        <div className="m-10">
          {/* <div>
            <h2 className="text-gray-700">Give your file a name</h2>
            <input type="text" className="rounded-md border-gray-500 mb-2" />
          </div> */}
          {success && (
            <div className="rounded-md bg-green-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon
                    className="h-5 w-5 text-green-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Video Uploaded!
                  </h3>
                </div>
              </div>
            </div>
          )}
          <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Upload a Video
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Add a title, description, and file to upload.
              </p>
            </div>
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Title
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    name="title"
                    id="title"
                    // autoComplete="title"
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Description
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                    name="description"
                    id="description"
                    // autoComplete="description"
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Upload
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={uploadPhoto}
                            accept="video/*"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">MP4, MOV</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <UploadList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

function UploadList() {
  // const { feed } = useFeed();
  const { me } = useMe();
  return (
    <div className="">
      <h1 className="text-xl text-gray-700 mb-4">Uploads</h1>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              {me ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Upload State
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Transcode State
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Transcription State
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {me.videos.map((video, videoIdx) => (
                      <tr
                        key={video.id}
                        className={
                          videoIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {video.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {video.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {video.upload_state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {video.transcode_state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {video.transcription_state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </a>
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
