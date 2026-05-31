"use client";

import { Box, Button, Group, Image, List, Text, ThemeIcon, Title } from "@mantine/core";
import { IconBug, IconBulb, IconExternalLink, IconSparkles, IconWand } from "@tabler/icons-react";

import { changelog, REQUEST_FORM_URL, upcomingFeatures } from "@/utils/changelog";

import classes from "./Changelog.module.css";

const sections = [
  { key: "features", label: "新機能", color: "green", icon: <IconSparkles size="1rem" /> },
  { key: "improvements", label: "改善", color: "blue", icon: <IconWand size="1rem" /> },
  { key: "fixes", label: "不具合修正", color: "orange", icon: <IconBug size="1rem" /> },
] as const;

const Changelog: React.FC = () => {
  return (
    <>
      <Title order={2} className={classes.page_heading}>
        今後追加予定の機能
      </Title>
      <List
        spacing="sm"
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

      <Title order={2} className={classes.page_heading} mt="xl">
        アップデート履歴
      </Title>
      <Box className={classes.entry_list}>
        {changelog.map((entry) => {
          const [year, month, day] = entry.date.split("-");
          return (
            <Box key={entry.version} component="section">
              <Group
                justify="space-between"
                align="baseline"
                wrap="nowrap"
                className={classes.version_heading}
              >
                <Title order={3}>v{entry.version}</Title>
                <Text size="sm" c="dimmed">
                  {`${year}年${Number(month)}月${Number(day)}日`}
                </Text>
              </Group>
              {entry.news && <Text mt="md">{entry.news}</Text>}
              {sections.map((section) => {
                const items = entry[section.key];
                if (!items || items.length === 0) return null;
                return (
                  <Box key={section.key} className={classes.section}>
                    <Title order={4} className={classes.section_heading}>
                      <Group gap="xs">
                        <ThemeIcon variant="light" color={section.color} size="sm" radius="xl">
                          {section.icon}
                        </ThemeIcon>
                        {section.label}
                      </Group>
                    </Title>
                    <List size="sm" spacing="sm" withPadding>
                      {items.map((item, i) => {
                        const text = typeof item === "string" ? item : item.text;
                        const image = typeof item === "string" ? undefined : item.image;
                        const imageAlt = typeof item === "string" ? undefined : item.imageAlt;
                        return (
                          <List.Item key={i}>
                            {text}
                            {image && (
                              <Image
                                src={image}
                                alt={imageAlt ?? text}
                                className={classes.feature_image}
                                mt="xs"
                              />
                            )}
                          </List.Item>
                        );
                      })}
                    </List>
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Box>

      <Title order={2} className={classes.page_heading} mt="xl">
        ご要望・不具合のご報告
      </Title>
      <Text size="sm" mb="md">
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
    </>
  );
};

export default Changelog;
