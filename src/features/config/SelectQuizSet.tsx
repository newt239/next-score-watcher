import { Link as ReactLink } from "react-router-dom";

import {
  Button,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  VStack,
} from "@chakra-ui/react";
import { Upload } from "tabler-icons-react";

import InputLayout from "~/features/components/InputLayout";
import db from "~/utils/db";
import { GameDBQuizProps } from "~/utils/types";

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
    <VStack align="stretch" gap={0}>
      <h3>問題設定</h3>
      {quizset_names.length !== 0 ? (
        <>
          <InputLayout label="セット名">
            <Select
              defaultValue={game_quiz?.set_name || ""}
              onChange={async (v) => {
                await db().games.update(game_id as string, {
                  quiz: {
                    set_name: v.target.value,
                    offset: game_quiz?.offset || 0,
                  } as GameDBQuizProps,
                });
              }}
              w="auto"
            >
              <option value="">問題を表示しない</option>
              {quizset_names.map((setname) => (
                <option key={setname} value={setname}>
                  {setname}
                </option>
              ))}
            </Select>
          </InputLayout>
          {game_quiz && game_quiz.set_name !== "" && (
            <InputLayout label="オフセット">
              <NumberInput
                min={0}
                onChange={(_s, n) => {
                  db().games.update(game_id as string, {
                    quiz: {
                      set_name: game_quiz.set_name,
                      offset: n,
                    } as GameDBQuizProps,
                  });
                }}
                value={game_quiz.offset}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </InputLayout>
          )}
        </>
      ) : (
        <InputLayout label="">
          <Button
            as={ReactLink}
            colorScheme="blue"
            leftIcon={<Upload />}
            to={`/quizes?from=${game_id}`}
          >
            問題データを読み込む
          </Button>
        </InputLayout>
      )}
    </VStack>
  );
};

export default SelectQuizset;
