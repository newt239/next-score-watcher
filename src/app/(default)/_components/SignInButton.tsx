"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import Button from "#/app/_components/Button";

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

  return <Button onClick={handleSignIn}>Login</Button>;
};
