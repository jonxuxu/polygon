import prisma from "../../../prisma/client";

export default async (req, res) => {
  if (!req.body.cuid) return res.json({ error: "No CUID specified." });
  const video = await prisma.videos.update({
    where: { cuid: req.body.cuid },
    data: { views: { increment: 1 } },
  });

  return res.json(video);
};
