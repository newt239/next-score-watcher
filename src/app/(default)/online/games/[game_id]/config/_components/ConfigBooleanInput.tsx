"use client";

import { useState, useTransition } from "react";

import { Switch, Text } from "@mantine/core";

import { useGameState } from "../_hooks/useGameState";

import type { GameOptionKey } from "@/utils/drizzle/types";

import createApiClient from "@/utils/hono/browser";

type ConfigBooleanInputProps = {
  gameId: string;
  label: string;
  helperText?: string;
  value: boolean | undefined;
  fieldName: GameOptionKey;
};

/**
 * ブール値入力コンポーネント
 */
const ConfigBooleanInput: React.FC<ConfigBooleanInputProps> = ({
  gameId,
  label,
  helperText,
  value,
  fieldName,
}) => {
  const apiClient = createApiClient();
  const [localValue, setLocalValue] = useState(value || false);
  const [isPending, startTransition] = useTransition();
  const { updateGame } = useGameState();

  const updateSetting = async (newValue: boolean) => {
    try {
      const response = await apiClient.games[":gameId"].options.$patch({
        param: { gameId },
        json: {
          key: fieldName,
          value: newValue,
        },
      });

      if (!response.ok) {
        console.error("Failed to update option");
      } else {
        // ゲーム状態を更新してGameStartButtonに反映
        await updateGame();
      }
    } catch (error) {
      console.error("Failed to update setting:", error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.checked;
    setLocalValue(newValue);

    startTransition(() => {
      updateSetting(newValue);
    });
  };

  return (
    <div>
      <Switch
        label={label}
        checked={localValue}
        onChange={handleChange}
        disabled={isPending}
      />
      {helperText && (
        <Text size="sm" c="dimmed" mt="xs">
          {helperText}
        </Text>
      )}
    </div>
  );
};

export default ConfigBooleanInput;
