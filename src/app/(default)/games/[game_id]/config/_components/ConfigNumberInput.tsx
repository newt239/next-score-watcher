import { useId } from "react";

import { useLiveQuery } from "dexie-react-hooks";

import FormControl from "#/app/_components/FormControl";
import NumberInput from "#/app/_components/NumberInput";
import db from "#/utils/db";
import { GamePropsUnion } from "#/utils/types";

type ConfigNumberInputProps = {
  input_id: keyof GamePropsUnion;
  label: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  game_id: string;
};

const ConfigNumberInput: React.FC<ConfigNumberInputProps> = ({
  input_id,
  label,
  min = 0,
  max = 100,
  disabled,
  game_id,
}) => {
  const id = useId();
  const game = useLiveQuery(() => db.games.get(game_id as string));

  if (!game) return null;

  const value = game[input_id];

  return (
    <FormControl label={label}>
      <NumberInput
        disabled={disabled}
        id={id}
        max={max}
        min={min}
        onChange={(e) => {
          db.games.update(game_id as string, {
            [input_id]: e.target.value,
          });
        }}
        value={typeof value === "number" ? value : ""}
      />
    </FormControl>
  );
};

export default ConfigNumberInput;
