import { useId } from "react";
import { useParams } from "react-router-dom";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Switch,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import db from "#/utils/db";
import { GameOptionProps, RuleNames } from "#/utils/types";

type ConfigInputProps = {
  [T in RuleNames]: {
    rule: T;
    input_id: keyof GameOptionProps[T];
    label: string;
    disabled?: boolean;
    helperText?: React.ReactNode;
  };
};

const ConfigBooleanInput: React.FC<ConfigInputProps[RuleNames]> = ({
  input_id,
  label,
  disabled,
  helperText,
}) => {
  const innerId = useId();
  const { game_id } = useParams();
  const game = useLiveQuery(() => db.games.get(game_id as string));

  if (!game || !game.options) return null;

  const isChecked = game.options[input_id] as boolean;

  return (
    <FormControl p={2}>
      <FormLabel htmlFor={innerId}>{label}</FormLabel>
      <Switch
        id={innerId}
        isChecked={isChecked}
        isDisabled={disabled}
        onChange={(v) => {
          db.games.update(game_id as string, {
            options: {
              ...game.options,
              [input_id]: v.target.checked,
            },
          });
        }}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default ConfigBooleanInput;
