import Topbar from "../../components/Topbar";
import { useMe } from "utils/fetcher";
import { UploadList } from "../../components/UploadList";

const UploadsPage = () => {
  const { me } = useMe();

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
