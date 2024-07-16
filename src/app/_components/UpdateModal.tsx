"use client";

import { useEffect, useState } from "react";

import { Box, List, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import Link from "./Link/Link";

const UpdateModal: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentVersion, setCurrentVersion] = useState<string | null>("");
  const latestVersion = process.env.NEXT_PUBLIC_APP_VERSION;

  useEffect(() => {
    const raw = window.localStorage.getItem("scorewatcher-version");
    if (raw !== latestVersion) {
      setCurrentVersion(raw);
      open();
    }
    // Vite + Reactのときのキャッシュを削除
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        if (cacheName.startsWith("workbox-precache-v2")) {
          caches.delete(cacheName);
          navigator.serviceWorker
            .getRegistrations()
            .then(function (registrations) {
              // 登録されているworkerを全て削除する
              for (let registration of registrations) {
                registration.unregister();
              }
            });
        }
      });
    });
  }, []);

  const onUpdate = () => {
    window.localStorage.setItem("scorewatcher-version", latestVersion!);
    close();
  };

  const feature = {
    news: (
      <>
        約1年ぶりとなるメジャーアップデートを行いました。さらにパワーアップしたScore
        Watcherをお楽しみください！
        <br />
        これに合わせ、利用規約とプライバシーポリシー、商用利用に関するルールを策定いたしました。以前よりご案内しておりましたが、当サイトを無断で商用に利用することは原則として禁止としております。「アプリ情報」からこれらを確認し、同意の上でご利用をお願いいたします。
        <br />
        今後ともScore Watcherをよろしくお願いいたします。
      </>
    ),
    feature: [
      "フォントを変更 / 全体的にUIを再設計",
      "ゲーム開始後プレイヤーの人数を変更できるよう改善",
      "AQLルールを「その他の形式」から「形式一覧」に移動し他の形式とロジックを統合",
      "「ゲーム一覧」でグリッド表示とテーブル表示を切り替えられるよう改善",
      "得点表示画面下部の「ゲームログ」で幅が長いとき横スクロールできるよう改善",
    ],
    bugfix: [],
  };

  return (
    <Modal
      opened={opened}
      onClose={onUpdate}
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
