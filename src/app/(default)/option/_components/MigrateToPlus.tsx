"use client";

import { useTransition } from "react";

import { Anchor, Button, Group, List, Text, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { sendGAEvent } from "@next/third-parties/google";
import { cdate } from "cdate";

import { CURRENT_PROFILE_STORAGE_KEY } from "@/utils/current-profile";
import db from "@/utils/db";
import { downloadJson } from "@/utils/download-json";

const PLUS_MIGRATION_URL = "https://plus.score-watcher.com/migration";

type Props = {
  currentProfile: string;
};

const MigrateToPlus: React.FC<Props> = ({ currentProfile }) => {
  const [storedCurrentProfile] = useLocalStorage({
    key: CURRENT_PROFILE_STORAGE_KEY,
    defaultValue: currentProfile,
  });
  const [isPending, startTransition] = useTransition();

  const exportMigrationData = () => {
    // 書き出し完了を待つとポップアップブロックに掛かるため、クリック直後にタブを確保する
    const plusWindow = window.open("", "_blank");

    startTransition(async () => {
      const localDB = db(storedCurrentProfile);
      const data = {
        meta: {
          format: "score-watcher-local",
          version: 1,
          app_version: process.env.NEXT_PUBLIC_APP_VERSION,
          exported_at: cdate().text(),
          profile: storedCurrentProfile,
        },
        games: await localDB.games.toArray(),
        players: await localDB.players.toArray(),
        quizes: await localDB.quizes.toArray(),
        // 取り消し済みのログはScore Watcher Plusに引き継げないため除外する
        logs: await localDB.logs.where({ available: 1 }).toArray(),
      };

      sendGAEvent("event", "export_migration_data", { games: data.games.length });
      downloadJson(data, `score-watcher_migration_${cdate().format("YYMMDDHHmm")}.json`);

      if (plusWindow) {
        plusWindow.opener = null;
        plusWindow.location.href = PLUS_MIGRATION_URL;
      }

      const summary = `ゲーム${data.games.length}件、プレイヤー${data.players.length}件、問題${data.quizes.length}件を含みます。`;

      notifications.show({
        title: "移行用データを書き出しました",
        message: plusWindow
          ? `${summary}開いたページから取り込んでください。`
          : `${summary}ポップアップがブロックされたため、上のリンクからScore Watcher Plusを開いてください。`,
        autoClose: 9000,
        withCloseButton: true,
      });
    });
  };

  return (
    <>
      <Title order={3}>Score Watcher Plusへの移行</Title>
      <Text>
        現在のプロファイルのデータを、
        <Anchor href={PLUS_MIGRATION_URL} target="_blank" rel="noopener noreferrer">
          Score Watcher Plus
        </Anchor>
        に取り込むための形式で書き出し、取り込みページを開きます。
      </Text>
      <List mt="sm">
        <List.Item>取り込みにはScore Watcher Plusへのログインが必要です。</List.Item>
        <List.Item>「元に戻す」で取り消した操作ログは引き継がれません。</List.Item>
      </List>
      <Group justify="flex-start" gap="1rem" mt="sm" mb="lg">
        <Button
          onClick={exportMigrationData}
          loading={isPending}
          disabled={isPending}
          color="green"
        >
          移行用データを書き出す
        </Button>
      </Group>
    </>
  );
};

export default MigrateToPlus;
