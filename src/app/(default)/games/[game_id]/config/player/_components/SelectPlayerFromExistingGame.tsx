"use client";

import { Box, NativeSelect } from "@mantine/core";
import { sendGAEvent } from "@next/third-parties/google";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";

import db from "@/utils/db";
import { getRuleStringByType } from "@/utils/rules";

import type { GameDBPlayerProps } from "@/utils/types";

import type { UseFormReturnType } from "@mantine/form";

type Props = {
  game_id: string;
  currentProfile: string;
  form: UseFormReturnType<
    {
      players: GameDBPlayerProps[];
    },
    {
      players: GameDBPlayerProps[];
    }
  >;
};

const SelectPlayerFromExistingGame: React.FC<Props> = ({ game_id, currentProfile, form }) => {
  const games = useLiveQuery(() => db(currentProfile).games.toArray(), [currentProfile]);
  const logs = useLiveQuery(() => db(currentProfile).logs.toArray(), [currentProfile]);

  if (!games) return null;

  return (
    <>
      <p>これまでに作成したゲームで選択したプレイヤーをまとめて選択できます。</p>
      <Box mt={3}>
        <NativeSelect
          onChange={async (e) => {
            const selectedGame = games?.find((game) => game.id === e.target.value);
            if (selectedGame) {
              await db(currentProfile).games.update(game_id, {
                players: selectedGame.players,
              });
              form.setFieldValue("players", selectedGame.players);
              sendGAEvent("event", "select_player_from_existing_game", { game_id });
              const gameLogIdList = logs
                ?.filter((log) => log.game_id === game_id)
                .map((log) => log.id);
              if (gameLogIdList) {
                await db(currentProfile).logs.bulkDelete(gameLogIdList);
              }
            }
          }}
        >
          <option value="">選択してください</option>
          {games
            .filter((game) => game.players.length !== 0)
            .toSorted((a, b) => {
              if (a.last_open > b.last_open) return -1;
              if (a.last_open < b.last_open) return 1;
              return 0;
            })
            .map((game) => (
              <option key={game.id} value={game.id}>
                {getRuleStringByType(game)} ({cdate(game.last_open).format("MM/DD HH:mm")})
              </option>
            ))}
        </NativeSelect>
      </Box>
    </>
  );
};

export default SelectPlayerFromExistingGame;
