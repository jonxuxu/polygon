require("dotenv").config();
import { Storage } from "@google-cloud/storage";
import prisma from "prisma/client";
import cuid from "cuid";

export default async function handler(req, res) {
  const {
    title,
    description,
    email,
    duration,
    language,
    useSubtitles,
  } = req.body;
  if (!req.body.email)
    return res.json({
      error: "Must specify a user email.",
    });

  const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    credentials: {
      client_email: process.env.GCP_CLIENT_EMAIL,
      private_key: process.env.GCP_PRIVATE_KEY,
    },
  });

  const video = await prisma.videos.create({
    data: {
      cuid: cuid(),
      title: title || req.body.file,
      description,
      upload_state: "pending",
      duration: parseFloat(duration),
      language,
      useSubtitles,
      user: {
        connect: {
          email,
        },
      },
    },
  });

  const bucket = storage.bucket("video-world-source");
  const file = bucket.file(video.cuid); // instead of req.query.file
  const options = {
    expires: Date.now() + 1 * 60 * 1000, //  1 minute,
    fields: { "x-goog-meta-test": "data" },
  };

  const [response] = await file.generateSignedPostPolicyV4(options);
  // console.log(response);
  res.status(200).json({ response, video });
}
