import { ChangeEvent, useEffect, useState } from "react";

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";

import H3 from "#/blocks/H3";
import db, { QuizDBProps } from "#/utils/db";

const LoadQuiz: React.FC = () => {
  const initialQuizData = useLiveQuery(() => db.quizes.toArray(), []);
  const [quizData, setQuizData] = useState<QuizDBProps[]>([]);
  const [rawQuizText, setRawQuizText] = useState(
    initialQuizData
      ? initialQuizData.map((quiz) => `${quiz.q} ${quiz.a}\n`).join("")
      : ""
  );
  const [separateType, setSparateType] = useState<"tab" | "comma">("tab");
  const [quizSet, setQuizset] = useState<string>("test");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length !== 0) {
      const quizRaw = e.target.value.split("\n");
      let dataArray: QuizDBProps[] = [];
      for (let i = 0; i < quizRaw.length; i++) {
        const index = Number(
          quizRaw[i].split(separateType === "comma" ? "," : "\t")[0]
        );
        const q = quizRaw[i].split(separateType === "comma" ? "," : "\t")[1];
        const a = quizRaw[i].split(separateType === "comma" ? "," : "\t")[2];
        dataArray.push({
          index,
          q,
          a,
          set_name: quizSet,
        });
      }
      setRawQuizText(e.target.value);
      setQuizData(dataArray);
    }
  };

  useEffect(() => {
    db.quizes.bulkPut(
      quizData.map((quiz) => {
        return { ...quiz, set_name: quizSet };
      })
    );
  }, [quizData]);

  return (
    <Box pt={5}>
      <H3>問題の読み込み</H3>
      <Flex py={5} gap={3} alignItems="center">
        <Button
          size="sm"
          colorScheme="green"
          disabled={quizData.length === 0}
          onClick={() => setDrawerOpen(true)}
        >
          プレビュー
        </Button>
        <Button
          size="sm"
          colorScheme="red"
          disabled={quizData.length === 0}
          onClick={() => {
            setQuizData([]);
            setRawQuizText("");
          }}
        >
          リセット
        </Button>
        <RadioGroup
          onChange={(e) => setSparateType(e as "tab" | "comma")}
          value={separateType}
        >
          <Stack direction="row">
            <Radio value="comma">カンマ区切り</Radio>
            <Radio value="tab">タブ区切り</Radio>
          </Stack>
        </RadioGroup>
      </Flex>
      <FormControl pt={5}>
        <FormLabel>セット名</FormLabel>
        <Input
          type="text"
          placeholder="test"
          value={quizSet}
          onChange={(v) => setQuizset(v.target.value)}
        />
      </FormControl>
      <Box py={5}>
        <Textarea
          placeholder="1列目を問題文、2列目を答えにしてCSV形式で貼り付けてください"
          value={rawQuizText}
          onChange={handleChange}
          size="sm"
          resize="vertical"
        />
      </Box>
      <Drawer
        isOpen={drawerOpen}
        placement="right"
        onClose={() => setDrawerOpen(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>問題プレビュー</DrawerHeader>
          <DrawerBody>
            <H3>{quizSet}</H3>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>n</Th>
                    <Th>問題文</Th>
                    <Th>答え</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {quizData.map((quiz, i) => (
                    <Tr key={i}>
                      <Td>{quiz.index}</Td>
                      <Td>{quiz.q}</Td>
                      <Td>{quiz.a}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default LoadQuiz;
