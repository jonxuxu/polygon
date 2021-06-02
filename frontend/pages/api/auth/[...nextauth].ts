// pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import logdna from "@logdna/logger";

const loggerOptions = {
  app: "Polygon Auth",
  level: "debug", // set a default for when level is not provided in function calls
};

const logDna = logdna.createLogger(process.env.LOGDNA_KEY, loggerOptions);

const options = {
  site:
    process.env.NODE_ENV === "production"
      ? "https://polygon.video"
      : "http://localhost:3000/",

  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Providers.Facebook({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET,
    // }),

    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    // Providers.Credentials({
    //   // The name to display on the sign in form (e.g. 'Sign in with...')
    //   name: "Credentials",
    //   // The credentials is used to generate a suitable form on the sign in page.
    //   // You can specify whatever fields you are expecting to be submitted.
    //   // e.g. domain, username, password, 2FA token, etc.
    //   credentials: {
    //     email: { label: "email", type: "text" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials, req) {
    //     // Add logic here to look up the user from the credentials supplied
    //     const user = { id: 1, name: "J Smith", email: "jsmith@example.com" };

    //     if (user) {
    //       // Any object returned will be saved in `user` property of the JWT
    //       return user;
    //     } else {
    //       // If you return null or false then the credentials will be rejected
    //       return null;
    //       // You can also Reject this callback with an Error or with a URL:
    //       // throw new Error('error message') // Redirect to error page
    //       // throw '/path/to/redirect'        // Redirect to a URL
    //     }
    //   },
    // }),
  ],

  // Database for account persistence
  database: process.env.DATABASE_URL,

  // LogDNA integration
  logger: {
    error(code, ...message) {
      logDna.error(code, { meta: message });
    },
    warn(code, ...message) {
      logDna.warn(code, { meta: message });
    },
    debug(code, ...message) {
      logDna.debug(code, { meta: message });
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
