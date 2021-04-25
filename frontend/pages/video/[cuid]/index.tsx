import { useFeed, useMe, useVideo } from "utils/fetcher";
import Topbar from "components/Topbar";

import Link from "next/link";
import { useRouter } from "next/router";
import VideoPlayer from "components/VideoPlayer";
const App = () => {
  const router = useRouter();

  const { video } = useVideo({ cuid: router.query?.cuid });
  const { me } = useMe();

  return (
    <div>
      <Topbar />
      <div className="m-10">
        {video ? (
          <div>
            <div className="mb-2 text-2xl text-gray-700">
              {video.title}{" "}
              {me && me.id === video.creator && (
                <Link href={`/video/${video.cuid}/edit`}>
                  <a className="link text-sm ml-2">Edit </a>
                </Link>
              )}
            </div>

            <div className="mb-8 text-md text-gray-700">{video.user.name}</div>
          </div>
        ) : (
          "loading... "
        )}
        {video && video.url ? <VideoPlayer videoRow={video} /> : <div></div>}
      </div>
    </div>
  );
};

export default App;
