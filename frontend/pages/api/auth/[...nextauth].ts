// pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import logdna from "@logdna/logger";
import { sendLog } from "utils/sendLog";

const loggerOptions = {
  app: "Polygon Auth",
  level: "debug", // set a default for when level is not provided in function calls
};

// @ts-ignore
const logDna = logdna.createLogger(process.env.LOGDNA_KEY, loggerOptions);

logDna.error("test error");

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
      server: {
        port: 465,
        host: "smtp.sendgrid.net",
        // @ts-ignore
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
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
  events: {
    async signIn(message) {
      console.log(message);
      sendLog(message.user.email + " logged in with " + message.account.type);
    },
    async signOut(message) {
      sendLog(`User ${message.id} logged out`);
    },
    async createUser(message) {
      console.log(message);
      sendLog(`NEW USER: ${message.email} `);
    },
    async updateUser(message) {
      /* user updated - e.g. their email was verified */
    },
    async linkAccount(message) {
      /* account (e.g. Twitter) linked to a user */
    },
    async session(message) {
      /* session is active */
    },
    async error(message) {
      /* error in authentication flow */
      console.log(message);
    },
  },

  // Database for account persistence
  database: process.env.DATABASE_URL,

  // LogDNA integration
  logger: {
    error(code, ...message) {
      logDna.error(code, { meta: message });
      console.log("error: ", code, message);
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
