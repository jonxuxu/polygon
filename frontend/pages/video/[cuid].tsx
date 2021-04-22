import { useFeed, useVideo } from "utils/fetcher";
import Topbar from "../../components/Topbar";

import Link from "next/link";
import { useRouter } from "next/router";
import VideoPlayer from "components/VideoPlayer";
const App = () => {
  const router = useRouter();

  const { video } = useVideo({ cuid: router.query?.cuid });
  return (
    <div>
      <Topbar />
      <div className="m-10">
        <div className="mb-8 text-2xl text-gray-700">
          {video ? video.title : "loading... "}
        </div>
        {video && video.url ? <VideoPlayer videoRow={video} /> : <div></div>}
      </div>
    </div>
  );
};

export default App;
