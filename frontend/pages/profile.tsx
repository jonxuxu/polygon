import Topbar from "../components/Topbar";
import VideoPlayer from "../components/VideoPlayer";
import { signIn, signOut, useSession } from "next-auth/client";

const App = () => {
  const [session, loading] = useSession();
  console.log(session);
  return (
    <div>
      <Topbar user={session && session.user} />
      <div className="grid grid-cols-12">
        <div className="col-span-6 m-10">
          {loading ? (
            <div>loading... </div>
          ) : !!session ? (
            <div>
              <img
                className="h-12 w-12 rounded-full mb-5"
                src={session.user.image}
                alt=""
              />
              <h1 className="text-xl text-gray-700">{session.user.name}</h1>
              <div>{session.user.email}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default App;
