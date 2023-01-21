import { useRouter } from "next/router";

import {
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import db, { PlayerDBProps } from "#/utils/db";

type PlayerConfigInputProps = {
  input_id: keyof PlayerDBProps;
  player_id: string;
  label: string;
  placehodler?: string;
  number?: boolean;
};

const PlayerConfigInput: React.FC<PlayerConfigInputProps> = ({
  input_id,
  player_id,
  label,
  placehodler,
  number = false,
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
    return (players.find((player) => player.id === player_id) as PlayerDBProps)[
      input_id
    ] as string;
  };

  return (
    <FormControl pt={5}>
      <FormLabel>{label}</FormLabel>
      {!number ? (
        <Input
          type="text"
          value={inputValue()}
          placeholder={placehodler}
          onChange={(v) => {
            db.players.update(player_id, {
              [input_id]: v.target.value as string,
            });
          }}
          disabled={logs.length !== 0}
        />
      ) : (
        <NumberInput
          value={inputValue()}
          min={1}
          max={10}
          onChange={(s) =>
            db.players.update(player_id, {
              [input_id]: s,
            })
          }
          isDisabled={logs.length !== 0}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      )}
    </FormControl>
  );
};

export default PlayerConfigInput;
