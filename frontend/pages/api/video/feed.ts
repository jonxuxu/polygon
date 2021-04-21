import prisma from "../../../prisma/client";

export default async (req, res) => {
  const video = await prisma.videos.findMany({
    orderBy: { created: "desc" },
  });

  return res.json(video);
};
