import { Link as ReactLink } from "react-router-dom";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from "@chakra-ui/react";
import { Upload } from "tabler-icons-react";

import db from "#/utils/db";
import { GameDBQuizProps } from "#/utils/types";

type SelectQuizsetProps = {
  game_id: string;
  game_quiz: GameDBQuizProps | undefined;
  quizset_names: string[];
};

const SelectQuizset: React.FC<SelectQuizsetProps> = ({
  game_id,
  game_quiz,
  quizset_names,
}) => {
  return (
    <>
      <h2>問題設定</h2>
      <Box py={5}>
        {quizset_names.length !== 0 ? (
          <Flex sx={{ gap: 5 }}>
            <FormControl pt={5} width={200}>
              <FormLabel>セット名</FormLabel>
              <Select
                defaultValue={game_quiz?.set_name || ""}
                onChange={async (v) => {
                  await db.games.update(game_id as string, {
                    quiz: {
                      set_name: v.target.value,
                      offset: game_quiz?.offset || 0,
                    } as GameDBQuizProps,
                  });
                }}
              >
                <option value="">問題を表示しない</option>
                {quizset_names.map((setname) => (
                  <option key={setname} value={setname}>
                    {setname}
                  </option>
                ))}
              </Select>
            </FormControl>
            {game_quiz && game_quiz.set_name !== "" && (
              <FormControl pt={5} width={200}>
                <FormLabel>オフセット</FormLabel>
                <NumberInput
                  value={game_quiz.offset}
                  min={0}
                  onChange={(s, n) => {
                    db.games.update(game_id as string, {
                      quiz: {
                        set_name: game_quiz.set_name,
                        offset: n,
                      } as GameDBQuizProps,
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
          </Flex>
        ) : (
          <Box>
            <Button
              as={ReactLink}
              to={`/quiz?from=${game_id}`}
              colorScheme="blue"
              leftIcon={<Upload />}
            >
              問題データを読み込む
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default SelectQuizset;
