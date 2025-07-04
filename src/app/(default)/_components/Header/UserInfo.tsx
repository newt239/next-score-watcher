"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Avatar, Button, Group, Text } from "@mantine/core";

import { createClient } from "@/utils/supabase/client";

export default function UserInfo() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading || !user) return null;

  return (
    <Group gap={8}>
      <Avatar
        src={user.user_metadata?.avatar_url}
        alt={user.user_metadata?.name}
        radius="xl"
        size={32}
      />
      <Text size="sm">{user.user_metadata?.name}</Text>
      <Button size="xs" variant="outline" color="gray" onClick={handleLogout}>
        ログアウト
      </Button>
    </Group>
  );
}
