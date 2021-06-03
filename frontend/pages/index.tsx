import dayjs from "dayjs";
import { ExploreVideoList } from "../components/ExploreVideoList";
import Footer from "components/Footer";
import { fetcher } from "utils/fetcher";
import { getSession } from "next-auth/client";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const App = ({ feed }) => {
  return <ExploreVideoList initialFeed={feed} />;
};

export async function getStaticProps({ req }) {
  // const session = await getSession({ req });
  // if (!session) return { props: { me: null } };
  // const data = await fetcher("/api/me", { email: session.user.email });

  const data = await fetcher("/api/video/feed");

  return {
    props: {
      feed: data,
    },
    // re-generate page at most once every 10 seconds
    revalidate: 10,
  };
}

export default App;
