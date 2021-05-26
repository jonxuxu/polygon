import "../globals.css";
import { Provider } from "next-auth/client";
import { useAnalytics } from "components/Analytics";
import Head from "next/head";
import Topbar from "../components/Topbar";
function MyApp({ Component, pageProps }) {
  useAnalytics();
  return (
    <>
      <Head>
        <title>Polygon Video</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Provider session={pageProps.session}>
        <Topbar />
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
