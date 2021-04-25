import prisma from "../../../prisma/client";

export default async (req, res) => {
  const { id, ...rest } = req.body;
  if (!id) return res.json({ error: "ERROR: must provide id to update video" });
  console.log(`updating video ${id}`, rest);
  const updatedVideo = await prisma.videos.update({
    data: rest,
    where: { id: req.body.id },
  });

  return res.json(updatedVideo);
};
