import dayjs from "dayjs";
import { ExploreVideoList } from "../components/ExploreVideoList";
import Footer from "components/Footer";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const App = () => {
  return <ExploreVideoList />;
};

export default App;
