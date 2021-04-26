import { fetcher, useFeed, useMe, useVideo } from "utils/fetcher";
import Topbar from "components/Topbar";

import Link from "next/link";
import { useRouter } from "next/router";
import VideoPlayer from "components/VideoPlayer";
import Skeleton from "react-loading-skeleton";

const App = () => {
  const router = useRouter();

  const { video } = useVideo({ cuid: router.query?.cuid });
  const { me } = useMe();

  return (
    <div>
      <Topbar />
      <div className="m-10">
        {video && video.url ? (
          <div>
            <VideoPlayer videoRow={video} />
            <div className="mb-2 text-2xl text-gray-700">
              {video.title}{" "}
              {me && me.id === video.creator && (
                <Link href={`/video/${video.cuid}/edit`}>
                  <a className="link text-sm ml-2">Edit </a>
                </Link>
              )}
            </div>

            <div className="mb text-md text-gray-700 mb-2">
              {video.user.name}
            </div>
            {/* Save button */}
            {/* <button
              className="primary mt-2"
              onClick={() => {
                fetcher("/api/video/update", {
                  savedBy: { connect: { email: me.email } },
                });
              }}
            >
              {video.savedBy.find((u) => u.id === me.id) ? "Unsave" : "Save"}
            </button> */}
          </div>
        ) : (
          <div className="p-3">
            <Skeleton count={5} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
