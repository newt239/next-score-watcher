"use client";

import { useEffect, useState } from "react";

import { Box, List, ListItem, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import Link from "@/components/Link";

const UpdateModal: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentVersion, setCurrentVersion] = useState<string | null>("");
  const latestVersion = process.env.NEXT_PUBLIC_APP_VERSION;

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

  const feature = {
    news: (
      <>
        新ルール「アタック25」を追加しました。あわせて複数の形式における機能不備を修正しています。引き続きサポートフォームなどを通じてご報告いただけますと幸いです。
      </>
    ),
    feature: ["新ルール「アタック25」を追加", "表示設定の変更をスコア表示へ即時反映するよう改善"],
    bugfix: [
      "誤答数の記号表示で✕の個数や○の混入が起きる不具合を修正",
      "アプリ設定のトグルが正しく保存されない不具合を修正",
      "N○M✕ / normal 形式のスコア計算・勝ち抜け・敗退判定の不具合を修正",
    ],
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="新しいバージョンがリリースされました"
      centered
      size="auto"
    >
      <Box>
        {currentVersion && `v.${currentVersion} から`} v.{latestVersion} にアップデートしました。
      </Box>
      {feature && (
        <>
          {feature.news && (
            <Box mt="md">
              <Title order={3}>📢お知らせ</Title>
              {feature.news}
            </Box>
          )}
          {feature.feature.length > 0 && (
            <Box mt="md">
              <Title order={3}>🎉新機能</Title>
              <List>
                {feature.feature.map((v, i) => (
                  <ListItem key={i}>{v}</ListItem>
                ))}
              </List>
            </Box>
          )}
          {feature.bugfix.length > 0 && (
            <Box mt="md">
              <Title order={3}>🐛不具合修正</Title>
              <List>
                {feature.bugfix.map((v, i) => (
                  <ListItem key={i}>{v}</ListItem>
                ))}
              </List>
            </Box>
          )}
        </>
      )}
      <Box mt="md">
        詳細は
        <Link href="https://github.com/newt239/next-score-watcher/releases">リリースノート</Link>
        をご確認ください。
      </Box>
    </Modal>
  );
};

export default UpdateModal;
