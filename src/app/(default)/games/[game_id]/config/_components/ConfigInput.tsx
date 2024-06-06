"use client";

import { useEffect, useId, useState } from "react";

import db from "@/utils/db";
import { GamePropsUnion } from "@/utils/types";
import { TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "next/navigation";

type Props = {
  input_id: keyof GamePropsUnion;
  label: string;
  placeholder: string;
  disabled?: boolean;
  helperText?: React.ReactNode;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
};

const ConfigInput: React.FC<Props> = ({
  input_id,
  label,
  placeholder,
  disabled,
  helperText,
  type,
}) => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
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
    />
  );
};

export default ConfigInput;
