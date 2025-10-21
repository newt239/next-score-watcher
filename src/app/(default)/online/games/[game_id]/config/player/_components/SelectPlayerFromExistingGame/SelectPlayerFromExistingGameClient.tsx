"use client";

import { useTransition } from "react";

import { Box, NativeSelect } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { sendGAEvent } from "@next/third-parties/google";
import { parseResponse } from "hono/client";

import type { RuleNames } from "@/models/game";

import createApiClient from "@/utils/hono/browser";
import { rules } from "@/utils/rules";

type SelectPlayerFromExistingGameClientProps = {
  game_id: string;
  games: {
    id: string;
    name: string;
    ruleType: RuleNames;
  }[];
};

/**
 * 既存のゲームと同じプレイヤーを選択する
 */
const SelectPlayerFromExistingGameClient: React.FC<
  SelectPlayerFromExistingGameClientProps
> = ({ game_id, games }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <p>これまでに作成したゲームと同じプレイヤーを選択できます。</p>
      <Box mt={3}>
        <NativeSelect
          onChange={async (e) => {
            if (isPending) return;

            const selectedGame = games?.find(
              (game) => game.id === e.target.value
            );
            if (selectedGame) {
              startTransition(async () => {
                const apiClient = createApiClient();
                const response = await parseResponse(
                  apiClient.games[":game_id"]["copy-players"].$post({
                    param: { game_id },
                    json: { sourceGameId: selectedGame.id },
                  })
                );

                if ("error" in response) {
                  console.error(
                    "Failed to copy players from existing game:",
                    response.error
                  );
                  notifications.show({
                    title: "エラーが発生しました",
                    message: "プレイヤーのコピーに失敗しました",
                    color: "red",
                  });
                  return;
                }

                notifications.show({
                  title: "プレイヤーをコピーしました",
                  message: `${response.data.copiedCount}件のプレイヤーをコピーしました`,
                  color: "green",
                });

                sendGAEvent({
                  event: "select_player_from_existing_game",
                  value: game_id,
                });
              });
            }
          }}
          disabled={isPending}
        >
          <option value="">選択してください</option>
          {games
            .filter((game) => game.id !== game_id) // 今開いているゲームは除外
            .map((game) => (
              <option key={game.id} value={game.id}>
                {rules[game.ruleType]?.name || "不明な形式"}
              </option>
            ))}
        </NativeSelect>
      </Box>
    </>
  );
};

export default SelectPlayerFromExistingGameClient;
