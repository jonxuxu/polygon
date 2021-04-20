import axios from "axios";
import { print } from "graphql";
import { PROD_GRAPHQL_URL } from "../../utils/constants";

export const gqlQuery = async (query, variables = {}) => {
  const res = await axios.post(
    PROD_GRAPHQL_URL,
    {
      query: print(query),
      variables: { ...variables },
    },
    {
      headers: {
        "x-hasura-admin-secret": process.env.PROD_GQL_KEY,
      },
    }
  );
  if (res.data.errors) {
    console.log(JSON.stringify(res.data.errors, null, 2));
    throw res.data.errors;
  }
  return res.data.data;
};
