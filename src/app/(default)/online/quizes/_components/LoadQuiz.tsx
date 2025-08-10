"use client";

import { useRef, useState, useTransition } from "react";

import {
  Button,
  Flex,
  Group,
  Radio,
  RadioGroup,
  Text,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCirclePlus } from "@tabler/icons-react";

import type { CreateQuizType } from "@/models/quizes";

type Props = {
  createQuizes: (quizesData: CreateQuizType[]) => Promise<number>;
};

/**
 * 貼り付けによるクイズ問題一括作成コンポーネント
 */
const LoadQuiz: React.FC<Props> = ({ createQuizes }) => {
  const [rawQuizText, setRawQuizText] = useState("");
  const [separateType, setSeparateType] = useState<"tab" | "comma">("tab");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (rawQuizText === "") return;

    startTransition(async () => {
      const quizRaw = rawQuizText.split("\n");
      const quizesData: CreateQuizType[] = [];

      for (const row of quizRaw) {
        const parts = row.split(separateType === "comma" ? "," : "\t");
        const question = parts[0]?.trim();
        const answer = parts[1]?.trim();
        const category = parts[2]?.trim();
        const annotation = parts[3]?.trim();

        if (question && answer) {
          quizesData.push({
            question,
            answer,
            category: category || "",
            annotation: annotation || "",
          });
        }
      }

      if (quizesData.length === 0) {
        notifications.show({
          title: "エラー",
          message: "有効なクイズ問題データが見つかりませんでした",
          color: "red",
        });
        return;
      }

      try {
        await createQuizes(quizesData);
        setRawQuizText("");
      } catch (_error) {
        // エラーハンドリングは上位でされる
      }
    });
  };

  return (
    <Flex direction="column" gap="md">
      <Text size="sm">
        クイズ問題データを貼り付けて、一括で作成できます。
        <br />
        形式：問題文[区切り文字]答え[区切り文字]カテゴリ[区切り文字]解説（1行につき1問）
      </Text>
      <RadioGroup
        value={separateType}
        onChange={(value) => setSeparateType(value as "tab" | "comma")}
        label="区切り文字を選択してください"
      >
        <Group mt="xs">
          <Radio value="tab" label="タブ区切り" />
          <Radio value="comma" label="カンマ区切り" />
        </Group>
      </RadioGroup>
      <Textarea
        ref={textareaRef}
        label="クイズ問題データ"
        placeholder={
          separateType === "comma"
            ? "問題文1,答え1,カテゴリ1,解説1\n問題文2,答え2,カテゴリ2,解説2"
            : "問題文1\t答え1\tカテゴリ1\t解説1\n問題文2\t答え2\tカテゴリ2\t解説2"
        }
        minRows={5}
        value={rawQuizText}
        onChange={(event) => setRawQuizText(event.currentTarget.value)}
        disabled={isPending}
      />
      <Group justify="flex-end">
        <Button
          leftSection={<IconCirclePlus />}
          onClick={handleClick}
          disabled={rawQuizText === "" || isPending}
          loading={isPending}
        >
          作成
        </Button>
      </Group>
    </Flex>
  );
};

export default LoadQuiz;
