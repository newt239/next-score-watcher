"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import GoogleButton from "./GoogleButton";

export const SignInButton = () => {
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    const redirectURL = `${window.location.protocol}//${window.location.host}/auth/callback`;
    await supabase.auth.signInWithOAuth({
      options: {
        redirectTo: redirectURL,
      },
      provider: "google",
    });
  };

  return <GoogleButton onClick={handleSignIn} />;
};
