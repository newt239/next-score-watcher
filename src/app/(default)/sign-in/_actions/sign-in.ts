"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/utils/auth";

export async function signIn() {
  const { data, error } = await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: "/",
    },
    headers: await headers(),
  });

  if (error) {
    throw error;
  }
  if (data?.url) {
    redirect(data.url);
  }
}
