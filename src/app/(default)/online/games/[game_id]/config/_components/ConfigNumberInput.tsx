"use client";

import { useState, useTransition } from "react";

import { NumberInput } from "@mantine/core";
import { parseResponse } from "hono/client";

import { useGameState } from "../_hooks/useGameState";

import type { GameOptionKey } from "@/utils/drizzle/types";

import createApiClient from "@/utils/hono/browser";

type ConfigNumberInputProps = {
  gameId: string;
  label: string;
  value: number | undefined;
  fieldName: GameOptionKey;
  min?: number;
  max?: number;
};

/**
 * 数値入力コンポーネント
 */
const ConfigNumberInput: React.FC<ConfigNumberInputProps> = ({
  gameId,
  label,
  value,
  fieldName,
  min,
  max,
}) => {
  const [localValue, setLocalValue] = useState<number | string>(value ?? "");
  const [isPending, startTransition] = useTransition();
  const { updateGame } = useGameState();

  const updateSetting = async (newValue: number) => {
    try {
      const apiClient = createApiClient();

      const result = await parseResponse(
        apiClient.games[":gameId"].options.$patch({
          param: { gameId },
          json: {
            key: fieldName,
            value: newValue,
          },
        })
      );

      if (!result.updated) {
        console.error("Failed to update option");
      } else {
        // ゲーム状態を更新してGameStartButtonに反映
        await updateGame();
      }
    } catch (error) {
      console.error("Failed to update setting:", error);
    }
  };

  const handleChange = (newValue: string | number) => {
    setLocalValue(newValue);

    if (typeof newValue === "number") {
      startTransition(() => {
        updateSetting(newValue);
      });
    }
  };

  return (
    <NumberInput
      label={label}
      value={localValue}
      onChange={handleChange}
      min={min}
      max={max}
      disabled={isPending}
    />
  );
};

export default ConfigNumberInput;
