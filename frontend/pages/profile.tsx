import Topbar from "../components/Topbar";
import VideoPlayer from "../components/VideoPlayer";
import { signIn, signOut, useSession } from "next-auth/client";

const App = () => {
  const [session, loading] = useSession();
  // console.log(session);
  return (
    <div>
      <Topbar />
      <div className="">
        <div className="">
          {loading ? (
            <div>loading... </div>
          ) : !!session ? (
            <div>
              <div className="flex flex-col w-full m-10 items-center justify-center">
                <img
                  className="h-20 w-20 rounded-full mb-5"
                  src={session.user.image}
                  alt=""
                />
                <h1 className="text-xl text-gray-700">{session.user.name}</h1>
                <div>{session.user.email}</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default App;
