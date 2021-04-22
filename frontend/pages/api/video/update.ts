import prisma from "../../../prisma/client";

export default async (req, res) => {
  const { id, ...rest } = req.body;
  console.log(`updating video ${id}`, rest);
  const updatedVideo = await prisma.videos.update({
    data: rest,
    where: { id: req.body.id },
  });

  return res.json(updatedVideo);
};
