import { getSession } from "next-auth/client";
import prisma from "prisma/client";

export default async (req, res) => {
  const session = await getSession({ req });
  if (!session) return res.json(null);
  const user = await prisma.users.findUnique({
    where: { email: session.user.email },
    include: {
      savedVideos: true,
      snippets: true,
      videos: { orderBy: { created: "desc" } },
    },
  });

  res.json(user);
};
