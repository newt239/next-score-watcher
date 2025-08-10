"use client";

import { useState, useTransition } from "react";

import { Switch, Text } from "@mantine/core";

import type { UpdateGameSettingsRequestType } from "@/models/games";

import createApiClient from "@/utils/hono/client";

type ConfigBooleanInputProps = {
  gameId: string;
  label: string;
  helperText?: string;
  value: boolean | undefined;
  fieldName: keyof UpdateGameSettingsRequestType;
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
  const [localValue, setLocalValue] = useState(value || false);
  const [isPending, startTransition] = useTransition();

  const updateSetting = async (newValue: boolean) => {
    try {
      const apiClient = createApiClient();
      const updateData = {
        [fieldName]: newValue,
      } as UpdateGameSettingsRequestType;

      const response = await apiClient["games"][":gameId"]["settings"].$patch({
        param: { gameId },
        json: updateData,
      });

      if (!response.ok) {
        console.error("Failed to update setting");
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
