import Topbar from "../components/Topbar";
import dayjs from "dayjs";
import { ExploreVideoList } from "../components/ExploreVideoList";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const App = () => {
  return (
    <div className="bg-primary">
      <Topbar />
      <div className="m-10 mt-8">
        <ExploreVideoList />
      </div>
    </div>
  );
};

export default App;
