import prisma from "../../../prisma/client";

export default async (req, res) => {
  const video = await prisma.videos.findUnique({
    where: { cuid: req.query.cuid },
  });

  return res.json(video);
};
