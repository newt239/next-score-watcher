import { useRouter } from "next/router";

import { useLiveQuery } from "dexie-react-hooks";
import { Form, Input } from "semantic-ui-react";

import db, { GameDBProps } from "#/utils/db";

type ConfigNumberInputProps = {
  input_id: keyof GameDBProps;
  label: string;
  min?: number;
  max?: number;
};

const ConfigNumberInput: React.FC<ConfigNumberInputProps> = ({
  input_id,
  label,
  min = 1,
  max = 10,
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
    return game[input_id] as string;
  };

  return (
    <Form.Field>
      <label htmlFor={`game_${input_id}`}>{label}</label>
      <Input
        id={`game_${input_id}`}
        type="number"
        value={inputValue()}
        min={min}
        max={max}
        onChange={(v) => {
          db.games.update(Number(game_id), {
            [input_id]: v.target.value as string,
          });
        }}
        disabled={game.started}
      />
    </Form.Field>
  );
};

export default ConfigNumberInput;
