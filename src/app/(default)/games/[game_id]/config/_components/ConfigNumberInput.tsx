"use client";

import { useParams } from "next/navigation";
import { useId } from "react";

import { NumberInput } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";

import db from "@/utils/db";
import { GamePropsUnion } from "@/utils/types";

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
  const id = useId();
  const { game_id } = useParams();
  const game = useLiveQuery(() => db().games.get(game_id as string));

  if (!game) return null;

  const value = game[input_id];

  return (
    <NumberInput
      size="md"
      label={label}
      id={id}
      disabled={disabled}
      max={max}
      min={min}
      onChange={(n) => {
        db().games.update(game_id as string, {
          [input_id as any]: typeof n === "string" ? parseInt(n) : n,
        });
      }}
      value={typeof value === "number" ? value : ""}
    />
  );
};

export default ConfigNumberInput;
