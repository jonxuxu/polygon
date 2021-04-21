import { getSession } from "next-auth/client";
import prisma from "prisma/client";

export default async (req, res) => {
  const session = await getSession({ req });

  const user = await prisma.users.findUnique({
    where: { email: session.user.email },
    include: { videos: true },
  });

  res.json(user);
};
