import prisma from "../../../prisma/client";

export default async (req, res) => {
  const { id } = req.body;

  const video = await prisma.videos.delete({
    where: { id },
  });

  return res.json(video);
};
