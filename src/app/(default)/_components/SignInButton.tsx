"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import GoogleButton from "./GoogleButton";

export const SignInButton = () => {
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    const redirectURL = `${window.location.protocol}//${window.location.host}/auth/callback`;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectURL,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return <GoogleButton onClick={handleSignIn} />;
};
