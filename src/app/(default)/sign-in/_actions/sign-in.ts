"use server";

import { redirect } from "next/navigation";

export async function signIn() {
  const baseURL =
    process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL &&
    !process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL.includes("localhost")
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
      : "http://localhost:3000";
  const signInUrl = `${baseURL}/api/auth/sign-in/google?callbackURL=${encodeURIComponent(baseURL)}`;

  redirect(signInUrl);
}
