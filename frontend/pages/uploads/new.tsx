import { useSession } from "next-auth/client";

import { useEffect, useRef, useState } from "react";
import { fetcher, useFeed, useMe } from "utils/fetcher";
import Router from "next/router";
import { mutate } from "swr";

import Topbar from "components/Topbar";
import EditField from "components/EditField";
import { UploadList } from "components/UploadList";
import axios from "axios";
import languages from "constants/languages.json";
import { uploadThumbnail, validateFile } from "utils/upload-util";

const App = () => {
  const [session, loading] = useSession();
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [language, setLanguage] = useState("");
  const [useSubtitles, setUseSubtitles] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [duration, setDuration] = useState(0);
  const { me } = useMe();

  const fileRef = useRef(null);
  const thumbnailRef = useRef(null);

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

  const upload = async (e) => {
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
      language,
      useSubtitles,
    });
    if (thumbnail) {
      uploadThumbnail(video, thumbnail);
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
      setSuccess(true);
      setFile(null);
      setThumbnail(null);
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
              <EditField
                state={title}
                setState={setTitle}
                label="Title"
                multiline={false}
              />
              <EditField
                multiline
                state={description}
                setState={setDescription}
                label="Description"
              />
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Language
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <select
                    value={language}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setLanguage(e.target.value);
                    }}
                    // autoComplete="title"
                    className="max-w-lg block w-full shadow-sm focus:ring-primary-300 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  >
                    {Object.keys(languages).map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Use Subtitles
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  {languages && (
                    <select
                      value={useSubtitles ? "Yes" : "No"}
                      onChange={(e) => {
                        setUseSubtitles(
                          e.target.value === "Yes" ? true : false
                        );
                      }}
                      className="max-w-lg block w-full shadow-sm focus:ring-primary-300 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    >
                      {["Yes", "No"].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}
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
                    <div className="max-w-lg flex pt-5 pb-6 border-0 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <div className="flex text-sm text-gray-600">
                          <button
                            className="primary relative flex items-center space-x-2"
                            onClick={() => fileRef.current.click()}
                          >
                            <svg
                              className="mx-auto h-8 w-8 text-gray-400"
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
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              ref={fileRef}
                              onChange={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                const f = e.target.files[0];
                                setFile(f);
                                validateFile(f, setDuration);
                              }}
                              accept="video/mp4, video/mov"
                            />
                          </button>
                          {/* <p className="pl-1">or drag and drop</p> */}
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
                    <div className="max-w-lg flex  pt-5 pb-6 border-0 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <div className="flex text-sm text-gray-600">
                          <button
                            className="primary relative flex items-center space-x-2"
                            onClick={() => thumbnailRef.current.click()}
                          >
                            <svg
                              className="mx-auto h-8 w-8 text-gray-400"
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
                            <span>Upload a thumbnail</span>
                            <input
                              ref={thumbnailRef}
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                setThumbnail(e.target.files[0]);
                              }}
                              accept="image/*"
                            />
                          </button>
                          {/* <p className="pl-1">or drag and drop</p> */}
                        </div>
                        <p className="text-xs text-gray-500">JPEG, PNG, GIF</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={upload}
              className="secondary mt-10 mb-10 float-right md:mr-28"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

function ProgressCard(uploadPercent) {
  return (
    <div className="rounded-md right-0 bottom-0 ">
      <div
        className="bg-blue-400 shadow-md text-xs leading-none py-1.5 text-center text-gray-50 rounded-sm"
        style={{ width: `${uploadPercent}%` }}
      >
        {uploadPercent}%
      </div>
      <div className="flex mt-2">
        <div className="ml-3 flex-1 flex items-center justify-center">
          <div className="flex-shrink-0 ">
            <svg
              className="h-5 w-5 text-blue-400 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-sm text-blue-700">Uploading the video...</p>
        </div>
      </div>
    </div>
  );
}
