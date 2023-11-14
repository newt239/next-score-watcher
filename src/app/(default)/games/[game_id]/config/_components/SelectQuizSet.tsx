import { Upload } from "tabler-icons-react";

import ButtonLink from "#/app/_components/ButtonLink";
import FormControl from "#/app/_components/FormControl";
import NumberInput from "#/app/_components/NumberInput";
import Select from "#/app/_components/Select";
import InputLayout from "#/components/common/InputLayout";
import db from "#/utils/db";
import { str2num } from "#/utils/functions";
import { GameDBQuizProps, QuizsetPropsOnSupabase } from "#/utils/types";

type SelectQuizsetProps = {
  game_id: string;
  game_quiz: GameDBQuizProps | undefined;
  quizsets: QuizsetPropsOnSupabase["Row"][] | null;
};

const SelectQuizset: React.FC<SelectQuizsetProps> = ({
  game_id,
  game_quiz,
  quizsets,
}) => {
  return (
    <div>
      {quizsets && quizsets.length !== 0 ? (
        <>
          <InputLayout label="セット名">
            <Select
              items={quizsets.map((quizset) => {
                return {
                  value: quizset.id,
                  label: quizset.name,
                };
              })}
              onChange={async (v) => {
                await db.games.update(game_id as string, {
                  quiz: {
                    set_name: v.value[0],
                    offset: game_quiz?.offset || 0,
                  } as GameDBQuizProps,
                });
              }}
              value={game_quiz ? [game_quiz?.set_name] : [""]}
            />
          </InputLayout>
          {game_quiz && game_quiz.set_name !== "" && (
            <FormControl label="オフセット">
              <NumberInput
                min={0}
                onChange={(s) => {
                  db.games.update(game_id as string, {
                    quiz: {
                      set_name: game_quiz.set_name,
                      offset: str2num(s),
                    } as GameDBQuizProps,
                  });
                }}
                value={game_quiz.offset}
              />
            </FormControl>
          )}
        </>
      ) : (
        <ButtonLink href={`/quiz?from=${game_id}`} leftIcon={<Upload />}>
          問題データを読み込む
        </ButtonLink>
      )}
    </div>
  );
};

export default SelectQuizset;
