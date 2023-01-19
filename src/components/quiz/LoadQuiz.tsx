import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";

import H3 from "#/blocks/H3";
import db, { QuizDBProps } from "#/utils/db";

const LoadQuiz: React.FC = () => {
  const [setName, setSetName] = useState<string>("テスト");
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

  const fileReader = new FileReader();

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (files) {
      fileReader.readAsText(files[0], "UTF-8");
      fileReader.onload = (ev) => {
        const csvOutput = ev.target?.result;
        if (typeof csvOutput === "string") {
          csvFileToArray(csvOutput).then((row) => {
            toast({
              title: "データをインポートしました",
              description: `${files[0].name}から${row}件の問題を読み込みました`,
              status: "success",
              duration: 9000,
              isClosable: true,
            });
          });
        }
      };
    }
  };

  const csvFileToArray = async (raw: string) => {
    const csvRows = raw.split("\n");
    await db.quizes.bulkPut(
      csvRows.map((row) => {
        const values = row.split(",");
        return {
          q: values[0],
          a: values[1],
          set_name: setName,
        };
      })
    );
    return csvRows.length;
  };

  return (
    <Box>
      <H3>問題の読み込み</H3>
      <Stack gap={3} py={3}>
        <FormControl>
          <FormLabel>セット名</FormLabel>
          <Input
            value={setName}
            isInvalid={setName === ""}
            errorBorderColor="crimson"
            onChange={(e) => setSetName(e.target.value)}
          />
        </FormControl>
        <Text>
          CSV形式(カンマ区切り)で 1列目に問題文、2列目に答えを入力してください。
        </Text>
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>直接貼り付け</Tab>
            <Tab>ファイルから読み込み</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box>
                <FormControl>
                  <FormLabel>直接貼り付け</FormLabel>
                  <Textarea
                    disabled={setName === ""}
                    value={rawQuizText}
                    onChange={(e) => setRawQuizText(e.target.value)}
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
            </TabPanel>
            <TabPanel>
              <FormControl>
                <FormLabel>ファイルから読み込み</FormLabel>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleOnChange}
                  disabled={setName === ""}
                />
              </FormControl>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Box>
  );
};

export default LoadQuiz;
