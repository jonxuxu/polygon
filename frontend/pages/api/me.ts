import { getSession } from "next-auth/client";
import prisma from "prisma/client";

export default async (req, res) => {
  const session = await getSession({ req });
  if (!session && !req.body.email) return res.json({});

  const user = await prisma.users.findUnique({
    where: { email: session ? session.user.email : req.body.email },
    include: {
      savedVideos: true,
      snippets: true,
      videos: { orderBy: { created: "desc" } },
    },
  });

  res.json(user);
};
