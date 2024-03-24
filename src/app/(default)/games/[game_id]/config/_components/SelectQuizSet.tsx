import { Upload } from "tabler-icons-react";

import ButtonLink from "#/app/_components/ButtonLink";
import FormControl from "#/app/_components/FormControl";
import NumberInput from "#/app/_components/NumberInput";
import Select from "#/app/_components/Select";
import InputLayout from "#/components/common/InputLayout";
import { GameDBQuizProps, QuizsetPropsOnSupabase } from "#/utils/types";

type SelectQuizsetProps = {
  game_id: string;
  game_quiz: GameDBQuizProps | undefined;
  quizsets: QuizsetPropsOnSupabase[] | null;
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
                  label: quizset.name,
                  value: quizset.id,
                };
              })}
              onChange={async (v) => {
                /*
                await db.games.update(game_id as string, {
                  quiz: {
                    offset: game_quiz?.offset || 0,
                    set_name: v.value[0],
                  } as GameDBQuizProps,
                });
                */
              }}
              value={game_quiz ? [game_quiz?.set_name] : [""]}
            />
          </InputLayout>
          {game_quiz && game_quiz.set_name !== "" && (
            <FormControl label="オフセット">
              <NumberInput
                min={0}
                onChange={(s) => {
                  /*
                  db.games.update(game_id as string, {
                    quiz: {
                      offset: str2num(s),
                      set_name: game_quiz.set_name,
                    } as GameDBQuizProps,
                  });
                  */
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
