"use client";

import { useParams } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useLiveQuery } from "dexie-react-hooks";

import db from "@/utils/db";
import { GamePropsUnion } from "@/utils/types";

type Props = {
  input_id: keyof GamePropsUnion;
  label: string;
  placeholder: string;
  disabled?: boolean;
  helperText?: React.ReactNode;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  currentProfile: string;
};

const ConfigInput: React.FC<Props> = ({
  input_id,
  label,
  placeholder,
  disabled,
  helperText,
  type,
  currentProfile,
}) => {
  const innerId = useId();
  const { game_id } = useParams();
  const game = useLiveQuery(() =>
    db(currentProfile).games.get(game_id as string)
  );
  const [inputText, setInputText] = useState<string>("");
  const debouncedInputText = useDebouncedValue(inputText, 500);

  useEffect(() => {
    if (game) {
      setInputText(game[input_id] as string);
    }
  }, [game]);

  useEffect(() => {
    if (inputText !== "") {
      db(currentProfile).games.update(game_id as string, {
        [input_id as any]: inputText,
      });
    }
  }, [debouncedInputText]);

  if (!game) return null;

  return (
    <TextInput
      id={innerId}
      disabled={disabled}
      label={label}
      description={helperText}
      onChange={(v) => setInputText(v.target.value)}
      placeholder={placeholder}
      type={type || "text"}
      value={inputText}
      width="auto"
      size="md"
    />
  );
};

export default ConfigInput;
