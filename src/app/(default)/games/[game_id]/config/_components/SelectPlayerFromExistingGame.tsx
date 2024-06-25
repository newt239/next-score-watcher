"use client";

import { Box, NativeSelect } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";

import db from "@/utils/db";

type Props = {
  game_id: string;
  currentProfile: string;
};

const SelectPlayerFromExistingGame: React.FC<Props> = ({
  game_id,
  currentProfile,
}) => {
  const games = useLiveQuery(() => db(currentProfile).games.toArray(), []);

  if (!games) return null;

  return (
    <>
      <p>
        これまでに作成したゲームで選択したプレイヤーをまとめて選択できます。
      </p>
      <Box mt={3}>
        <NativeSelect
          onChange={async (e) => {
            const selectedGame = games?.find(
              (game) => game.id === e.target.value
            );
            if (selectedGame) {
              await db(currentProfile).games.update(game_id, {
                players: selectedGame.players,
              });
            }
          }}
        >
          <option value="">選択してください</option>
          {games
            .filter((game) => game.players.length !== 0)
            .map((game) => (
              <option key={game.id} value={game.id}>
                {game.name} ({" "}
                {game.players.map((player) => player.name).join(", ")} )
              </option>
            ))}
        </NativeSelect>
      </Box>
    </>
  );
};

export default SelectPlayerFromExistingGame;
