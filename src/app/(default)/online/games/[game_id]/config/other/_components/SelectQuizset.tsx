"use client";

import { useTransition } from "react";

import { NativeSelect, NumberInput } from "@mantine/core";
import { sendGAEvent } from "@next/third-parties/google";
import { IconUpload } from "@tabler/icons-react";

// GameDBQuizPropsの型定義
type GameDBQuizProps = {
  set_name: string;
  offset: number;
};

import ButtonLink from "@/components/ButtonLink";

type Props = {
  game_id: string;
  game_quiz: GameDBQuizProps | undefined;
  quizset_names: string[];
};

/**
 * オンライン版クイズセット選択コンポーネント
 * クイズセットの選択とオフセット設定
 */
const SelectQuizset: React.FC<Props> = ({
  game_id,
  game_quiz,
  quizset_names,
}) => {
  const [isPending, startTransition] = useTransition();

  const updateQuizSetting = async (_quiz: GameDBQuizProps) => {
    startTransition(async () => {
      // TODO: 問題設定の更新
    });
  };

  return (
    <>
      <h3>問題設定</h3>
      {quizset_names.length !== 0 ? (
        <>
          <NativeSelect
            label="セット名"
            defaultValue={game_quiz?.set_name || ""}
            onChange={async (v) => {
              sendGAEvent({
                event: "select_quizset",
                value: v.target.value,
              });
              updateQuizSetting({
                set_name: v.target.value,
                offset: game_quiz?.offset || 0,
              });
            }}
            w="auto"
            disabled={isPending}
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
              onChange={async (n) => {
                updateQuizSetting({
                  set_name: game_quiz.set_name,
                  offset: typeof n === "string" ? parseInt(n, 10) || 0 : n || 0,
                });
              }}
              value={game_quiz.offset}
              disabled={isPending}
            />
          )}
        </>
      ) : (
        <ButtonLink
          leftSection={<IconUpload />}
          href={`/online/quizes?from=cloud-games/${game_id}`}
          disabled={isPending}
        >
          問題データを読み込む
        </ButtonLink>
      )}
    </>
  );
};

export default SelectQuizset;
