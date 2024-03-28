import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { ArrowBackUp } from "tabler-icons-react";

import ImportQuiz from "~/features/quizes/ImportQuiz";
import LoadQuiz from "~/features/quizes/LoadQuiz";
import QuizTable from "~/features/quizes/QuizTable";

const QuizPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const from = params.get("from");
  const [setName, setSetName] = useState<string>("セット1");

  useEffect(() => {
    document.title = "問題管理 | Score Watcher";
  }, []);

  return (
    <div>
      <div>
        {from && (
          <div>
            <Button
              colorScheme="green"
              leftIcon={<ArrowBackUp />}
              onClick={() => navigate({ pathname: `/${from}/config` })}
              variant="link"
            >
              設定に戻る
            </Button>
          </div>
        )}
        <h2>問題管理</h2>
        <div>
          <h3>問題の読み込み</h3>
          <FormControl py={5}>
            <FormLabel>セット名</FormLabel>
            <Input
              errorBorderColor="crimson"
              isInvalid={setName === ""}
              onChange={(e) => setSetName(e.target.value)}
              value={setName}
            />
          </FormControl>
          <Tabs colorScheme="green" isFitted pt={5} variant="enclosed">
            <TabList mb="1em">
              <Tab>貼り付け</Tab>
              <Tab>インポート</Tab>
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
        </div>
        <QuizTable />
      </div>
    </div>
  );
};

export default QuizPage;
