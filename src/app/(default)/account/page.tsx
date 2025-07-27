import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Avatar, Box, Group, Text, Title } from "@mantine/core";

import SignOutButton from "./_components/SignOutButton";

import { getUser } from "@/utils/auth-helpers";

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

  return (
    <Box maw={400} mx="auto" mt="xl">
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
    </Box>
  );
}
