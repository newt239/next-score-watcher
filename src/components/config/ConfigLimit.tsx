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
  win_through: number | undefined;
};

const ConfigNumberInput: React.FC<ConfigLimitProps> = ({
  game_id,
  limit,
  win_through,
}) => {
  const onGameLimitToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    db.games.update(game_id, {
      limit: event.target.checked ? 10 : undefined,
      win_through: event.target.checked ? 3 : undefined,
    });
  };

  return (
    <Flex direction="column" pt={5}>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="game-limit-toggle" mb="0">
          限定問題数を設定する
        </FormLabel>
        <Switch id="game-limit-toggle" onChange={onGameLimitToggle} />
      </FormControl>
      <Flex p={3} gap={3}>
        <FormControl isDisabled={!limit}>
          <FormLabel htmlFor="limit-input">限定問題数</FormLabel>
          <NumberInput
            id="limit-input"
            value={limit}
            min={0}
            max={100}
            onChange={(s, n) => {
              db.games.update(game_id, {
                limit: n,
              });
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl isDisabled={!win_through}>
          <FormLabel htmlFor="win_through-input">勝ち抜け人数</FormLabel>
          <NumberInput
            id="win_through-input"
            value={win_through}
            min={0}
            max={100}
            onChange={(s, n) => {
              db.games.update(game_id, {
                win_through: n,
              });
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </Flex>
    </Flex>
  );
};

export default ConfigNumberInput;