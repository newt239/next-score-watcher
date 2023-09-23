"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import Button from "#/app/_components/Button";

export const SignOutButton = () => {
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return <Button onClick={handleSignOut}>ログアウト</Button>;
};
