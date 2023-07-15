import { useEffect, useId, useState } from "react";
import { useParams } from "react-router-dom";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import { useDebounce } from "#/hooks/useDebounce";
import db from "#/utils/db";
import { GameDBProps } from "#/utils/types";

type ConfigInputProps = {
  input_id: keyof GameDBProps;
  label: string;
  placehodler: string;
  disabled?: boolean;
  helperText?: React.ReactNode;
};

const ConfigInput: React.FC<ConfigInputProps> = ({
  input_id,
  label,
  placehodler,
  disabled,
  helperText,
}) => {
  const id = useId();
  const { game_id } = useParams();
  const game = useLiveQuery(() => db.games.get(game_id as string));
  const [inputText, setInputText] = useState<string>("");
  const debouncedInputText = useDebounce(inputText, 500);

  useEffect(() => {
    if (game) {
      setInputText(game[input_id] as string);
    }
  }, [game]);

  useEffect(() => {
    if (inputText !== "") {
      db.games.update(game_id as string, {
        [input_id]: inputText,
      });
    }
  }, [debouncedInputText]);

  if (!game) return null;

  return (
    <FormControl pt={5}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Input
        disabled={disabled}
        id={id}
        onChange={(v) => setInputText(v.target.value)}
        placeholder={placehodler}
        type="text"
        value={inputText}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default ConfigInput;
