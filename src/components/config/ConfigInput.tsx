import { useRouter } from "next/router";

import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

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
  if (!game) {
    return null;
  }
  const inputValue = () => {
    return game[input_id] as string;
  };
  return (
    <FormControl pt={5}>
      <FormLabel>{label}</FormLabel>
      <Input
        id={`game_${input_id}`}
        type="text"
        placeholder={placehodler}
        value={inputValue()}
        onChange={(v) => {
          db.games.update(Number(game_id), {
            [input_id]: v.target.value as string,
          });
        }}
        disabled={disabled}
      />
    </FormControl>
  );
};

export default ConfigInput;
