import prisma from "../../../prisma/client";

export default async (req, res) => {
  const { id, ...rest } = req.body;

  const updatedVideo = await prisma.videos.update({
    data: rest,
    where: { id: req.body.id },
  });

  return res.json(updatedVideo);
};
