import prisma from "../../../prisma/client";

export default async (req, res) => {
  const video = await prisma.videos.findUnique({
    where: { id: req.body.id },
  });

  return res.json(video);
};
