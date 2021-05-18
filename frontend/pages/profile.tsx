import Topbar from "components/Topbar";
import { signIn, signOut, useSession } from "next-auth/client";
import Skeleton from "react-loading-skeleton";
import languages from "constants/languages.json";
import React, { useEffect, useState } from "react";
import { fetcher, useMe } from "utils/fetcher";
import { ImagePreview } from "components/ImagePreview";
import Link from "next/link";

const App = () => {
  const [session, loading] = useSession();
  const { me } = useMe();
  const [language, setLanguage] = useState("English");
  const [tab, setTab] = useState("Snippets");
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

                <ProfileTabs tab={tab} setTab={setTab} />
                {tab === "Snippets" ? (
                  <div className="mt-5">
                    {me &&
                      me.snippets.map((t) => (
                        <div className="border-2 border-primary-400 rounded-md my-3 p-2">
                          {t.original} - {t.translation}
                        </div>
                      ))}
                  </div>
                ) : tab === "Settings" ? (
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
                ) : (
                  <div className="mt-5 ">
                    {me &&
                      me.savedVideos.map((video) => (
                        <Link key={video.id} href={`/video/${video.cuid}`}>
                          <a className="link">
                            <div className="grid grid-cols-12 gap-4">
                              <div className="col-span-6">
                                <ImagePreview video={video} />
                              </div>
                              <div className="col-span-6 text-xl link">
                                {video.title}
                              </div>
                            </div>
                          </a>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default App;

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ProfileTabs({ tab, setTab }) {
  const tabs = ["Snippets", "Saved Videos", "Settings"];

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          defaultValue={tab}
          onChange={(e) => setTab(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab}>{tab}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((t) => (
              <a
                key={t}
                onClick={() => setTab(t)}
                className={classNames(
                  t === tab
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                  "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer transition ease-in"
                )}
                aria-current={t === tab ? "page" : undefined}
              >
                {t}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
