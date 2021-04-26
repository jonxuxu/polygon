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
          .filter((v) => v.isPublic && v.transcode_state === "success")
          .map((video) => (
            <div
              key={video.id}
              className="relative rounded-lg bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-primary-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
            >
              {/* <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={video.imageUrl} alt="" />
          </div> */}
              <div className="flex-1 min-w-0">
                <Link href={`/video/${video.cuid}`}>
                  <a className="focus:outline-none">
                    <div className="h-100 w-100">
                      <img
                        className="rounded-md mr-2 object-cover shadow-sm "
                        src={
                          video.thumbnail_url ??
                          "https://www.skyscrapercenter.com/img/my-ctbuh/video-thumbnail.jpg"
                        }
                        alt="Thumbnail"
                      />
                    </div>
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-2xl font-medium text-gray-700 mt-2">
                      {video.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {video.description}
                    </p>
                    <div className="flex items-center align-middle mt-4">
                      <img
                        className="h-8 w-8 rounded-full mr-2"
                        src={video.user.image}
                        alt="User creator"
                      />
                      <p className="text-sm text-gray-500 truncate">
                        {video.user.name}
                      </p>
                    </div>
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
