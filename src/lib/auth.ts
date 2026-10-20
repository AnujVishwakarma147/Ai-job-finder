import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;

if (!secret || !baseURL) {
  throw new Error("Better Auth environment variables are missing.");
}

export const auth = betterAuth({
  appName: "CareerPilot",
  secret,
  baseURL,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [baseURL],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,

    // Development only. Configure verification email before production.
    requireEmailVerification: true && process.env.NODE_ENV === "production",
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 30,
  },
});