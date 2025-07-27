import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Avatar, Box, Group, Text, Title } from "@mantine/core";

import SignOutButton from "./_components/SignOutButton";
import UserPreferencesSettings from "./_components/UserPreferencesSettings";

import { getUser } from "@/utils/auth-helpers";
import { getUserPreferences } from "./_actions/preferences";

export const metadata: Metadata = {
  title: "アカウント設定",
  alternates: {
    canonical: "https://score-watcher.com/account",
  },
};

export default async function AccountPage() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const preferences = await getUserPreferences();

  // デフォルト設定を使用（ユーザーが未認証の場合は上でリダイレクトされる）
  const defaultPreferences = {
    theme: "light",
    showWinthroughPopup: true,
    showBoardHeader: true,
    showQn: false,
    showSignString: true,
    reversePlayerInfo: false,
    wrongNumber: true,
    webhookUrl: null,
  };

  return (
    <Box maw={600} mx="auto" mt="xl">
      <Title order={2} mb="md">
        アカウント情報
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
        initialPreferences={preferences || defaultPreferences}
      />
    </Box>
  );
}
