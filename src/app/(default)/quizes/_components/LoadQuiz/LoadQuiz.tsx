"use client";

import { useRef, useState } from "react";

import { Button, Flex, Group, Radio, Text, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCirclePlus } from "@tabler/icons-react";
import { nanoid } from "nanoid";

import classes from "./LoadQuiz.module.css";

import db from "@/utils/db";
import { str2num } from "@/utils/functions";
import { QuizDBProps } from "@/utils/types";

type Props = {
  set_name: string;
  currentProfile: string;
};

const LoadQuiz: React.FC<Props> = ({ set_name, currentProfile }) => {
  const [rawQuizText, setRawQuizText] = useState("");
  const [separateType, setSparateType] = useState<"tab" | "comma">("tab");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClick = async () => {
    if (rawQuizText !== "") {
      const quizRaw = rawQuizText.split("\n");
      const dataArray: QuizDBProps[] = [];
      for (let i = 0; i < quizRaw.length; i++) {
        const n = quizRaw[i].split(separateType === "comma" ? "," : "\t")[0];
        const q =
          quizRaw[i].split(separateType === "comma" ? "," : "\t")[1] || "";
        const a =
          quizRaw[i].split(separateType === "comma" ? "," : "\t")[2] || "";
        if (n !== "") {
          dataArray.push({
            id: nanoid(),
            n: str2num(n),
            q,
            a,
            set_name,
          });
        }
      }
      await db(currentProfile).quizes.bulkPut(dataArray);
      if (dataArray.length !== 0) {
        notifications.show({
          title: "データをインポートしました",
          message: `直接入力から${dataArray.length}件の問題を読み込みました`,
          autoClose: 9000,
          withCloseButton: true,
        });
      }
      setRawQuizText("");
      textareaRef.current?.focus();
    }
  };

  const joinString = separateType === "tab" ? "	" : ",";
  const placeholderText = `1${joinString}選挙において、支持する政党や候補者が一定していない有権者が持つ票のことを、漢字３文字で何というでしょう？${joinString}浮動票
2${joinString}1989年、小学校1・2年生の理科と社会に代わって導入された科目は何でしょう？${joinString}生活〈科〉
  `;

  return (
    <Flex className={classes.load_quiz}>
      <Text>
        Excelやスプレッドシートからコピーし、まとめてインポートできます。
      </Text>
      <Textarea
        rows={4}
        disabled={set_name === ""}
        onChange={(e) => setRawQuizText(e.target.value)}
        placeholder={placeholderText}
        ref={textareaRef}
        value={rawQuizText}
      />
      <Text>A列: 問題番号、 B列: 問題文 C列: 答え</Text>
      <Group justify="end">
        <Radio.Group
          onChange={(e) => setSparateType(e as "tab" | "comma")}
          value={separateType}
        >
          <Group>
            <Radio value="comma" label="カンマ区切り" />
            <Radio value="tab" label="タブ区切り" />
          </Group>
        </Radio.Group>
        <Button
          disabled={rawQuizText === ""}
          leftSection={<IconCirclePlus />}
          onClick={handleClick}
        >
          追加
        </Button>
      </Group>
    </Flex>
  );
};

export default LoadQuiz;
