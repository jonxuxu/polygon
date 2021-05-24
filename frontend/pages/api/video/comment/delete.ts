import prisma from "../../../../prisma/client";

export default async (req, res) => {
  const { id } = req.body;

  const video = await prisma.comments.delete({
    where: { id },
  });

  return res.json(video);
};
