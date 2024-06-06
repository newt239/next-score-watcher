import { Box, NativeSelect } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useLiveQuery } from "dexie-react-hooks";

import db from "@/utils/db";

type SelectPlayerFromExistingGameProps = {
  game_id: string;
};

const SelectPlayerFromExistingGame: React.FC<
  SelectPlayerFromExistingGameProps
> = ({ game_id }) => {
  const [currentProfile] = useLocalStorage({
    key: "scorew_current_profile",
    defaultValue: "score_watcher",
  });
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
