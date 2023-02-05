import { useRouter } from "next/router";

import {
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import db, { GameDBProps } from "#/utils/db";

type ConfigNumberInputProps = {
  input_id: keyof GameDBProps;
  label: string;
  min?: number;
  max?: number;
  disabled?: boolean;
};

const ConfigNumberInput: React.FC<ConfigNumberInputProps> = ({
  input_id,
  label,
  min = 1,
  max = 10,
  disabled,
}) => {
  const router = useRouter();
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(game_id as string));

  if (!game) return null;

  return (
    <FormControl pt={5}>
      <FormLabel>{label}</FormLabel>
      <NumberInput
        value={game[input_id] as number}
        min={min}
        max={max}
        onChange={(s, n) => {
          db.games.update(game_id as string, {
            [input_id]: n,
          });
        }}
        isDisabled={disabled}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </FormControl>
  );
};

export default ConfigNumberInput;
