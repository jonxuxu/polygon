import { getSession } from "next-auth/client";

import prisma from "../../../prisma/client";

export default async (req, res) => {
  const session = await getSession({ req });
  console.log(`updating user `, req.body);
  const user = await prisma.users.update({
    data: req.body,
    where: { email: session.user.email },
  });

  return res.json(user);
};
