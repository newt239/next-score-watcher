import { useEffect, useId, useState } from "react";
import { useParams } from "react-router-dom";

import { Input } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import InputLayout from "~/components/common/InputLayout";
import { useDebounce } from "~/hooks/useDebounce";
import db from "~/utils/db";
import { GamePropsUnion } from "~/utils/types";

type ConfigInputProps = {
  input_id: keyof GamePropsUnion;
  label: string;
  placeholder: string;
  disabled?: boolean;
  helperText?: React.ReactNode;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
};

const ConfigInput: React.FC<ConfigInputProps> = ({
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
  const debouncedInputText = useDebounce(inputText, 500);

  useEffect(() => {
    if (game) {
      setInputText(game[input_id] as string);
    }
  }, [game]);

  useEffect(() => {
    if (inputText !== "") {
      db(currentProfile).games.update(game_id as string, {
        [input_id]: inputText,
      });
    }
  }, [debouncedInputText]);

  if (!game) return null;

  return (
    <InputLayout label={label} helperText={helperText}>
      <Input
        id={innerId}
        isDisabled={disabled}
        onChange={(v) => setInputText(v.target.value)}
        placeholder={placeholder}
        type={type || "text"}
        value={inputText}
        width="auto"
      />
    </InputLayout>
  );
};

export default ConfigInput;
