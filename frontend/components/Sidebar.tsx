import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = ({
  mobileMenu,
  setMobileMenu,
}: {
  mobileMenu: boolean;
  setMobileMenu: (arg: boolean) => void;
}) => {
  const routes = [
    {
      route: "/app",
      label: "Dashboard",
      icon: () => (
        <svg
          className="text-gray-500 mr-3 h-6 w-6"
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      route: "/profile",
      label: "Profile",
      icon: () => (
        <svg
          className="text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6"
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
  ];
  return (
    <>
      <DesktopSidebar routes={routes}></DesktopSidebar>
      <MobileSidebar
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        routes={routes}
      ></MobileSidebar>
    </>
  );
};

export default Sidebar;

interface Route {
  route: string;
  label: string;
  icon: () => JSX.Element;
}
const MobileSidebar = ({
  mobileMenu,
  setMobileMenu,
  routes,
}: {
  mobileMenu: boolean;
  setMobileMenu: (arg: boolean) => void;
  routes: Route[];
}) => {
  const router = useRouter();
  if (!mobileMenu) return null;
  return (
    <div className="md:hidden">
      <div className="fixed inset-0 flex z-40">
        {/* <!--
      Off-canvas menu overlay, show/hide based on off-canvas menu state.

      Entering: "transition-opacity ease-linear duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "transition-opacity ease-linear duration-300"
        From: "opacity-100"
        To: "opacity-0"
    --> */}
        <div
          className={`fixed inset-0 transition-opacity ease-linear duration-300 ${
            mobileMenu ? "opacity-100" : "outline-0"
          }`}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
        {/* <!--
      Off-canvas menu, show/hide based on off-canvas menu state.

      Entering: "transition ease-in-out duration-300 transform"
        From: "-translate-x-full"
        To: "translate-x-0"
      Leaving: "transition ease-in-out duration-300 transform"
        From: "translate-x-0"
        To: "-translate-x-full"
    --> */}
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white transition ease-in-out duration-300 transform ${
            mobileMenu ? "translate-x-0" : "-translate-x-full "
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setMobileMenu(false)}
            >
              <span className="sr-only">Close sidebar</span>
              {/* <!-- Heroicon name: outline/x --> */}
              <svg
                className="h-6 w-6 text-white"
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
          <div className="flex-shrink-0 flex items-center px-4">
            {/* <img
              className="h-8 w-auto"
              src="/webform-logo.png"
              alt="Webform Logo"
            /> */}
          </div>
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {/* <!-- Current: "bg-gray-100 text-gray-900", Default: "text-gray-600 hover:bg-gray-50 hover:text-gray-900" --> */}

              {routes.map((route) => (
                <Link href={route.route}>
                  <a
                    className={`${
                      router.pathname === route.route
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    } text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md focus:outline-none`}
                    onClick={() => setMobileMenu(false)}
                  >
                    {/* <!-- Heroicon name: outline/home --> */}
                    {route.icon()}
                    {route.label}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* <!-- Dummy element to force sidebar to shrink to fit close icon --> */}
        </div>
      </div>
    </div>
  );
};

const DesktopSidebar = ({ routes }) => {
  const router = useRouter();
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-30 sm:w-48 md:w-52">
        <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 bg-white overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            {/* <img
              className="h-16 w-auto"
              src="/webform-logo.png"
              alt="Webform Logo"
            /> */}
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 bg-white space-y-1">
              {routes.map(({ route, label, icon }) => (
                <Link key={label} href={route}>
                  <a
                    className={`${
                      router.pathname === route && "bg-gray-100"
                    } text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md focus:outline-none`}
                  >
                    {icon()}
                    {label}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
