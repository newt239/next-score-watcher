"use client";

import { useEffect, useState, useTransition } from "react";

import { Box, NativeSelect } from "@mantine/core";
import { sendGAEvent } from "@next/third-parties/google";
import { cdate } from "cdate";
import { parseResponse } from "hono/client";

import type { OnlineGameProps } from "@/models/games";

import createApiClient from "@/utils/hono/client";
import { rules } from "@/utils/rules";

type Props = {
  game_id: string;
};

/**
 * オンライン版既存ゲームからプレイヤー選択コンポーネント
 * 既存のゲームからプレイヤーリストをコピー
 */
const SelectPlayerFromExistingGame: React.FC<Props> = ({ game_id }) => {
  const [games, setGames] = useState<OnlineGameProps[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const apiClient = createApiClient();
        const data = await parseResponse(
          apiClient.games.$get({
            query: { limit: "100" },
          })
        );
        if ("games" in data) {
          setGames((data.games as unknown as OnlineGameProps[]) || []);
        } else {
          console.warn("Games data not found in response:", data);
          setGames([]);
        }
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <>
      <p>
        これまでに作成したゲームで選択したプレイヤーをまとめて選択できます。
      </p>
      <Box mt={3}>
        <NativeSelect
          onChange={async (e) => {
            if (isPending) return;

            const selectedGame = games?.find(
              (game) => game.id === e.target.value
            );
            if (selectedGame) {
              startTransition(async () => {
                try {
                  const apiClient = createApiClient();
                  const response = await apiClient.games[":game_id"][
                    "copy-players"
                  ].$post({
                    param: { game_id },
                    json: { sourceGameId: selectedGame.id },
                  });

                  if (!response.ok) {
                    throw new Error("Failed to copy players");
                  }

                  const result = await response.json();
                  if (result.success) {
                    // 成功時はページをリロードしてプレイヤーリストを更新
                    window.location.reload();
                  }

                  sendGAEvent({
                    event: "select_player_from_existing_game",
                    value: game_id,
                  });
                } catch (error) {
                  console.error(
                    "Failed to copy players from existing game:",
                    error
                  );
                }
              });
            }
          }}
          disabled={isPending}
        >
          <option value="">選択してください</option>
          {games
            .filter((game) => game.id !== game_id) // 自分自身は除外
            .toSorted((a, b) => {
              const aTime =
                "last_open" in a ? new Date(a.last_open).getTime() : 0;
              const bTime =
                "last_open" in b ? new Date(b.last_open).getTime() : 0;
              return bTime - aTime;
            })
            .map((game) => (
              <option key={game.id} value={game.id}>
                {rules[game.rule]?.name || "不明な形式"} (
                {"last_open" in game
                  ? cdate(game.last_open).format("MM/DD HH:mm")
                  : "不明"}
                )
              </option>
            ))}
        </NativeSelect>
      </Box>
    </>
  );
};

export default SelectPlayerFromExistingGame;
