"use client";

import { useState, useTransition } from "react";

import { TextInput } from "@mantine/core";
import { parseResponse } from "hono/client";

import { useGameState } from "../_hooks/useGameState";

import type { GameOptionKey } from "@/utils/drizzle/types";

import createApiClient from "@/utils/hono/browser";

type ConfigInputProps = {
  gameId: string;
  label: string;
  placeholder?: string;
  value: string | undefined;
  fieldName: "name" | "discordWebhookUrl" | GameOptionKey;
};

/**
 * テキスト入力コンポーネント
 */
const ConfigInput: React.FC<ConfigInputProps> = ({
  gameId,
  label,
  placeholder,
  value,
  fieldName,
}) => {
  const [localValue, setLocalValue] = useState(value || "");
  const [isPending, startTransition] = useTransition();
  const apiClient = createApiClient();
  const { updateGame } = useGameState();

  const updateSetting = async (newValue: string) => {
    try {
      if (fieldName === "name" || fieldName === "discordWebhookUrl") {
        const result = await parseResponse(
          apiClient.games[":gameId"].$patch({
            param: { gameId },
            json: {
              key: fieldName,
              value: newValue,
            },
          })
        );

        if ("error" in result) {
          console.error("Failed to update setting");
        } else {
          // ゲーム状態を更新してGameStartButtonに反映
          await updateGame();
        }
      } else {
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
          console.error("Failed to update setting");
        } else {
          // ゲーム状態を更新してGameStartButtonに反映
          await updateGame();
        }
      }
    } catch (error) {
      console.error("Failed to update setting:", error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLocalValue(newValue);

    startTransition(() => {
      updateSetting(newValue);
    });
  };

  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      value={localValue}
      onChange={handleChange}
      disabled={isPending}
    />
  );
};

export default ConfigInput;
