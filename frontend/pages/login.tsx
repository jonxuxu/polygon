import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { signIn, signOut, useSession } from "next-auth/client";
import Router from "next/router";
import { useEffect, useState } from "react";
import { getCsrfToken } from "next-auth/client";
import { fetcher } from "utils/fetcher";

const LoginPage = ({ csrfToken }) => {
  const [session, loading] = useSession();
  const [login, setLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (loading) return;
    if (session) Router.push("/");
    if (!loading && !session) Router.push("/api/auth/signin");
  }, [session, loading]);

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img className="h-12 w-auto" src="/logo-light.svg" alt="Polygon" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {login ? "Sign in to your account" : "Create an account."}
            </h2>
            {session && <span>Signed in as {session.user.email}</span>}
          </div>

          <div className="mt-8">
            <div>
              <div>
                <div className="mt-1 w-full">
                  <Link href="/api/auth/signin">
                    <a className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Sign in with Google</span>
                      <FontAwesomeIcon icon={faGoogle} />
                    </a>
                  </Link>
                </div>
              </div>

              <div className="mt-6 relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  signIn("credentials", { email, password, name });
                  // fetcher("/api/auth/callback/credentials", {
                  //   email,
                  //   name,
                  //   password,
                  //   csrfToken,
                  // });
                }}
                className="space-y-6"
              >
                {!login && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        name="name"
                        type="name"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember_me"
                      name="remember_me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  {/* <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-primary-600 hover:text-primary-500"
                    >
                      Forgot your password?
                    </a>
                  </div> */}
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {login ? "Log In" : "Sign Up"}
                  </button>
                </div>
              </form>
              <div className="text-sm  mt-5">
                <a
                  onClick={() => setLogin(!login)}
                  className="font-medium text-primary-600 hover:text-primary-500 "
                >
                  {login
                    ? "First time here? Create an account. "
                    : "Already a user? Sign in."}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixqx=pjAAJImGFV&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          alt=""
        />
      </div>
    </div>
  );
};

export default LoginPage;

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
