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
import { RuleNames } from "#/utils/types";

type ConfigLimitProps = {
  rule: RuleNames;
  game_id: string;
  limit: number | undefined;
  win_through: number | undefined;
};

const ConfigLimit: React.FC<ConfigLimitProps> = ({
  rule,
  game_id,
  limit,
  win_through,
}) => {
  const onGameLimitToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    db.games.update(game_id, {
      limit: event.target.checked ? 10 : undefined,
    });
    if (rule !== "attacksurvival") {
      db.games.update(game_id, {
        win_through: event.target.checked ? 3 : undefined,
      });
    }
  };

  return (
    <Flex direction="column" pt={5}>
      <FormControl alignItems="center" display="flex">
        <FormLabel htmlFor="game-limit-toggle" mb="0">
          限定問題数を設定する
        </FormLabel>
        <Switch id="game-limit-toggle" onChange={onGameLimitToggle} />
      </FormControl>
      <Flex gap={3} p={3}>
        <FormControl isDisabled={!limit}>
          <FormLabel htmlFor="limit-input">限定問題数</FormLabel>
          <NumberInput
            id="limit-input"
            max={100}
            min={0}
            onChange={(s, n) => {
              db.games.update(game_id, {
                limit: n,
              });
            }}
            value={limit}
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
            max={100}
            min={0}
            onChange={(s, n) => {
              db.games.update(game_id, {
                win_through: n,
              });
            }}
            value={win_through}
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

export default ConfigLimit;
