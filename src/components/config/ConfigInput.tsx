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
  id?: string;
  input_id: keyof GameDBProps;
  label?: string;
  placehodler: string;
  disabled?: boolean;
  helperText?: React.ReactNode;
};

const ConfigInput: React.FC<ConfigInputProps> = ({
  id,
  input_id,
  label,
  placehodler,
  disabled,
  helperText,
}) => {
  const innerId = useId();
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

  if (!label)
    return (
      <Input
        disabled={disabled}
        id={innerId}
        onChange={(v) => setInputText(v.target.value)}
        placeholder={placehodler}
        type="text"
        value={inputText}
        w="auto"
      />
    );

  return (
    <FormControl>
      <FormLabel htmlFor={innerId}>{label}</FormLabel>
      <Input
        disabled={disabled}
        id={id || innerId}
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
