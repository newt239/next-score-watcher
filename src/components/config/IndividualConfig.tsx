import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { AdjustmentsHorizontal } from "tabler-icons-react";

import db from "#/utils/db";

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
  const { game_id } = useParams();
  const game = useLiveQuery(() => db.games.get(game_id as string));
  const [initialCorrect, setInitialCorrect] = useState<number | null>(null);
  const [initialWrong, setInitialWrong] = useState<number | null>(null);
  const [baseCorrectPoint, setBaseCorrectPoint] = useState<number | null>(null);

  useEffect(() => {
    if (game) {
      setInitialCorrect(game.players[index].initial_correct);
      setInitialWrong(game.players[index].initial_wrong);
      setBaseCorrectPoint(game.players[index].base_correct_point);
    }
  }, [game]);

  useEffect(() => {
    if (game && initialCorrect) {
      db.games.update(game_id as string, {
        players: game.players.map((gamePlayer, pi) =>
          pi === index
            ? {
                ...gamePlayer,
                initial_correct: initialCorrect,
              }
            : gamePlayer
        ),
      });
    }
  }, [game, initialCorrect]);

  useEffect(() => {
    if (game && initialWrong) {
      db.games.update(game_id as string, {
        players: game.players.map((gamePlayer, pi) =>
          pi === index
            ? {
                ...gamePlayer,
                initial_wrong: initialWrong,
              }
            : gamePlayer
        ),
      });
    }
  }, [game, initialWrong]);

  useEffect(() => {
    if (game && baseCorrectPoint) {
      db.games.update(game_id as string, {
        players: game.players.map((gamePlayer, pi) =>
          pi === index
            ? {
                ...gamePlayer,
                base_correct_point: baseCorrectPoint,
                base_wrong_point: Math.min(
                  -baseCorrectPoint * (baseCorrectPoint - 2),
                  -3
                ),
              }
            : gamePlayer
        ),
      });
    }
  }, [game, baseCorrectPoint]);

  if ((!correct && !wrong) || !game || game.players.length <= index)
    return null;

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
        <PopoverHeader>個人設定: {game.players[index].name}</PopoverHeader>
        <PopoverBody pb={5}>
          {correct && (
            <FormControl pt={3}>
              <FormLabel>
                {game.rule === "variables"
                  ? "初期ポイント"
                  : game.rule === "attacksurvival"
                  ? "全体初期値との差"
                  : "初期正答数"}
              </FormLabel>
              <NumberInput
                onChange={async (s, n) => {
                  setInitialCorrect(n);
                }}
                value={initialCorrect || 0}
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
                onChange={(s, n) => {
                  setInitialWrong(n);
                }}
                value={initialWrong || 0}
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
                min={3}
                onChange={(s, n) => {
                  setBaseCorrectPoint(n);
                }}
                value={baseCorrectPoint || 0}
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
