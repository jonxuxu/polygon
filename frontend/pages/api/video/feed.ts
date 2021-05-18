import prisma from "../../../prisma/client";

export default async (req, res) => {
  const video = await prisma.videos.findMany({
    orderBy: { views: "desc" },
    include: { user: true },
  });

  return res.json(video);
};
