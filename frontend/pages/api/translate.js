require("dotenv").config();
const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({
  credentials: {
    private_key: process.env.GCP_PRIVATE_KEY,
    client_email: process.env.GCP_CLIENT_EMAIL,
  },
});

export default async (req, res) => {
  let result = await translate.translate(req.query.text, req.query.target);

  res.status(200).json({ translation: result[1].data.translations[0] });
};
