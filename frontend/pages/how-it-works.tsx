import Topbar from "../components/Topbar";
import VideoPlayer from "../components/VideoPlayer";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";

const Page = () => {
  return (
    <div>
      <Topbar />
      <div className="m-10">
        <div className="mb-8 text-2xl text-gray-700 ">How it Works</div>
      </div>
    </div>
  );
};

export default Page;
