import prisma from "../../../prisma/client";

export default async (req, res) => {
  const video = await prisma.videos.findUnique({
    where: { id: req.query.id },
  });

  return res.json(video);
};
