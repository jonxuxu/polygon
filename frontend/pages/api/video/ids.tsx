import prisma from "../../../prisma/client";

export default async (req, res) => {
  const ids = await prisma.videos.findMany({
    select: { cuid: true },
  });

  return res.json(ids);
};
