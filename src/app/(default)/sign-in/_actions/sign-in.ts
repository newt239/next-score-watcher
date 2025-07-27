"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/utils/auth";

export async function signIn() {
  const result = await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: "/",
    },
    headers: await headers(),
  });

  // Better Authの場合、成功時にレスポンスが返される
  if (result && "url" in result && result.url) {
    redirect(result.url);
  }
}
