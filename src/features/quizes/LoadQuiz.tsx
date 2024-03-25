import { useRef, useState } from "react";

import {
  Button,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { CirclePlus } from "tabler-icons-react";

import db from "#/utils/db";
import { str2num } from "#/utils/functions";
import { QuizDBProps } from "#/utils/types";

const LoadQuiz: React.FC<{ setName: string }> = ({ setName }) => {
  const toast = useToast();
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
            set_name: setName,
          });
        }
      }
      await db.quizes.bulkPut(dataArray);
      if (dataArray.length !== 0) {
        toast({
          title: "データをインポートしました",
          description: `直接入力から${dataArray.length}件の問題を読み込みました`,
          status: "success",
          duration: 9000,
          isClosable: true,
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
    <VStack h="30vh" justifyContent="space-between">
      <VStack align="left" sx={{ flexGrow: 1 }} w="full">
        <p>Excelやスプレッドシートからコピーし、まとめてインポートできます。</p>
        <Textarea
          disabled={setName === ""}
          onChange={(e) => setRawQuizText(e.target.value)}
          placeholder={placeholderText}
          ref={textareaRef}
          sx={{ flexGrow: 1 }}
          value={rawQuizText}
        />
        <p>A列: 問題番号、 B列: 問題文 C列: 答え</p>
      </VStack>
      <HStack sx={{ pt: 3, gap: 3, justifyContent: "flex-end" }} w="full">
        <RadioGroup
          onChange={(e) => setSparateType(e as "tab" | "comma")}
          value={separateType}
        >
          <Stack direction="row">
            <Radio value="comma">カンマ区切り</Radio>
            <Radio value="tab">タブ区切り</Radio>
          </Stack>
        </RadioGroup>
        <Button
          colorScheme="blue"
          disabled={rawQuizText === ""}
          leftIcon={<CirclePlus />}
          onClick={handleClick}
        >
          追加
        </Button>
      </HStack>
    </VStack>
  );
};

export default LoadQuiz;
