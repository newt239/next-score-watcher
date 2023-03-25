import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  FormLabel,
  Input,
  FormControl,
  Box,
  Button,
  Container,
} from "@chakra-ui/react";
import { ArrowBackUp } from "tabler-icons-react";

import ImportQuiz from "#/components/quiz/ImportQuiz";
import LoadQuiz from "#/components/quiz/LoadQuiz";
import QuizTable from "#/components/quiz/QuizTable";

const QuizPage = () => {
  const navigate = useNavigate();
  const { from } = useParams();
  const [setName, setSetName] = useState<string>("セット1");

  return (
    <Container sx={{ maxW: 1000, p: 5, margin: "auto" }}>
      {typeof from === "string" && (
        <Box>
          <Button
            colorScheme="green"
            variant="link"
            onClick={() => navigate({ pathname: `/${from}/config` })}
            leftIcon={<ArrowBackUp />}
          >
            設定に戻る
          </Button>
        </Box>
      )}
      <h2>問題管理</h2>
      <Box>
        <h3>問題の読み込み</h3>
        <FormControl py={5}>
          <FormLabel>セット名</FormLabel>
          <Input
            value={setName}
            isInvalid={setName === ""}
            errorBorderColor="crimson"
            onChange={(e) => setSetName(e.target.value)}
          />
        </FormControl>
        <Tabs isFitted variant="enclosed" colorScheme="green" pt={5}>
          <TabList mb="1em">
            <Tab>まとめて貼り付け</Tab>
            <Tab>ファイルからインポート</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <LoadQuiz setName={setName} />
            </TabPanel>
            <TabPanel>
              <ImportQuiz setName={setName} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <QuizTable />
    </Container>
  );
};

export default QuizPage;
