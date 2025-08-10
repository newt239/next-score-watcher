"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Box, Button, Group, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { sendGAEvent } from "@next/third-parties/google";

import type { GamePropsUnion } from "@/utils/types";

import createApiClient from "@/utils/hono/client";

type CopyGamePropsUnion = {
  game: GamePropsUnion;
};

/**
 * オンライン版ゲームコピーコンポーネント
 * ゲームの形式設定のみ、またはすべてをコピー
 */
const CopyGame: React.FC<CopyGamePropsUnion> = ({ game }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const copyGame = async (copyType: "copy-rule" | "copy-all") => {
    startTransition(async () => {
      try {
        const apiClient = createApiClient();
        const response = await apiClient.games.$post({
          json: [
            {
              name: `${game.name} のコピー`,
              ruleType: game.rule,
              discordWebhookUrl:
                copyType === "copy-all" ? game.discord_webhook_url : undefined,
            },
          ],
        });

        if (!response.ok) {
          throw new Error("Failed to copy game");
        }

        const newGame = await response.json();

        sendGAEvent({
          event: "copy_game",
          value: game.rule,
        });

        notifications.show({
          title: "ゲームをコピーしました",
          message: `${game.name} のコピーを作成しました`,
          autoClose: 9000,
          withCloseButton: true,
        });

        router.push(`/online/games/${newGame.data.ids[0]}/config`);
      } catch (error) {
        console.error("Failed to copy game:", error);
        notifications.show({
          title: "エラーが発生しました",
          message: "ゲームのコピーに失敗しました",
          color: "red",
          autoClose: 9000,
          withCloseButton: true,
        });
      }
    });
  };

  return (
    <Box mt="sm">
      <Title order={4}>コピーを作成</Title>
      <Group mt="sm">
        <Button onClick={() => copyGame("copy-rule")} disabled={isPending}>
          形式設定のみコピー
        </Button>
        <Button onClick={() => copyGame("copy-all")} disabled={isPending}>
          すべてコピー
        </Button>
      </Group>
    </Box>
  );
};

export default CopyGame;
