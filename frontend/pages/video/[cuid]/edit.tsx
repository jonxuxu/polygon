import { fetcher, useFeed, useVideo } from "utils/fetcher";
import Topbar from "components/Topbar";

import { useState } from "react";
import { useRouter } from "next/router";
import EditField from "components/EditField";
import { useEffect } from "react";
import { useSession } from "next-auth/client";
import Router from "next/router";
import { mutate } from "swr";
const App = () => {
  const router = useRouter();

  const { video } = useVideo({ cuid: router.query?.cuid });
  const [session] = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Make sure only the owner can edit videos
    if (video) {
      setTitle(video.title);
      setDescription(video.description);
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
                  id: video.id,
                });
                mutate("/api/video/" + video.cuid);
              }}
            >
              <div className="space-y-6 sm:space-y-5 mb-10">
                <EditField state={title} setState={setTitle} label="Title" />
                <EditField
                  state={description}
                  setState={setDescription}
                  label="Description"
                />
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
          <div></div>
        )}
      </div>
    </div>
  );
};

export default App;
