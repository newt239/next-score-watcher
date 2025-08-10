"use client";

import { useTransition } from "react";

import { NativeSelect, NumberInput } from "@mantine/core";
import { sendGAEvent } from "@next/third-parties/google";
import { IconUpload } from "@tabler/icons-react";

import type { GameDBQuizProps } from "@/utils/types";

import ButtonLink from "@/app/_components/ButtonLink";
import createApiClient from "@/utils/hono/client";

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

  const updateQuizSetting = async (quiz: GameDBQuizProps) => {
    startTransition(async () => {
      try {
        const apiClient = createApiClient();
        const response = await apiClient.games.$patch({
          json: [
            {
              id: game_id,
              quiz: {
                setName: quiz.set_name,
                offset: quiz.offset,
              },
            },
          ],
        });

        if (!response.ok) {
          throw new Error("Failed to update quiz setting");
        }

        const result = await response.json();
        if (result.success) {
          console.log("Quiz setting updated successfully:", result.data);
        }
      } catch (error) {
        console.error("Failed to update quiz setting:", error);
      }
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
              } as GameDBQuizProps);
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
                  offset: n,
                } as GameDBQuizProps);
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
