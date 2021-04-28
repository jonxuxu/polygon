import Router from "next/router";
import { useEffect } from "react";
import Topbar from "../components/Topbar";

const App = () => {
  useEffect(() => {
    Router.push("/explore");
  }, []);
  return (
    <div>
      <Topbar />
      <div className="flex items-center justify-center mt-10">
        {/* <VideoPlayer /> */}
      </div>
    </div>
  );
};

export default App;
