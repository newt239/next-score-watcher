import { useRouter } from "next/router";

import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import db, { GameDBProps } from "#/utils/db";

type ConfigInputProps = {
  input_id: keyof GameDBProps;
  label: string;
  placehodler: string;
};

const ConfigInput: React.FC<ConfigInputProps> = ({
  input_id,
  label,
  placehodler,
}) => {
  const router = useRouter();
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(Number(game_id)));
  const players = useLiveQuery(() => db.players.toArray(), []);
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  if (!game || !players || !logs) {
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
        disabled={logs.length !== 0}
      />
    </FormControl>
  );
};

export default ConfigInput;
