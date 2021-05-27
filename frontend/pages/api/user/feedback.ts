import { getSession } from "next-auth/client";
import { sendLog } from "utils/sendLog";

import prisma from "../../../prisma/client";

export default async (req, res) => {
  sendLog(`❗️ Feedback received: \`${req.body.feedback}\``);

  const feedback = await prisma.feedback.create({
    data: { text: req.body.feedback },
  });

  return res.json(feedback);
};
