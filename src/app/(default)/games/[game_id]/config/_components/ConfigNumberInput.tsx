import { useLiveQuery } from "dexie-react-hooks";
import { useId } from "react";

import db from "@/utils/db";
import { GamePropsUnion } from "@/utils/types";
import { NumberInput } from "@mantine/core";
import { useParams } from "next/navigation";

type Props = {
  input_id: keyof GamePropsUnion;
  label: string;
  min?: number;
  max?: number;
  disabled?: boolean;
};

const ConfigNumberInput: React.FC<Props> = ({
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
    <NumberInput
      label={label}
      id={id}
      disabled={disabled}
      max={max}
      min={min}
      onChange={(n) => {
        db(currentProfile).games.update(game_id as string, {
          [input_id as any]: typeof n === "string" ? parseInt(n) : n,
        });
      }}
      value={typeof value === "number" ? value : ""}
    />
  );
};

export default ConfigNumberInput;
