import "../globals.css";
import { Provider } from "next-auth/client";
import { useAnalytics } from "components/Analytics";

function MyApp({ Component, pageProps }) {
  useAnalytics();
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
