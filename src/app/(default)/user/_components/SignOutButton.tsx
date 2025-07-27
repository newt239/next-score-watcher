"use client";

import { useRouter } from "next/navigation";

import { Button } from "@mantine/core";

import { authClient } from "@/utils/auth/auth-client";

const SignOutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <Button color="red" fullWidth onClick={handleLogout}>
      ログアウト
    </Button>
  );
};

export default SignOutButton;
