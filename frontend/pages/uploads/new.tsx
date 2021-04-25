import { useSession } from "next-auth/client";
import { CheckCircleIcon } from "@heroicons/react/solid";

import { useEffect, useState } from "react";
import { fetcher, useFeed, useMe } from "utils/fetcher";
import Router from "next/router";
import { mutate } from "swr";

import Topbar from "components/Topbar";
import EditField from "components/EditField";
import { UploadList } from "components/UploadList";
import axios from "axios";

function validateFile(file, setDuration) {
  var video = document.createElement("video");
  video.preload = "metadata";
  video.onloadedmetadata = function () {
    window.URL.revokeObjectURL(video.src);
    console.log("duration: ", video.duration);
    setDuration(video.duration);
  };

  video.src = URL.createObjectURL(file);
}

const App = () => {
  const [session, loading] = useSession();
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [duration, setDuration] = useState(0);
  const { me } = useMe();

  useEffect(() => {
    if (!loading && !session) Router.push("/login");
    return () => {
      if (video && !success)
        fetcher(`/api/video/update`, {
          id: video.id,
          upload_state: "failed",
        });
    };
  }, []);

  const uploadPhoto = async (e) => {
    // const file = e.target.files[0];
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const filename = encodeURIComponent(file.name);
    mutate(
      "/api/me",
      {
        ...me,
        videos: [
          { title, description, duration, upload_state: "pending" },
          ...me.videos,
        ],
      },
      false
    );
    const { response, video } = await fetcher(`/api/storage/upload-url`, {
      file: filename,
      email: session.user.email,
      title,
      description,
      duration,
    });
    if (thumbnail) {
      const { response: t } = await fetcher(`/api/storage/upload-thumbnail`, {
        cuid: video.cuid,
      });
      const { url, fields } = t;
      const tData = new FormData();

      Object.entries({ ...fields, file: thumbnail }).forEach(([key, value]) => {
        // @ts-ignore
        tData.append(key, value);
      });

      const u = await fetch(url, {
        method: "POST",
        body: tData,
      });
      if (u.ok) {
        console.log("thumbnail uploaded", t);
        fetcher("/api/video/update", {
          thumbnail_url: t.url + video.cuid,
          id: video.id,
        });
      }
    }
    setVideo(video);

    const { url, fields } = response;
    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value);
    });

    const res = await axios.request({
      method: "post",
      url: url,
      data: formData,
      onUploadProgress: (p) => {
        setUploadPercent(Math.round((p.loaded / p.total) * 100));
      },
    });

    if (res.status >= 200 && res.status < 300) {
      console.log("Uploaded successfully!");
      setSuccess(true);
      setFile(null);
      setTitle("");
      setDescription("");
      setDuration(0);

      await fetcher(`/api/video/update`, {
        id: video.id,
        upload_state: "success",
      });
      mutate("/api/me");
      Router.push("/uploads");
    } else {
      console.error("Upload failed.");
    }
    setUploading(false);
  };
  return (
    <div>
      <Topbar />
      {uploading && ProgressCard(uploadPercent)}

      <div className="">
        <div className="mx-10">
          {/* <div>
            <h2 className="text-gray-700">Give your file a name</h2>
            <input type="text" className="rounded-md border-gray-500 mb-2" />
          </div> */}
          {video && (
            <div
              className={`rounded-md ${
                success ? "bg-green-50" : "bg-yellow-50"
              } p-4 my-4`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {success && (
                    <CheckCircleIcon
                      className="h-5 w-5 text-green-400"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="ml-3">
                  <h3
                    className={`text-sm font-medium text-${
                      success ? "green" : "yellow"
                    }-800`}
                  >
                    {success
                      ? "Video Uploaded!"
                      : "Video uploading - please don't close this tab!"}
                  </h3>
                </div>
              </div>
            </div>
          )}
          <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
            <form onSubmit={uploadPhoto}>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Upload a Video
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Add a title, description, and file to upload.
                </p>
              </div>
              <div className="space-y-6 sm:space-y-5">
                <EditField state={title} setState={setTitle} label="Title" />
                <EditField
                  state={description}
                  setState={setDescription}
                  label="Description"
                />

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Upload
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    {file ? (
                      <div>
                        {file.name}{" "}
                        <a
                          onClick={() => setFile(null)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Remove
                        </a>
                      </div>
                    ) : (
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
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={(e) => {
                                  const f = e.target.files[0];
                                  setFile(f);
                                  validateFile(f, setDuration);
                                }}
                                accept="video/*"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">MP4, MOV</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Thumbnail  */}
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Upload a Thumbnail
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    {thumbnail ? (
                      <div>
                        {thumbnail.name}{" "}
                        <a
                          onClick={() => setFile(null)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Remove
                        </a>
                      </div>
                    ) : (
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
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                              <span>Upload a thumbnail</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={(e) =>
                                  setThumbnail(e.target.files[0])
                                }
                                accept="image/*"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            JPEG, PNG, GIF
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button type="submit" className="primary mt-10 mb-10">
                Upload
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
function ProgressCard(uploadPercent) {
  return (
    <div className="rounded-md bg-blue-50 p-4 right-0 bottom-0">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-blue-700">Uploading the video...</p>
          <p>{`${uploadPercent}%`}</p>
          <div className="h-3 relative max-w-xl rounded-full overflow-hidden">
            <div className="w-full h-full bg-gray-200 absolute"></div>
            <div
              id="bar"
              className="h-full bg-green-500 relative w-0 "
              style={{ width: `${uploadPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
