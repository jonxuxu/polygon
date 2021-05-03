import { useSession } from "next-auth/client";
import Link from "next/link";
import ScreenshotSections from "../components/ScreenshotSections";
const Index = () => {
  const [session] = useSession();
  return (
    <div className="bg-white">
      <div className="relative overflow-hidden">
        <header className="relative">
          <div className="bg-gray-900 pt-6">
            <nav
              className="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6"
              aria-label="Global"
            >
              <div className="flex items-center flex-1">
                <div className="flex items-center justify-between w-full md:w-auto">
                  <a href="#">
                    <span className="sr-only">Workflow</span>
                    <img
                      className="h-8 w-auto sm:h-10"
                      src="https://tailwindui.com/img/logos/workflow-mark-teal-200-cyan-400.svg"
                      alt=""
                    />
                  </a>
                  {/* <div className="-mr-2 flex items-center md:hidden">
                    <button
                      type="button"
                      className="bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white"
                      aria-expanded="false"
                    >
                      <span className="sr-only">Open main menu</span>

                      <svg
                        className="h-6 w-6"
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
                    </button>
                  </div> */}
                </div>
                <div className="hidden space-x-8 md:flex md:ml-10">
                  {/* <a
                  href="#"
                  className="text-base font-medium text-white hover:text-gray-300"
                >
                  Product
                </a>

                <a
                  href="#"
                  className="text-base font-medium text-white hover:text-gray-300"
                >
                  Features
                </a>

                <a
                  href="#"
                  className="text-base font-medium text-white hover:text-gray-300"
                >
                  Marketplace
                </a>

                <a
                  href="#"
                  className="text-base font-medium text-white hover:text-gray-300"
                >
                  Company
                </a> */}
                </div>
              </div>
              <div className=" md:flex md:items-center md:space-x-6">
                {/* <a className="text-base font-medium text-white hover:text-gray-300">
                  log in 
                </a> */}
                <Link href={session ? "/explore" : "/api/auth/signin/google"}>
                  <a className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700">
                    {session ? "Go to App" : "Log In"}
                  </a>
                </Link>
              </div>
            </nav>
          </div>
          {/* 
      <!--
        Mobile menu, show/hide based on menu open state.

        Entering: "duration-150 ease-out"
          From: "opacity-0 scale-95"
          To: "opacity-100 scale-100"
        Leaving: "duration-100 ease-in"
          From: "opacity-100 scale-100"
          To: "opacity-0 scale-95"
      --> */}
          {/* <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top md:hidden">
            <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="px-5 pt-4 flex items-center justify-between">
                <div>
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-teal-500-cyan-600.svg"
                    alt=""
                  />
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-600"
                  >
                    <span className="sr-only">Close menu</span>

                    <svg
                      className="h-6 w-6"
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
              </div>
              <div className="pt-5 pb-6">
                <div className="px-2 space-y-1">
                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    Product
                  </a>

                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    Features
                  </a>

                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    Marketplace
                  </a>

                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    Company
                  </a>
                </div>
                <div className="mt-6 px-5">
                  <a
                    href="#"
                    className="block text-center w-full py-3 px-4 rounded-md shadow bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium hover:from-teal-600 hover:to-cyan-700"
                  >
                    Join Waitlist
                  </a>
                </div>
                <div className="mt-6 px-5">
                  <p className="text-center text-base font-medium text-gray-500">
                    Existing customer?{" "}
                    <Link href="/api/auth/signin/google">
                      <a className="text-gray-900 hover:underline">Login</a>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        </header>
        <main>
          <div className="pt-10 bg-gray-900 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
            <div className="mx-auto max-w-7xl lg:px-8">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                  <div className="lg:py-24">
                    <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                      <span className="block">A better way to</span>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-cyan-400 block">
                        interact with video
                      </span>
                    </h1>
                    <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                      Polygon adds a layer of rich interactions directly into
                      video, so you can get pulled in like never before.
                    </p>
                    <div className="mt-10 sm:mt-12">
                      <form
                        action="#"
                        className="sm:max-w-xl sm:mx-auto lg:mx-0"
                      >
                        <div className="sm:flex">
                          {/* <div className="min-w-0 flex-1">
                            <label className="sr-only">Email address</label>
                            <input
                              id="email"
                              type="email"
                              placeholder="Enter your email"
                              className="block w-full px-4 py-3 rounded-md border-0 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900"
                            />
                          </div>
                          <div className="mt-3 sm:mt-0 sm:ml-3">
                            <button
                              type="submit"
                              className="block w-full py-3 px-4 rounded-md shadow bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-gray-900"
                            >
                              Join our waitlist
                            </button>
                          </div> */}
                        </div>
                        {/* <p className="mt-3 text-sm text-gray-300 sm:mt-4">
                        Start your free 14-day trial, no credit card necessary.
                        By providing your email, you agree to our{" "}
                        <a href="#" className="font-medium text-white">
                          terms or service
                        </a>
                        .
                      </p> */}
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative">
                  <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                    {/* <!-- Illustration taken from Lucid Illustrations: https://lucid.pixsellz.io/ --> */}
                    <img
                      className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                      src="https://tailwindui.com/img/component-images/cloud-illustration-teal-cyan.svg"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <ScreenshotSections /> */}

          {/* <!-- Feature section with screenshot --> */}
          <div className="relative bg-gray-50 pt-16 sm:pt-24 lg:pt-32">
            <div className="mx-auto max-w-md px-4 text-center sm:px-6 sm:max-w-3xl lg:px-8 lg:max-w-7xl">
              <div>
                <h2 className="text-base font-semibold tracking-wider text-cyan-600 uppercase">
                  Instantly
                </h2>
                <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                  Start with your videos
                </p>
                <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
                  Upload your videos to our admin dashboard and we'll take care
                  of the rest.
                </p>
              </div>
              <div className="mt-12 -mb-10 sm:-mb-24 lg:-mb-80">
                <img
                  className="rounded-lg shadow-xl ring-1 ring-black ring-opacity-5"
                  src="https://tailwindui.com/img/component-images/green-project-app-screenshot.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>
          {/* <TestimonialSection /> */}

          {/* <!-- Feature section with grid --> */}
          <FeatureSection />
          {/* <!-- Testimonial section --> */}
        </main>
        <footer className="bg-gray-50" aria-labelledby="footerHeading">
          <h2 id="footerHeading" className="sr-only">
            Footer
          </h2>
          <div className="max-w-md mx-auto pt-12 px-4 sm:max-w-7xl sm:px-6 lg:pt-16 lg:px-8">
            <div className="mt-12 border-t border-gray-200 py-8">
              <p className="text-base text-gray-400 xl:text-center">
                {/* &copy; 2020 Website, Inc. All rights reserved. */}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;

const FeatureSection = () => (
  <div className="relative bg-white py-16 sm:py-24 lg:py-32">
    <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
      <h2 className="text-base font-semibold tracking-wider text-cyan-600 uppercase">
        Interactive video
      </h2>
      <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
        Everything you need to create amazing video experiences
      </p>
      <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500"></p>
      <div className="mt-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="pt-6">
            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg">
                    {/* <!-- Heroicon name: outline/cloud-upload --> */}
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Upload Content
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Apply our video augmentation features to your own video
                  library.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg">
                    {/* <!-- Heroicon name: outline/lock-closed --> */}
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Privacy First
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Employ granular settings to share your content with specific
                  people, your following, or the public.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg">
                    {/* <!-- Heroicon name: outline/refresh --> */}
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Realtime Augmentation
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Enhance your videos with translation, transcription,
                  image-detection, and more in realtime as your users watch.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg">
                    {/* <!-- Heroicon name: outline/shield-check --> */}
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Advanced Security
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  End-to-end encryption and required authentication to access
                  and manage your content.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-md shadow-lg">
                    {/* <!-- Heroicon name: outline/cog --> */}
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
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Powerful Customizations
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Use our admin dashboard to specify the features and controls
                  that are right for your application.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg">
                    {/* <!-- Heroicon name: outline/server --> */}
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
                        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                      />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Explore Videos
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Enable your users to browse your library and find the right
                  videos with our search and explore pages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
const TestimonialSection = () => (
  <div className="pb-16 bg-gradient-to-r from-teal-500 to-cyan-600 lg:pb-0 lg:z-10 lg:relative">
    <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-8">
      <div className="relative lg:-my-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 bg-white lg:hidden"
        ></div>
        <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:p-0 lg:h-full">
          <div className="aspect-w-10 aspect-h-6 rounded-xl shadow-xl overflow-hidden sm:aspect-w-16 sm:aspect-h-7 lg:aspect-none lg:h-full">
            <img
              className="object-cover lg:h-full lg:w-full"
              src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-1.2.1&ixqx=pjAAJImGFV&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="mt-12 lg:m-0 lg:col-span-2 lg:pl-8">
        <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:px-0 lg:py-20 lg:max-w-none">
          <blockquote>
            <div>
              <svg
                className="h-12 w-12 text-white opacity-25"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="mt-6 text-2xl font-medium text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                urna nulla vitae laoreet augue. Amet feugiat est integer dolor
                auctor adipiscing nunc urna, sit.
              </p>
            </div>
            <footer className="mt-6">
              <p className="text-base font-medium text-white">Judith Black</p>
              <p className="text-base font-medium text-cyan-100">
                CEO at PureInsights
              </p>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  </div>
);
