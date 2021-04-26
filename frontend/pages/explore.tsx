import { useFeed } from "utils/fetcher";
import Topbar from "../components/Topbar";
import VideoPlayer from "../components/VideoPlayer";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";

const App = () => {
  return (
    <div>
      <Topbar />
      <div className="m-10">
        <div className="mb-8 text-2xl text-gray-700 ">Explore</div>
        <VideoList />
      </div>
    </div>
  );
};

export default App;

function VideoList() {
  const { feed } = useFeed();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {feed ? (
        feed
          .filter((v) => v.isPublic)
          .map((video) => (
            <div
              key={video.id}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-primary-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
            >
              {/* <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={video.imageUrl} alt="" />
          </div> */}
              <div className="flex-1 min-w-0">
                <Link href={`/video/${video.cuid}`}>
                  <a className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">
                      {video.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {video.description}
                    </p>
                  </a>
                </Link>
              </div>
            </div>
          ))
      ) : (
        <div className="p-3">
          <Skeleton count={5} />
        </div>
      )}
    </div>
  );
}
