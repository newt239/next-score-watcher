"use client";

import { useState, useTransition } from "react";

import { NumberInput } from "@mantine/core";

import type { UpdateGameSettingsRequestType } from "@/models/games";

import createApiClient from "@/utils/hono/browser";

type ConfigNumberInputProps = {
  gameId: string;
  label: string;
  value: number | undefined;
  fieldName: keyof UpdateGameSettingsRequestType;
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

  const updateSetting = async (newValue: number) => {
    try {
      const apiClient = createApiClient();

      const response = await apiClient.games[":gameId"].$patch({
        param: { gameId },
        json: {
          key: "option",
          value: {
            [fieldName]: newValue,
          },
        },
      });

      if (!response.ok) {
        console.error("Failed to update setting");
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
