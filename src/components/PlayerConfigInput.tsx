import { useRouter } from "next/router";
import { ChangeEvent } from "react";

import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import db, { PlayerDBProps } from "#/utils/db";

type PlayerConfigInputProps = {
  input_id: keyof PlayerDBProps;
  player_id: number;
  label: string;
  placehodler?: string;
  number?: boolean;
};

const PlayerConfigInput: React.FC<PlayerConfigInputProps> = ({
  input_id,
  player_id,
  label,
  placehodler,
  number = false,
}) => {
  const router = useRouter();
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(Number(game_id)));
  const players = useLiveQuery(
    () => db.players.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  if (!game || !players || !logs) {
    return null;
  }
  const inputValue = () => {
    return (players.find((player) => player.id === player_id) as PlayerDBProps)[
      input_id
    ] as string;
  };
  const props = {
    id: `player_${input_id}${player_id}`,
    value: inputValue(),
    onChange: (v: ChangeEvent<HTMLInputElement>) => {
      db.players.update(player_id, {
        [input_id]: v.target.value as string,
      });
    },
    disabled: logs.length !== 0,
  };

  return (
    <FormControl pt={5}>
      <FormLabel>{label}</FormLabel>
      {!number ? (
        <Input type="text" placeholder={placehodler} {...props} />
      ) : (
        <Input type="number" min={1} max={10} {...props} />
      )}
    </FormControl>
  );
};

export default PlayerConfigInput;
