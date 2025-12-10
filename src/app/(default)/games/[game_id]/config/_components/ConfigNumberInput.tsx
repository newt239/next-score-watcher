"use client";

import { useParams } from "next/navigation";
import { useId } from "react";

import { NumberInput } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";

import type { GamePropsUnion } from "@/utils/types";

import db from "@/utils/db";

type Props = {
  input_id: keyof GamePropsUnion;
  label: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  currentProfile: string;
};

const ConfigNumberInput: React.FC<Props> = ({
  input_id,
  label,
  min = 0,
  max = 100,
  disabled,
  currentProfile,
}) => {
  const id = useId();
  const { game_id } = useParams();
  const game = useLiveQuery(() => db(currentProfile).games.get(game_id as string));

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
        db(currentProfile).games.update(game_id as string, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [input_id as any]: typeof n === "string" ? parseInt(n) : n,
        });
      }}
      value={typeof value === "number" ? value : ""}
    />
  );
};

export default ConfigNumberInput;
