import { Box, Select, Text } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import db from "~/utils/db";

type SelectPlayerFromExistingGameProps = {
  game_id: string;
};

const SelectPlayerFromExistingGame: React.FC<
  SelectPlayerFromExistingGameProps
> = ({ game_id }) => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const games = useLiveQuery(() => db(currentProfile).games.toArray(), []);

  if (!games) return null;

  return (
    <Box>
      <Text>
        これまでに作成したゲームで選択したプレイヤーをまとめて選択できます。
      </Text>
      <Select
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
        {games
          .filter((game) => game.players.length !== 0)
          .map((game) => (
            <option key={game.id} value={game.id}>
              {game.name} ({" "}
              {game.players.map((player) => player.name).join(", ")} )
            </option>
          ))}
      </Select>
    </Box>
  );
};

export default SelectPlayerFromExistingGame;
