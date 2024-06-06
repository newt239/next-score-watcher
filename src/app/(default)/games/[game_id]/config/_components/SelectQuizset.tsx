"use client";

import { Upload } from "tabler-icons-react";

import ButtonLink from "@/app/_components/ButtonLink";
import db from "@/utils/db";
import { GameDBQuizProps } from "@/utils/types";
import { NativeSelect, NumberInput } from "@mantine/core";

type Props = {
  game_id: string;
  game_quiz: GameDBQuizProps | undefined;
  quizset_names: string[];
};

const SelectQuizset: React.FC<Props> = ({
  game_id,
  game_quiz,
  quizset_names,
}) => {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  return (
    <>
      <h3>問題設定</h3>
      {quizset_names.length !== 0 ? (
        <>
          <NativeSelect
            label="セット名"
            defaultValue={game_quiz?.set_name || ""}
            onChange={async (v) => {
              await db(currentProfile).games.update(game_id as string, {
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
          </NativeSelect>
          {game_quiz && game_quiz.set_name !== "" && (
            <NumberInput
              label="オフセット"
              min={0}
              onChange={(n) => {
                db(currentProfile).games.update(game_id as string, {
                  quiz: {
                    set_name: game_quiz.set_name,
                    offset: n,
                  } as GameDBQuizProps,
                });
              }}
              value={game_quiz.offset}
            />
          )}
        </>
      ) : (
        <ButtonLink leftSection={<Upload />} href={`/quizes?from=${game_id}`}>
          問題データを読み込む
        </ButtonLink>
      )}
    </>
  );
};

export default SelectQuizset;
