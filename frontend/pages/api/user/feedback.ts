import { getSession } from "next-auth/client";
import { sendLog } from "utils/sendLog";

import prisma from "../../../prisma/client";

export default async (req, res) => {
  sendLog(`❗️ Feedback received: \`${req.body.feedback}\``);
  const session = await getSession({ req });

  const feedback = session
    ? await prisma.feedback.create({
        data: {
          text: req.body.feedback,
          user: { connect: { email: session.user.email } },
        },
      })
    : await prisma.feedback.create({
        data: {
          text: req.body.feedback,
        },
      });

  return res.json(feedback);
};
