import Topbar from "../../components/Topbar";
import { useMe } from "utils/fetcher";
import { UploadList } from "../../components/UploadList";
import { useSession } from "next-auth/client";
import { useEffect } from "react";
import Router from "next/router";

const UploadsPage = () => {
  const { me } = useMe();

  const [session, loading] = useSession();
  useEffect(() => {
    if (!loading && !session) Router.push("/");
  });

  return (
    <div>
      <Topbar />

      <div className="">
        <div className="m-10">
          <UploadList />
        </div>
      </div>
    </div>
  );
};

export default UploadsPage;
