import { useParams } from "next/navigation";
import { useId } from "react";

import { Switch } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useLiveQuery } from "dexie-react-hooks";

import db from "@/utils/db";
import { GameOptionProps, RuleNames } from "@/utils/types";

type Props = {
  [T in RuleNames]: {
    rule: T;
    input_id: keyof GameOptionProps[T];
    label: string;
    disabled?: boolean;
    helperText?: React.ReactNode;
  };
};

const ConfigBooleanInput: React.FC<Props[RuleNames]> = ({
  input_id,
  label,
  disabled,
  helperText,
}) => {
  const [currentProfile] = useLocalStorage({
    key: "scorew_current_profile",
    defaultValue: "score_watcher",
  });
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
    <Switch
      label={label}
      description={helperText}
      id={innerId}
      checked={isChecked}
      disabled={disabled}
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
  );
};

export default ConfigBooleanInput;
