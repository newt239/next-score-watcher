import { useId } from "react";

import {
  Flex,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Switch,
} from "@chakra-ui/react";

import db from "#/utils/db";

type ConfigLimitProps = {
  game_id: string;
  limit: number | undefined;
};

const ConfigNumberInput: React.FC<ConfigLimitProps> = ({ game_id, limit }) => {
  const id = useId();

  const onGameLimitToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    db.games.update(game_id, {
      limit: event.target.checked ? 10 : undefined,
    });
  };

  return (
    <FormControl pt={5}>
      <FormLabel htmlFor={id}>限定問題数</FormLabel>
      <Flex alignItems="center" gap={3} pb={3}>
        <Switch id="game-limit-toggle" onChange={onGameLimitToggle} />
        <label htmlFor="game-limit-toggle">限定問題数を設定する</label>
      </Flex>
      <NumberInput
        id={id}
        value={limit}
        min={0}
        max={100}
        onChange={(s, n) => {
          db.games.update(game_id, {
            limit: n,
          });
        }}
        isDisabled={!limit}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </FormControl>
  );
};

export default ConfigNumberInput;
