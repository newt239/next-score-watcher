"use client";

import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Divider,
  Group,
  List,
  Modal,
  ScrollArea,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBug, IconRocket, IconSparkles, IconTool, IconWand } from "@tabler/icons-react";
import Link from "next/link";

import { changelog } from "@/utils/changelog";

import classes from "./UpdateModal.module.css";

const sections = [
  { key: "features", label: "新機能", color: "green", icon: <IconSparkles size="1rem" /> },
  { key: "improvements", label: "改善", color: "blue", icon: <IconWand size="1rem" /> },
  { key: "fixes", label: "不具合修正", color: "orange", icon: <IconBug size="1rem" /> },
  { key: "others", label: "その他", color: "gray", icon: <IconTool size="1rem" /> },
] as const;

const UpdateModal: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentVersion, setCurrentVersion] = useState<string | null>("");
  const latestVersion = process.env.NEXT_PUBLIC_APP_VERSION;
  // パッチリリース時も直近のマイナーリリースの内容を引き続き表示するため、同一マイナー系列のエントリをまとめる
  const [latestMajor, latestMinor] = changelog[0].version.split(".");
  const seriesEntries = changelog.filter((entry) => {
    const [major, minor] = entry.version.split(".");
    return major === latestMajor && minor === latestMinor;
  });
  const news = seriesEntries.find((entry) => entry.news)?.news;

  useEffect(() => {
    const raw = window.localStorage.getItem("scorewatcher-version");
    if (raw !== latestVersion) {
      setCurrentVersion(raw);
      open();
      window.localStorage.setItem("scorewatcher-version", latestVersion!);
    }
    // キャッシュ全削除
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
          // 登録されているworkerを全て削除する
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      });
    });
  }, []);

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="新しいバージョンがリリースされました"
      centered
      radius="md"
      size="lg"
    >
      <Group
        gap="sm"
        mb="md"
        p="sm"
        style={{ borderRadius: "var(--mantine-radius-md)" }}
        bg="var(--mantine-color-blue-light)"
        wrap="nowrap"
      >
        <ThemeIcon variant="white" color="blue" size="lg" radius="xl">
          <IconRocket size="1.4rem" />
        </ThemeIcon>
        <Text fw={700}>
          {currentVersion && `v.${currentVersion} から `}v.{latestVersion} にアップデートしました
        </Text>
      </Group>

      <ScrollArea.Autosize mah="50vh" offsetScrollbars>
        {news && <Text mb="sm">{news}</Text>}
        {sections.map((section) => {
          const items = seriesEntries.flatMap((entry) => entry[section.key] ?? []);
          if (items.length === 0) return null;
          return (
            <Box key={section.key} mt="md">
              <Group gap="xs" mb={4}>
                <ThemeIcon variant="light" color={section.color} size="sm" radius="xl">
                  {section.icon}
                </ThemeIcon>
                <Text fw={700} size="md">
                  {section.label}
                </Text>
              </Group>
              <List size="sm" spacing={4} fz="md">
                {items.map((item, i) => (
                  <List.Item key={i}>{typeof item === "string" ? item : item.text}</List.Item>
                ))}
              </List>
            </Box>
          );
        })}
      </ScrollArea.Autosize>

      <Divider my="md" />
      <Box className={classes.footer}>
        <Button variant="subtle" color="gray" onClick={close}>
          閉じる
        </Button>
        <Button component={Link} href="/changelog" onClick={close}>
          <Box component="span" hiddenFrom="sm">
            詳しく見る
          </Box>
          <Box component="span" visibleFrom="sm">
            アップデート履歴を見る
          </Box>
        </Button>
      </Box>
    </Modal>
  );
};

export default UpdateModal;
