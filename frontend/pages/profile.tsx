import Topbar from "components/Topbar";
import { signIn, signOut, useSession } from "next-auth/client";
import Skeleton from "react-loading-skeleton";
import languages from "constants/languages.json";
import { useEffect, useState } from "react";
import { fetcher, useMe } from "utils/fetcher";

const App = () => {
  const [session, loading] = useSession();
  const { me } = useMe();
  const [language, setLanguage] = useState("English");
  useEffect(() => {
    if (me) setLanguage(me.language);
  }, [me]);
  // console.log(session);
  return (
    <div>
      <Topbar />
      <div className="">
        <div className="">
          {loading ? (
            <div className="p-3">
              <Skeleton count={5} />
            </div>
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
                <div className=" p-5">
                  <div className="mt-1 col-span-2 col-start-2">
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium text-gray-700 mb-3"
                    >
                      User Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => {
                        setLanguage(e.target.value);
                        fetcher("/api/user/update", {
                          language: e.target.value,
                        });
                      }}
                      // autoComplete="title"
                      className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    >
                      {Object.keys(languages).map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg text-gray-700">Your Snippets</h2>
                  {me.snippets.map((t) => (
                    <div>
                      {t.original} - {t.translation}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default App;
