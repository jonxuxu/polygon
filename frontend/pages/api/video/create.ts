import prisma from "../../../prisma/client";

export default async (req, res) => {
  const { id, ...rest } = req.body;

  const video = await prisma.videos.create({
    data: rest,
    where: { id },
  });

  return res.json(video);
};
