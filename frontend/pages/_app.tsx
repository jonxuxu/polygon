import "../globals.css";
import { Provider } from "next-auth/client";
import { useAnalytics } from "components/Analytics";
import Head from "next/head";
function MyApp({ Component, pageProps }) {
  useAnalytics();
  return (
    <div className="bg-primary">
      <Head>
        <title>Polygon Video</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Provider session={pageProps.session}>
        <div className="dark bg-primary min-h-screen">
          <Component {...pageProps} />
        </div>
      </Provider>
    </div>
  );
}

export default MyApp;
