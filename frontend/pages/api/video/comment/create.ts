import { getSession } from "next-auth/client";
import prisma from "../../../../prisma/client";

export default async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user)
    return res.json({ error: "only authorized users can leave comments" });

  const { video_id, text } = req.body;
  const video = await prisma.videos.update({
    where: { id: video_id },
    data: {
      comments: {
        create: {
          text,
          user: { connect: { email: session.user.email } },
        },
      },
    },
  });

  return res.json(video);
};
