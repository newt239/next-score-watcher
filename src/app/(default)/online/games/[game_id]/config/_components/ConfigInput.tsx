"use client";

import { useState, useTransition } from "react";

import { TextInput } from "@mantine/core";

import type { UpdateGameSettingsRequestType } from "@/models/games";

import createApiClient from "@/utils/hono/client";

type ConfigInputProps = {
  gameId: string;
  label: string;
  placeholder?: string;
  value: string | undefined;
  fieldName: keyof UpdateGameSettingsRequestType;
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

  const updateSetting = async (newValue: string) => {
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
