import type { Metadata } from "next";
import Link from "next/link";

import { Box, Card, Group, SimpleGrid, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";

import AppInfo from "./_components/AppInfo";
import RecommendedEnvironment from "./_components/RecommendedEnvironment";

export const metadata: Metadata = {
  title: "アプリ情報",
  alternates: {
    canonical: "https://score-watcher.com/docs",
  },
};

const AppInfoPage = () => {
  return (
    <>
      <Title order={2}>アプリ情報</Title>
      <AppInfo />
      <Title order={2}>推奨環境</Title>
      <RecommendedEnvironment />
      <Title order={2} mt="lg">
        各種表記
      </Title>
      <SimpleGrid cols={2}>
        <Card
          component={Link}
          href="/docs/terms_of_service"
          shadow="sm"
          withBorder
        >
          <Group justify="space-between">
            <Box>利用規約</Box>
            <IconArrowRight />
          </Group>
        </Card>
        <Card
          component={Link}
          href="/docs/privacy_policy"
          shadow="sm"
          withBorder
        >
          <Group justify="space-between">
            <Box>プライバシーポリシー</Box>
            <IconArrowRight />
          </Group>
        </Card>
        <Card
          component={Link}
          href="/docs/for_commercial_use"
          shadow="sm"
          withBorder
        >
          <Group justify="space-between">
            <Box>商用利用に関するルール</Box>
            <IconArrowRight />
          </Group>
        </Card>
      </SimpleGrid>
    </>
  );
};

export default AppInfoPage;
