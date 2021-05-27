import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import styled from "styled-components";

import OutsideClicker from "components/OutsideClicker";
import { fetcher, useMe } from "utils/fetcher";
import { CheckCircleIcon, XIcon } from "@heroicons/react/solid";

const Topbar = () => {
  const [profileMenu, setProfileMenu] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [feedbackMenu, setFeedbackMenu] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [session, loading] = useSession();
  const { me } = useMe();
  const routes = [
    { route: "/", label: "Explore" },
    session
      ? { route: "/uploads", label: "Upload" }
      : { route: "/api/auth/signin/google", label: "Login" },
    { route: "/how-it-works", label: "How It Works" },
  ];
  const router = useRouter();

  useEffect(() => {
    if (router.route === "/uploads" && me && !me.approved) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [router.route]);
  // const { session } = useSession();
  return (
    <nav
      className="shadow"
      style={
        theme === "light"
          ? {
              backgroundColor: "white",
            }
          : {
              backgroundColor: "rgba(0,0,0,0)",
              position: "absolute",
              top: 0,
              width: "100%",
              left: 0,
              zIndex: 2,
            }
      }
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* <!-- Mobile menu button --> */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500  focus:outline-none focus:ring-2 focus:ring-inset focus:text-black"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => {
                setOpenMobileMenu(!openMobileMenu);
                console.log(openMobileMenu);
              }}
            >
              <span className="sr-only">Open main menu</span>
              {/* <!--
            Icon when menu is closed.

            Heroicon name: outline/menu

            Menu open: "hidden", Menu closed: "block"
          --> */}
              <svg
                className={"block h-6 w-6"}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* <!--
            Icon when menu is open.

            Heroicon name: outline/x

            Menu open: "block", Menu closed: "hidden"
          --> */}
              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-between sm:mr-10">
            <Link href="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <img
                  className="block lg:hidden h-8 w-auto"
                  src={theme === "light" ? "/logo-dark.svg" : "/logo-light.svg"}
                  alt="Frame"
                />
                <img
                  className="hidden lg:block h-8 w-auto"
                  src={theme === "light" ? "/logo-dark.svg" : "/logo-light.svg"}
                  alt="Frame"
                />
              </div>
            </Link>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* Feedback link */}
              <div className="relative inline-flex items-center">
                <NavLink
                  selected={false}
                  theme={theme}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium`}
                  onClick={() => setFeedbackMenu(!feedbackMenu)}
                >
                  Feedback
                </NavLink>
                {feedbackMenu && (
                  <FeedbackForm setFeedbackMenu={setFeedbackMenu} />
                )}
              </div>
              {/* Desktop routes */}
              {routes.map((route) => (
                <Link href={route.route} key={route.route}>
                  <NavLink
                    selected={router.pathname === route.route}
                    theme={theme}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium`}
                  >
                    {route.label}
                  </NavLink>
                </Link>
              ))}
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* <!-- Profile dropdown --> */}
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={() => setProfileMenu(!profileMenu)}
                >
                  <span className="sr-only">Open user menu</span>
                  <UserAvatar user={session ? session.user : undefined} />
                </button>
              </div>

              {/* <!--
            Dropdown menu, show/hide based on menu state.

            Entering: "transition ease-out duration-200"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          --> */}
              {profileMenu && (
                <OutsideClicker onOutside={() => setProfileMenu(false)}>
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <Link
                      href={session ? "/profile" : "/api/auth/signin/google"}
                    >
                      <a
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        {session ? "Your Profile" : "Log In"}
                      </a>
                    </Link>

                    {session && (
                      <a
                        onClick={() => signOut()}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Sign out
                      </a>
                    )}
                  </div>
                </OutsideClicker>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      {openMobileMenu && (
        <div className={`sm:hidden`} id="mobile-menu">
          <div className="pt-2 pb-4 space-y-1">
            {routes.map((route) => (
              <Link href={route.route} key={route.route}>
                <a
                  className={
                    router.pathname === route.route
                      ? "bg-secondary-50 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                  }
                >
                  {route.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
export default Topbar;

const NavLink = styled.a`
  cursor: pointer;
  color: ${(params) => {
    if (params.theme === "light") {
      return params.selected ? "rgb(17,24,39)" : "rgb(107,114,128)";
    } else {
      return params.selected ? "#EE3699" : "rgba(237,237,237,0.7)";
    }
  }};
  &:hover {
    color: ${(params) => {
      return params.theme === "light"
        ? "rgb(55,65,81)"
        : "rgba(255,255,255,0.8)";
    }};
  }
`;

export const UserAvatar = ({ user }: { user?: { image?: string } }) => {
  return !!user ? (
    <img className="h-8 w-8 rounded-full" src={user.image} alt="" />
  ) : (
    <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
      <svg
        className="h-full w-full text-gray-300"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </span>
  );
};

const FeedbackForm = ({ setFeedbackMenu }) => {
  const [feedback, setFeedback] = useState("");
  const [success, setSuccess] = useState(false);

  return (
    <OutsideClicker onOutside={() => setFeedbackMenu(false)}>
      <div
        className="origin-top-left absolute right-2 top-10 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 py-3"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu"
        // onBlur={() => setFeedbackMenu(false)}
      >
        {success ? (
          <div className="flex flex-col items-center justify-center text-center ">
            <div className="">
              <CheckCircleIcon
                className="h-5 w-5 text-green-400"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Feedback sent! We're grateful for your input.
              </p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={() => {
              if (feedback.length === 0) return;
              fetcher(`/api/user/feedback`, { feedback });
              setFeedback("");
              setSuccess(true);
            }}
          >
            <textarea
              placeholder="Your Feedback... "
              className=" block w-full sm:text-sm border-transparent focus:border-transparent focus:ring-0 rounded-md resize-none"
              rows={2}
              autoFocus
              // ref={input => inputRef = input}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <button className="bg-white text-black text-sm rounded-lg float-right p-1 px-1.5">
              Send
            </button>
          </form>
        )}
      </div>
    </OutsideClicker>
  );
};
