import { useParams } from "react-router-dom";

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
  useDisclosure,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { AdjustmentsHorizontal } from "tabler-icons-react";

import db from "~/utils/db";

type InitialPointConfigModalProps = {
  index: number;
  correct: boolean;
  wrong: boolean;
  disabled?: boolean;
};

const IndividualConfig: React.FC<InitialPointConfigModalProps> = ({
  index,
  correct,
  wrong,
  disabled,
}) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { game_id } = useParams();
  const game = useLiveQuery(() => db.games.get(game_id as string));

  if ((!correct && !wrong) || !game || game.players.length <= index)
    return null;

  return (
    <Popover isOpen={isOpen} onClose={onClose} returnFocusOnClose={false}>
      <PopoverTrigger>
        <IconButton
          aria-label="初期値の変更"
          colorScheme="blue"
          disabled={disabled}
          onClick={onToggle}
          size="sm"
        >
          <AdjustmentsHorizontal />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>個人設定: {game.players[index].name}</PopoverHeader>
        <PopoverBody pb={5}>
          {correct && (
            <FormControl pt={3}>
              <FormLabel>
                {game.rule === "variables"
                  ? "初期ポイント"
                  : game.rule === "attacksurvival" // initial_correctを共通初期値との差とし、初期正解数は0にする
                  ? "共通初期値との差"
                  : "初期正答数"}
              </FormLabel>
              <NumberInput
                defaultValue={game.players[index]?.initial_correct || 0}
                min={game.rule !== "attacksurvival" ? 0 : undefined}
                onChange={async (s, n) => {
                  const newPlayers = game.players.map((gamePlayer, pi) => {
                    if (pi === index) {
                      return {
                        ...gamePlayer,
                        initial_correct: n,
                      };
                    } else {
                      return gamePlayer;
                    }
                  });
                  await db.games.update(game_id as string, {
                    players: newPlayers,
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
          )}
          {wrong && (
            <FormControl pt={3}>
              <FormLabel>初期誤答数</FormLabel>
              <NumberInput
                defaultValue={game.players[index]?.initial_wrong || 0}
                max={game.rule === "backstream" ? 4 : undefined}
                min={0}
                onChange={async (s, n) => {
                  if (game) {
                    await db.games.update(game_id as string, {
                      players: game.players.map((gamePlayer, pi) =>
                        pi === index
                          ? {
                              ...gamePlayer,
                              initial_wrong: n,
                            }
                          : gamePlayer
                      ),
                    });
                  }
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          )}
          {game.rule === "variables" && (
            <FormControl pt={3}>
              <FormLabel>N</FormLabel>
              <NumberInput
                defaultValue={game.players[index]?.base_correct_point || 0}
                min={3}
                onChange={async (s, n) => {
                  if (game) {
                    await db.games.update(game_id as string, {
                      players: game.players.map((gamePlayer, pi) =>
                        pi === index
                          ? {
                              ...gamePlayer,
                              base_correct_point: n,
                              base_wrong_point: Math.min(-n * (n - 2), -3),
                            }
                          : gamePlayer
                      ),
                    });
                  }
                }}
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
