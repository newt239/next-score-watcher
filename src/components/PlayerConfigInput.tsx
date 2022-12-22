import { useRouter } from "next/router";

import { useLiveQuery } from "dexie-react-hooks";
import { Form, Input } from "semantic-ui-react";

import db, { PlayerDBProps } from "#/utils/db";

type PlayerConfigInputProps = {
  input_id: keyof PlayerDBProps;
  player_id: number;
  label: string;
  placehodler: string;
  required: boolean;
};

const PlayerConfigInput: React.FC<PlayerConfigInputProps> = ({
  input_id,
  player_id,
  label,
  placehodler,
  required,
}) => {
  const router = useRouter();
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(Number(game_id)));
  const players = useLiveQuery(
    () => db.players.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  if (!game || !players) {
    return null;
  }
  const inputValue = () => {
    return (players.find((player) => player.id === player_id) as PlayerDBProps)[
      input_id
    ] as string;
  };
  return (
    <Form.Field>
      <label htmlFor={`player_${input_id}${player_id}`}>{label}</label>
      <Input
        id={`player_${input_id}${player_id}`}
        type="text"
        placeholder={placehodler}
        value={inputValue()}
        onChange={(v) => {
          db.players.update(player_id, {
            [input_id]: v.target.value as string,
          });
        }}
      />
    </Form.Field>
  );
};

export default PlayerConfigInput;
