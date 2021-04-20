import Topbar from "../components/Topbar";
import VideoPlayer from "../components/VideoPlayer";

const App = () => {
  return (
    <div>
      <Topbar />
      <div className="flex items-center justify-center mt-10">
        <VideoPlayer />
      </div>
    </div>
  );
};

export default App;
