"use client";

import { Badge, Box, Button, Card, Group, List, Text, ThemeIcon, Title } from "@mantine/core";
import {
  IconBug,
  IconBulb,
  IconExternalLink,
  IconSparkles,
  IconTool,
  IconWand,
} from "@tabler/icons-react";

import { changelog, REQUEST_FORM_URL, upcomingFeatures } from "@/utils/changelog";

import classes from "./Changelog.module.css";

const sections = [
  { key: "features", label: "新機能", color: "green", icon: <IconSparkles size="1rem" /> },
  { key: "improvements", label: "改善", color: "blue", icon: <IconWand size="1rem" /> },
  { key: "fixes", label: "不具合修正", color: "orange", icon: <IconBug size="1rem" /> },
  { key: "others", label: "その他", color: "gray", icon: <IconTool size="1rem" /> },
] as const;

/** アップデート履歴・今後の予定・要望フォーム導線の本体（Mantineの複合コンポーネントを使うためクライアント化） */
const Changelog: React.FC = () => {
  return (
    <>
      <Title order={2}>アップデート履歴</Title>
      <Text c="dimmed" mb="lg">
        Score Watcher のこれまでの変更点と今後追加予定の機能をご確認いただけます。
      </Text>

      <Box className={classes.entry_list}>
        {changelog.map((entry) => (
          <Card key={entry.version} withBorder shadow="sm" radius="md" p="lg">
            <Group justify="space-between" mb={entry.news ? "xs" : "sm"}>
              <Title order={3} style={{ padding: 0 }}>
                v{entry.version}
              </Title>
              <Badge variant="light" color="gray">
                {entry.date}
              </Badge>
            </Group>
            {entry.news && (
              <Text size="sm" mb="sm">
                {entry.news}
              </Text>
            )}
            {sections.map((section) => {
              const items = entry[section.key];
              if (!items || items.length === 0) return null;
              return (
                <Box key={section.key} mt="sm">
                  <Group gap="xs" mb={4}>
                    <ThemeIcon variant="light" color={section.color} size="sm" radius="xl">
                      {section.icon}
                    </ThemeIcon>
                    <Text fw={700} size="sm">
                      {section.label}
                    </Text>
                  </Group>
                  <List size="sm" spacing={4} withPadding>
                    {items.map((item, i) => (
                      <List.Item key={i}>{item}</List.Item>
                    ))}
                  </List>
                </Box>
              );
            })}
          </Card>
        ))}
      </Box>

      <Title order={2} mt="xl">
        今後追加予定の機能
      </Title>
      <Card withBorder shadow="sm" radius="md" p="lg" mt="sm">
        <List
          spacing="xs"
          icon={
            <ThemeIcon variant="light" color="grape" size="sm" radius="xl">
              <IconBulb size="1rem" />
            </ThemeIcon>
          }
        >
          {upcomingFeatures.map((feature, i) => (
            <List.Item key={i}>{feature}</List.Item>
          ))}
        </List>
        <Text c="dimmed" size="sm" mt="md">
          掲載内容は開発状況により変更・中止となる場合があります。
        </Text>
      </Card>

      <Card withBorder shadow="sm" radius="md" p="lg" mt="xl">
        <Title order={3} style={{ padding: 0 }}>
          ご要望・不具合のご報告
        </Title>
        <Text size="sm" mt="xs" mb="md">
          「こんな機能がほしい」「ここがおかしい」といったご意見は、以下のフォームからお気軽にお寄せください。今後のアップデートの参考にさせていただきます。
        </Text>
        <Button
          component="a"
          href={REQUEST_FORM_URL}
          rel="noopener noreferrer"
          rightSection={<IconExternalLink size="1rem" />}
          target="_blank"
          w="fit-content"
        >
          要望フォームを開く
        </Button>
      </Card>
    </>
  );
};

export default Changelog;
