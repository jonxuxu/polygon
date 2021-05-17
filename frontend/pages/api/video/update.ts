import { sendLog } from "utils/sendLog";
import prisma from "../../../prisma/client";

export default async (req, res) => {
  const { id, ...rest } = req.body;
  if (!id) return res.json({ error: "ERROR: must provide id to update video" });
  const updatedVideo = await prisma.videos.update({
    data: rest,
    where: { id: req.body.id },
  });
  sendLog(`updated video ${updatedVideo.cuid}`);

  return res.json(updatedVideo);
};
