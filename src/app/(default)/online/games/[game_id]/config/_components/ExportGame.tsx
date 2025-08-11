"use client";

import { useTransition } from "react";

import { Box, Button, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { sendGAEvent } from "@next/third-parties/google";
import { IconFileExport } from "@tabler/icons-react";
import { cdate } from "cdate";
import { parseResponse } from "hono/client";

import type { OnlineGameProps } from "@/models/games";

import createApiClient from "@/utils/hono/client";

type Props = {
  game: OnlineGameProps;
};

/**
 * オンライン版ゲームエクスポートコンポーネント
 * ゲームデータをJSONファイルとしてエクスポート
 */
const ExportGame: React.FC<Props> = ({ game }) => {
  const [isPending, startTransition] = useTransition();

  const handleExportGame = async () => {
    startTransition(async () => {
      try {
        // ゲームデータを取得
        const apiClient = createApiClient();
        const gameData = await parseResponse(
          apiClient.games[":gameId"].$get({
            param: { gameId: game.id },
          })
        );

        if ("error" in gameData) {
          throw new Error(gameData.error);
        }

        sendGAEvent({
          event: "export_game",
          value: game.rule,
        });

        // JSONファイルとしてダウンロード
        const blob = new Blob([JSON.stringify(gameData.game, null, "\t")], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `score-watcher_${game.id}_${cdate().format(
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
