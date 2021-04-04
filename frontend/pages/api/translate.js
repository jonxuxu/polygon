require("dotenv").config();
const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({
  credentials: {
    private_key: process.env.GCP_PRIVATE_KEY,
    client_email: "owner-107@video-world-308113.iam.gserviceaccount.com",
  },
});

export default async (req, res) => {
  let result = await translate.translate(req.query.text, req.query.target);
  console.log(result[1].data.translations[0]);

  res.status(200).json({ translation: result[1].data.translations[0] });
};
