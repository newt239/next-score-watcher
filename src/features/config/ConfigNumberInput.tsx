import { useId } from "react";
import { useParams } from "react-router-dom";

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

import db from "~/utils/db";
import { GamePropsUnion } from "~/utils/types";

type ConfigNumberInputProps = {
  input_id: keyof GamePropsUnion;
  label: string;
  min?: number;
  max?: number;
  disabled?: boolean;
};

const ConfigNumberInput: React.FC<ConfigNumberInputProps> = ({
  input_id,
  label,
  min = 0,
  max = 100,
  disabled,
}) => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const id = useId();
  const { game_id } = useParams();
  const game = useLiveQuery(() =>
    db(currentProfile).games.get(game_id as string)
  );

  if (!game) return null;

  const value = game[input_id];

  return (
    <FormControl pt={5}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <NumberInput
        id={id}
        isDisabled={disabled}
        max={max}
        min={min}
        onChange={(s, n) => {
          db(currentProfile).games.update(game_id as string, {
            [input_id]: n,
          });
        }}
        value={typeof value === "number" ? value : ""}
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
