"use client";

import { useRef, useState } from "react";

import { Box, Button, Flex, Radio, Text, Textarea } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { nanoid } from "nanoid";
import { CirclePlus } from "tabler-icons-react";

import db from "@/utils/db";
import { str2num } from "@/utils/functions";
import { QuizDBProps } from "@/utils/types";

type Props = {
  set_name: string;
};

const LoadQuiz: React.FC<Props> = ({ set_name }) => {
  const [currentProfile] = useLocalStorage({
    key: "scorew_current_profile",
    defaultValue: "score_watcher",
  });
  const [rawQuizText, setRawQuizText] = useState("");
  const [separateType, setSparateType] = useState<"tab" | "comma">("tab");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClick = async () => {
    if (rawQuizText !== "") {
      const quizRaw = rawQuizText.split("\n");
      let dataArray: QuizDBProps[] = [];
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
    <Flex className="h-[45vh] flex-col justify-between lg:h-[30vh]">
      <Box>
        <Text>
          Excelやスプレッドシートからコピーし、まとめてインポートできます。
        </Text>
        <Textarea
          disabled={set_name === ""}
          onChange={(e) => setRawQuizText(e.target.value)}
          placeholder={placeholderText}
          ref={textareaRef}
          value={rawQuizText}
        />
        <Text>A列: 問題番号、 B列: 問題文 C列: 答え</Text>
      </Box>
      <Flex className="w-full justify-end gap-3 pt-3">
        <Radio.Group
          onChange={(e) => setSparateType(e as "tab" | "comma")}
          value={separateType}
        >
          <Flex direction="row">
            <Radio value="comma" label="カンマ区切り" />
            <Radio value="tab" label="タブ区切り" />
          </Flex>
        </Radio.Group>
        <Button
          disabled={rawQuizText === ""}
          leftSection={<CirclePlus />}
          onClick={handleClick}
        >
          追加
        </Button>
      </Flex>
    </Flex>
  );
};

export default LoadQuiz;
