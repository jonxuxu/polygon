import "../globals.css";
import { Provider } from "next-auth/client";
import { useAnalytics } from "components/Analytics";
import Head from "next/head";
function MyApp({ Component, pageProps }) {
  useAnalytics();
  return (
    <>
      <Head>
        <title>Polygon Video</title>
      </Head>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
