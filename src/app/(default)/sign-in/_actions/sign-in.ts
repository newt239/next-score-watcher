"use server";

import { redirect } from "next/navigation";

export async function signIn() {
  const baseURL =
    process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL || "http://localhost:3000";
  // better-authの正しいGoogle認証エンドポイント
  const signInUrl = `${baseURL}/api/auth/sign-in/google?callbackURL=${encodeURIComponent(baseURL)}`;

  console.log("Base URL:", baseURL);
  console.log("Sign-in URL:", signInUrl);
  console.log("Google Client ID exists:", !!process.env.GOOGLE_CLIENT_ID);
  console.log(
    "Google Client Secret exists:",
    !!process.env.GOOGLE_CLIENT_SECRET
  );

  redirect(signInUrl);
}
