import { useState } from "react";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";

import db, { QuizDBProps } from "#/utils/db";

const LoadQuiz: React.FC<{ setName: string }> = ({ setName }) => {
  const toast = useToast();
  const [rawQuizText, setRawQuizText] = useState("");
  const [separateType, setSparateType] = useState<"tab" | "comma">("tab");

  const handleClick = async () => {
    if (rawQuizText !== "") {
      const quizRaw = rawQuizText.split("\n");
      let dataArray: QuizDBProps[] = [];
      for (let i = 0; i < quizRaw.length; i++) {
        const q = quizRaw[i].split(separateType === "comma" ? "," : "\t")[0];
        const a = quizRaw[i].split(separateType === "comma" ? "," : "\t")[1];
        dataArray.push({
          q,
          a,
          set_name: setName,
        });
      }
      await db.quizes.bulkPut(dataArray);
      toast({
        title: "データをインポートしました",
        description: `直接入力から${dataArray.length}件の問題を読み込みました`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setRawQuizText("");
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>直接貼り付け</FormLabel>
        <Textarea
          disabled={setName === ""}
          value={rawQuizText}
          onChange={(e) => setRawQuizText(e.target.value)}
          placeholder={`選挙において、支持する政党や候補者が一定していない有権者が持つ票のことを、漢字３文字で何というでしょう？${
            separateType === "tab" ? "	" : ","
          }浮動票`}
        />
      </FormControl>
      <HStack sx={{ pt: 3, gap: 3, justifyContent: "flex-end" }}>
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
          onClick={handleClick}
          disabled={rawQuizText === ""}
        >
          追加
        </Button>
      </HStack>
    </Box>
  );
};

export default LoadQuiz;
