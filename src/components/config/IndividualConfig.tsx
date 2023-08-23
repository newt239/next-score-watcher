import {
  FormControl,
  FormLabel,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { AdjustmentsHorizontal } from "tabler-icons-react";

import db from "#/utils/db";
import { GameDBPlayerProps, RuleNames } from "#/utils/types";

type InitialPointConfigModalProps = {
  game_id: string;
  rule_name: RuleNames;
  players: GameDBPlayerProps[];
  index: number;
  correct: boolean;
  wrong: boolean;
  disabled?: boolean;
};

const IndividualConfig: React.FC<InitialPointConfigModalProps> = ({
  game_id,
  rule_name,
  players,
  index,
  correct,
  wrong,
  disabled,
}) => {
  if (!correct && !wrong) return null;

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label="初期値の変更"
          colorScheme="blue"
          disabled={disabled}
          size="sm"
        >
          <AdjustmentsHorizontal />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>個人設定: {players[index].name}</PopoverHeader>
        <PopoverBody pb={5}>
          {correct && (
            <FormControl pt={3}>
              <FormLabel>
                {rule_name === "variables" ? "初期ポイント" : "初期正答数"}
              </FormLabel>
              <NumberInput
                onChange={(_s, n) => {
                  db.games.update(game_id, {
                    players: players.map((gamePlayer, pi) =>
                      pi === index
                        ? { ...gamePlayer, initial_correct: n }
                        : gamePlayer
                    ),
                  });
                }}
                value={players[index].initial_correct}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          )}
          {wrong && (
            <FormControl pt={3}>
              <FormLabel>初期誤答数</FormLabel>
              <NumberInput
                onChange={(_s, n) => {
                  db.games.update(game_id, {
                    players: players.map((gamePlayer, pi) =>
                      pi === index
                        ? { ...gamePlayer, initial_wrong: n }
                        : gamePlayer
                    ),
                  });
                }}
                value={players[index].initial_wrong}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          )}
          {rule_name === "variables" && (
            <FormControl pt={3}>
              <FormLabel>N</FormLabel>
              <NumberInput
                min={3}
                onChange={(s, n) => {
                  db.games.update(game_id, {
                    players: players.map((gamePlayer, pi) =>
                      pi === index
                        ? {
                            ...gamePlayer,
                            base_correct_point: n,
                            base_wrong_point: Math.min(-n * (n - 2), -3),
                          }
                        : gamePlayer
                    ),
                  });
                }}
                value={players[index].base_correct_point}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default IndividualConfig;
