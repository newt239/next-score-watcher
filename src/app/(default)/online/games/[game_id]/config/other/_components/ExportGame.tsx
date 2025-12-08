"use client";

import { useTransition } from "react";

import { Box, Button, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { sendGAEvent } from "@next/third-parties/google";
import { IconFileExport } from "@tabler/icons-react";
import { cdate } from "cdate";
import { parseResponse } from "hono/client";

import type { RuleNames } from "@/models/game";

import createApiClient from "@/utils/hono/browser";

type Props = {
  gameId: string;
  ruleType: RuleNames;
};

/**
 * オンライン版ゲームエクスポートコンポーネント
 * ゲームデータをJSONファイルとしてエクスポート
 */
const ExportGame: React.FC<Props> = ({ gameId, ruleType }) => {
  const [isPending, startTransition] = useTransition();

  const handleExportGame = async () => {
    startTransition(async () => {
      try {
        // ゲームデータを取得
        const apiClient = createApiClient();
        const gameData = await parseResponse(
          apiClient.games[":gameId"].$get({
            param: { gameId },
          })
        );

        if ("error" in gameData) {
          throw new Error(String(gameData.error));
        }

        sendGAEvent({
          event: "export_game",
          value: ruleType,
        });

        // JSONファイルとしてダウンロード
        const blob = new Blob([JSON.stringify(gameData, null, "\t")], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `score-watcher_${gameId}_${cdate().format(
          "YYMMDDHHmm"
        )}.json`;
        a.click();

        notifications.show({
          title: "ゲームをエクスポートしました",
          message: "ゲームデータをダウンロードしました",
          autoClose: 9000,
          withCloseButton: true,
        });
      } catch (error) {
        console.error("Failed to export game:", error);
        notifications.show({
          title: "エラーが発生しました",
          message: "ゲームのエクスポートに失敗しました",
          color: "red",
          autoClose: 9000,
          withCloseButton: true,
        });
      }
    });
  };

  return (
    <Box mt="sm">
      <Title order={4}>エクスポート</Title>
      <Button
        onClick={handleExportGame}
        leftSection={<IconFileExport />}
        mt="sm"
        disabled={isPending}
      >
        ゲームをエクスポート
      </Button>
    </Box>
  );
};

export default ExportGame;
