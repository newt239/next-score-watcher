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
import { useLiveQuery } from "dexie-react-hooks";

import db from "~/utils/db";
import { RuleNames } from "~/utils/types";

type ConfigLimitProps = {
  rule: RuleNames;
  game_id: string;
};

const ConfigLimit: React.FC<ConfigLimitProps> = ({ rule, game_id }) => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const game = useLiveQuery(() =>
    db(currentProfile).games.get(game_id as string)
  );

  if (!game) return null;

  const onGameLimitToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    db(currentProfile).games.update(game_id, {
      limit: event.target.checked ? 10 : undefined,
    });
    if (rule !== "attacksurvival") {
      db(currentProfile).games.update(game_id, {
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
        <FormControl isDisabled={typeof game?.limit === "undefined"}>
          <FormLabel htmlFor="limit-input">限定問題数</FormLabel>
          <NumberInput
            id="limit-input"
            max={100}
            min={0}
            onChange={(s, n) => {
              db(currentProfile).games.update(game_id, {
                limit: isNaN(n) ? 0 : n,
              });
            }}
            value={game.limit}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl isDisabled={typeof game?.win_through === "undefined"}>
          <FormLabel htmlFor="win_through-input">勝ち抜け人数</FormLabel>
          <NumberInput
            id="win_through-input"
            max={100}
            min={0}
            onChange={(s, n) => {
              db(currentProfile).games.update(game_id, {
                win_through: isNaN(n) ? 0 : n,
              });
            }}
            value={game.win_through}
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
