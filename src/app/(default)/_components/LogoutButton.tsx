"use client";

import { useRouter } from "next/navigation";

import { Button } from "@mantine/core";

import { createClient } from "@/utils/supabase/client";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Button color="red" fullWidth onClick={handleLogout}>
      ログアウト
    </Button>
  );
};

export default LogoutButton;
