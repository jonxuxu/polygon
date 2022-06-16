import "../globals.css";
import { Provider } from "next-auth/client";
import { useAnalytics } from "components/Analytics";
import Head from "next/head";
import Topbar from "components/Topbar";
import Footer from "components/Footer";
import { ShortcutContext } from "components/ShortcutContext";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  useAnalytics();
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);

  return (
    <ShortcutContext.Provider
      value={{
        shortcutsEnabled,
        toggleShortcuts: (val: boolean) => setShortcutsEnabled(val),
      }}
    >
      <Head>
        <title>Polygon Video</title>
        <link rel="icon" type="image/svg" href="/logo/shape.svg" />
        <meta property="og:title" content="Polygon Video" />
        <meta
          property="og:description"
          content="Interactive Video for Language Learning."
        />
        <meta property="og:image" content="/promo/Promo1.png" />
        <meta property="og:url" content="http://polygonvideo.vercel.app"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>

        <meta name="twitter:title" content="Polygon Video" />
        <meta
          name="twitter:description"
          content="Interactive Video for Language Learning."
        />
        <meta name="twitter:image" content="/promo/Promo1.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Provider session={pageProps.session}>
        <div className="min-h-[800px]">
          <Topbar />
          <Component {...pageProps} />
        </div>
        <Footer />
      </Provider>
    </ShortcutContext.Provider>
  );
}

export default MyApp;
