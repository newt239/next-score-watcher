"use client";

import { useTransition } from "react";

import { Flex, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Encoding from "encoding-japanese";

import type { CreateQuizType } from "@/models/quiz";
import type { FileWithPath } from "@mantine/dropzone";

import Dropzone from "@/app/_components/Dropzone/Dropzone";

type Props = {
  createQuizes: (quizesData: CreateQuizType[]) => Promise<number>;
};

/**
 * CSVインポートによるクイズ問題一括作成コンポーネント
 */
const ImportQuiz: React.FC<Props> = ({ createQuizes }) => {
  const [isPending, startTransition] = useTransition();

  const handleOnChange = (files: FileWithPath[]) => {
    const fileReader = new FileReader();
    if (files && files.length > 0) {
      const file = files[0];
      fileReader.onload = (ev) => {
        const buffer = ev.target?.result;
        if (buffer instanceof ArrayBuffer) {
          const unicodeArray = Encoding.convert(new Uint8Array(buffer), {
            to: "UNICODE",
            from: "AUTO",
          });
          const encodedString = Encoding.codeToString(unicodeArray);

          startTransition(async () => {
            try {
              const createdCount = await csvFileToArray(encodedString);
              notifications.show({
                title: "データをインポートしました",
                message: `${file.name}から${createdCount}問のクイズ問題を読み込みました`,
                autoClose: 9000,
                withCloseButton: true,
              });
            } catch (error) {
              notifications.show({
                title: "エラー",
                message:
                  error instanceof Error
                    ? error.message
                    : "インポートに失敗しました",
                color: "red",
              });
            }
          });
        }
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  const csvFileToArray = async (raw: string) => {
    const csvRows = raw.split("\n");
    const quizesData: CreateQuizType[] = [];

    for (const row of csvRows) {
      if (!row.trim()) continue; // 空行をスキップ

      const values = row.split(",");
      const question = values[0]?.trim();
      const answer = values[1]?.trim();
      const category = values[2]?.trim() || "";
      const annotation = values[3]?.trim() || "";

      if (question && answer) {
        quizesData.push({
          question,
          answer,
          category,
          annotation,
          setName: "インポート",
          questionNumber: quizesData.length + 1,
        });
      }
    }

    if (quizesData.length === 0) {
      throw new Error("有効なクイズ問題データがありません");
    }

    return await createQuizes(quizesData);
  };

  return (
    <Flex direction="column" gap="md">
      <Dropzone
        onDrop={handleOnChange}
        accept={["text/csv"]}
        loading={isPending}
      />
      <Text size="sm">
        CSVファイル形式: 1列目: 問題文、2列目: 答え、3列目: カテゴリ、4列目:
        解説・補足
      </Text>
    </Flex>
  );
};

export default ImportQuiz;
