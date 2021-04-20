// DELETE ME AFTER YOU ARE DONE WITH ME
import gql from "graphql-tag";
import axios from "axios";

const INSERT_VIDEO = gql`
  mutation MyMutation(
    $title: String!
    $description: String = "description"
    $cuid: String = "ip239qiof"
    $creator: Int = 1
  ) {
    insert_videos(
      objects: {
        cuid: $cuid
        creator: $creator
        description: $description
        title: $title
      }
    ) {
      affected_rows
    }
  }
`;

const ExamplePage = () => {
  useEffect(() => {
    (async () => {
      const res = await axios.post(`/api/database`, {
        query: INSERT_VIDEO,
        vars: {
          title: "title",
          description: "description",
          cuid: "wa8u30uafj",
          creator: 1,
        },
      });
      console.log("success", res);
    })();
  }, []);
};

export default ExamplePage;
