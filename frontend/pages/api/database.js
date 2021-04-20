import { gqlQuery } from "../utils";

export default async function handler(req, res) {
  const results = await gqlQuery(req.body.query, req.body.vars);
  // console.log(results);
  return res.status(200).json(results);
}
