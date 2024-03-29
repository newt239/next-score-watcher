import { useId } from "react";
import { useParams } from "react-router-dom";

import {
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Switch,
  VStack,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import db from "~/utils/db";
import { GameOptionProps, RuleNames } from "~/utils/types";

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
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const innerId = useId();
  const { game_id } = useParams();
  const game = useLiveQuery(() =>
    db(currentProfile).games.get(game_id as string)
  );

  if (!game || !game.options) return null;

  let isChecked = false;

  if (game.rule === "nomx-ad" && input_id === "streak_over3") {
    isChecked = game.options[input_id] as boolean;
  } else if (game.rule === "endless-chance" && input_id === "use_r") {
    isChecked = game.options[input_id] as boolean;
  } else {
    return null;
  }

  return (
    <FormControl
      as={Flex}
      p={2}
      sx={{
        justifyContent: ["flex-start", "space-between"],
        alignItems: "center",
        gap: 2,
      }}
    >
      <VStack
        gap={0}
        sx={{
          alignItems: "flex-start",
        }}
      >
        <FormLabel htmlFor={innerId} m={0}>
          {label}
        </FormLabel>
        {helperText && <FormHelperText m={0}>{helperText}</FormHelperText>}
      </VStack>
      <Switch
        id={innerId}
        isChecked={isChecked}
        isDisabled={disabled}
        onChange={(v) => {
          db(currentProfile).games.update(game_id as string, {
            options: {
              ...game.options,
              [input_id]: v.target.checked,
            },
          });
        }}
        size="md"
      />
    </FormControl>
  );
};

export default ConfigBooleanInput;
