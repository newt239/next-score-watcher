import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import { useDebounce } from "#/hooks/useDebounce";
import db, { GameDBProps } from "#/utils/db";

type ConfigInputProps = {
  input_id: keyof GameDBProps;
  label: string;
  placehodler: string;
  disabled?: boolean;
};

const ConfigInput: React.FC<ConfigInputProps> = ({
  input_id,
  label,
  placehodler,
  disabled,
}) => {
  const router = useRouter();
  const { game_id } = router.query;
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
      <FormLabel htmlFor={`game_${input_id}`}>{label}</FormLabel>
      <Input
        id={`game_${input_id}`}
        type="text"
        placeholder={placehodler}
        value={inputText}
        onChange={(v) => setInputText(v.target.value)}
        disabled={disabled}
      />
    </FormControl>
  );
};

export default ConfigInput;
