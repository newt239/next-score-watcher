import { Upload } from "tabler-icons-react";

import ButtonLink from "#/app/_components/ButtonLink";
import FormControl from "#/app/_components/FormControl";
import NumberInput from "#/app/_components/NumberInput";
import Select from "#/app/_components/Select";
import InputLayout from "#/components/common/InputLayout";
import db from "#/utils/db";
import { str2num } from "#/utils/functions";
import { GameDBQuizProps, QuizsetsDB } from "#/utils/types";
import { css } from "@panda/css";

type SelectQuizsetProps = {
  game_id: string;
  game_quiz: GameDBQuizProps | undefined;
  quizset_names: QuizsetsDB["Insert"][] | null;
};

const SelectQuizset: React.FC<SelectQuizsetProps> = ({
  game_id,
  game_quiz,
  quizset_names,
}) => {
  return (
    <div
      className={css({
        display: "flex",
        alignItems: "stretch",
      })}
    >
      <h3>問題設定</h3>
      {quizset_names && quizset_names.length !== 0 ? (
        <>
          <InputLayout label="セット名">
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
                <option key={setname.id} value={setname.id}>
                  {setname.name}
                </option>
              ))}
            </Select>
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
