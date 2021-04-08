import Topbar from "../components/Topbar";
import VideoPlayer from "../components/VideoPlayer";

const App = () => {
  return (
    <div>
      {/* <Topbar /> */}
      <div className="grid grid-cols-12">
        <div className="col-span-6">
          <VideoPlayer />
        </div>
      </div>
    </div>
  );
};

export default App;
