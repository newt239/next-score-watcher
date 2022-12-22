import { useRouter } from "next/router";

import { useLiveQuery } from "dexie-react-hooks";
import { Form, Input } from "semantic-ui-react";

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
      {!number ? (
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
          disabled={game.started}
        />
      ) : (
        <Input
          id={`player_${input_id}${player_id}`}
          type="number"
          value={inputValue()}
          min={1}
          max={10}
          onChange={(v) => {
            db.games.update(player_id, {
              [input_id]: v.target.value as string,
            });
          }}
          disabled={game.started}
        />
      )}
    </Form.Field>
  );
};

export default PlayerConfigInput;
