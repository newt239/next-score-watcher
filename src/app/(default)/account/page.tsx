import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Avatar, Box, Button, Group, Text, Title } from "@mantine/core";

import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "アカウント設定",
  alternates: {
    canonical: "https://score-watcher.com/account",
  },
};

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <Box maw={400} mx="auto" mt="xl">
      <Title order={2} mb="md">
        アカウント情報
      </Title>
      <Group gap={12} mb="md">
        <Avatar
          src={user.user_metadata?.avatar_url}
          alt={user.user_metadata?.name}
          radius="xl"
          size={48}
        />
        <Box>
          <Text size="lg" fw={700}>
            {user.user_metadata?.name || user.email}
          </Text>
          <Text size="sm" c="dimmed">
            {user.email}
          </Text>
        </Box>
      </Group>
      <form action="/account/signout" method="post">
        <Button type="submit" color="red" fullWidth>
          ログアウト
        </Button>
      </form>
    </Box>
  );
}
