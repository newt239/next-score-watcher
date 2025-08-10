import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { ensureUserPreferences } from "../../server/repositories/user-preferences";
import { DBClient } from "../drizzle/client";
import { account, session, user, verification } from "../drizzle/schema";

export const auth = betterAuth({
  appName: "Score Watcher",
  baseURL: process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
    : "http://localhost:3000",
  basePath: "/api/auth",
  database: drizzleAdapter(DBClient, {
    provider: "sqlite",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
      : "http://localhost:3000",
  ],
  callbacks: {
    // ユーザーが新規作成された時（初回サインイン時）
    async onSignUp({ user: newUser }: { user: User }) {
      try {
        await ensureUserPreferences(newUser.id);
      } catch (error) {
        console.error("Failed to create user preferences:", error);
        // エラーが発生してもサインアップ自体は成功させる
      }
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

export type AuthType = {
  user: User | null;
  session: Session | null;
};
