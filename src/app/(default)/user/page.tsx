import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Avatar, Box, Group, Text, Title } from "@mantine/core";

import SignOutButton from "./_components/SignOutButton";
import UserPreferencesSettings from "./_components/UserPreferencesSettings";

import { defaultUserPreferences } from "@/models/user-preference";
import { getUser } from "@/utils/auth/auth-helpers";
import { createApiClientOnServer } from "@/utils/hono/server";

// ページを動的レンダリングとして明示的に設定
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ユーザー設定",
  alternates: {
    canonical: "https://score-watcher.com/user",
  },
};

const AccountPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const apiClient = await createApiClientOnServer();
  const response = await apiClient.user[":user_id"].preferences.$get({
    param: { user_id: user.id },
  });
  const preferences = await response.json();

  return (
    <Box maw={600} mx="auto" mt="xl">
      <Title order={2} mb="md">
        ユーザー設定
      </Title>
      <Group gap={12} mb="md">
        <Avatar src={user.image} alt={user.name} radius="xl" size={48} />
        <Box>
          <Text size="lg" fw={700}>
            {user.name || user.email}
          </Text>
          <Text size="sm" c="dimmed">
            {user.email}
          </Text>
        </Box>
        <SignOutButton />
      </Group>

      <UserPreferencesSettings
        initialPreferences={
          "preferences" in preferences ? preferences.preferences : defaultUserPreferences
        }
        userId={user.id}
      />
    </Box>
  );
};

export default AccountPage;
