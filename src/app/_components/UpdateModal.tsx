"use client";

import { useEffect, useState } from "react";

import { Box, List, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import Link from "../../components/Link";

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
        navigator.serviceWorker
          .getRegistrations()
          .then(function (registrations) {
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
        利用規約とプライバシーポリシー、商用利用に関するルールを策定いたしました。以前よりご案内しておりましたが、当サイトを無断で商用に利用することは原則として禁止としております。「アプリ情報」からこれらを確認し、同意の上でご利用をお願いいたします。
        <br />
        今後ともScore Watcherをよろしくお願いいたします。
      </>
    ),
    feature: ["オンライン機能の提供に向けたアルファ版をリリース"],
    bugfix: [
      "ダークモードにおける表示崩れの修正",
      "一部形式におけるラベルミスを修正",
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
        {currentVersion && `v.${currentVersion} から`} v.{latestVersion}{" "}
        にアップデートしました。
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
                  <List.Item key={i}>{v}</List.Item>
                ))}
              </List>
            </Box>
          )}
          {feature.bugfix.length > 0 && (
            <Box mt="md">
              <Title order={3}>🐛不具合修正</Title>
              <ul>
                {feature.bugfix.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </Box>
          )}
        </>
      )}
      <Box mt="md">
        詳細は
        <Link href="https://github.com/newt239/next-score-watcher/releases">
          リリースノート
        </Link>
        をご確認ください。
      </Box>
    </Modal>
  );
};

export default UpdateModal;
