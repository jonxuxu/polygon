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
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Provider session={pageProps.session}>
        <Topbar />
        <Component {...pageProps} />
        <Footer />
      </Provider>
    </ShortcutContext.Provider>
  );
}

export default MyApp;
