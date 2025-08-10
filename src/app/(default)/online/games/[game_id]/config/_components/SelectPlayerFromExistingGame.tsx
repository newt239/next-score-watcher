"use client";

import { useEffect, useState, useTransition } from "react";

import { Box, NativeSelect } from "@mantine/core";
import { sendGAEvent } from "@next/third-parties/google";
import { cdate } from "cdate";
import { parseResponse } from "hono/client";

import type { GamePropsUnion } from "@/utils/types";

import createApiClient from "@/utils/hono/client";
import { getRuleStringByType } from "@/utils/rules";

type Props = {
  game_id: string;
};

/**
 * オンライン版既存ゲームからプレイヤー選択コンポーネント
 * 既存のゲームからプレイヤーリストをコピー
 */
const SelectPlayerFromExistingGame: React.FC<Props> = ({ game_id }) => {
  const [games, setGames] = useState<GamePropsUnion[]>([]);
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
          setGames((data.games as unknown as GamePropsUnion[]) || []);
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
                  // TODO: プレイヤーの一括更新APIが必要
                  // const apiClient = createApiClient();
                  // await apiClient.games.$patch({
                  //   json: [{ id: game_id }],
                  // });
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
            .filter((game) => game.players.length !== 0)
            .toSorted((a, b) => {
              const aTime =
                "last_open" in a ? new Date(a.last_open).getTime() : 0;
              const bTime =
                "last_open" in b ? new Date(b.last_open).getTime() : 0;
              return bTime - aTime;
            })
            .map((game) => (
              <option key={game.id} value={game.id}>
                {getRuleStringByType(game)} (
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
