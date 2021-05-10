import { fetcher, useFeed, useVideo } from "utils/fetcher";
import Topbar from "components/Topbar";

import { useState } from "react";
import { useRouter } from "next/router";
import EditField from "components/EditField";
import { useEffect } from "react";
import { useSession } from "next-auth/client";
import Router from "next/router";
import { mutate } from "swr";
import Skeleton from "react-loading-skeleton";
const App = () => {
  const router = useRouter();

  const { video } = useVideo({ cuid: router.query?.cuid });
  const [session] = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    // Make sure only the owner can edit videos
    if (video) {
      setTitle(video.title);
      setDescription(video.description);
      setIsPublic(video.isPublic);
    }
    if (video && session) {
      if (video.user.email !== session.user.email)
        Router.push(`/video/${video.cuid}`);
    }
  }, [video]);
  return (
    <div>
      <Topbar />
      <div className="m-10">
        {video ? (
          <div>
            <div className="mb-2 text-2xl text-gray-700">{video.title}</div>
            <div className="mb-8 text-md text-gray-700">
              {video.description}
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await fetcher("/api/video/update", {
                  title,
                  description,
                  isPublic,
                  id: video.id,
                });
                mutate("/api/video/" + video.cuid);
              }}
            >
              <div className="space-y-6 sm:space-y-5 mb-10">
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
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="isPublic"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Privacy
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <select
                    value={isPublic ? "Public" : "Private"}
                    onChange={(e) =>
                      setIsPublic(e.target.value === "Public" ? true : false)
                    }
                    // autoComplete="title"
                    className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  >
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </div>
              </div>
              <button className="primary mt-10" type="submit">
                Submit
              </button>
              <button
                className="danger"
                type="button"
                onClick={async () => {
                  await fetcher("/api/video/delete", { id: video.id });
                  Router.push("/uploads");
                }}
              >
                Delete
              </button>
            </form>
          </div>
        ) : (
          <div>{/* <Skeleton count={3}></Skeleton> */}</div>
        )}
      </div>
    </div>
  );
};

export default App;
