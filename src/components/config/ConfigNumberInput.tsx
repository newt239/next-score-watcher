import { useRouter } from "next/router";

import {
  FormControl,
  FormLabel,
  Input,
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
  if (!game) {
    return null;
  }
  const inputValue = () => {
    return game[input_id] as string;
  };

  return (
    <FormControl pt={5}>
      <FormLabel>{label}</FormLabel>
      <NumberInput
        value={inputValue()}
        min={min}
        max={max}
        onChange={(s) => {
          db.games.update(game_id as string, {
            [input_id]: s,
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
