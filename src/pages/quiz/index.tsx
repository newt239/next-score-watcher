import { NextPageWithLayout } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
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
} from "@chakra-ui/react";
import { ArrowBackUp } from "tabler-icons-react";

import H2 from "#/blocks/H2";
import H3 from "#/blocks/H3";
import ImportQuiz from "#/components/quiz/ImportQuiz";
import LoadQuiz from "#/components/quiz/LoadQuiz";
import QuizTable from "#/components/quiz/QuizTable";
import { Layout } from "#/layouts/Layout";

const QuizPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { from } = router.query;
  const [setName, setSetName] = useState<string>("セット1");

  return (
    <>
      <Head>
        <title>問題管理 - Score Watcher</title>
      </Head>
      {typeof from === "string" && (
        <Box>
          <Button
            colorScheme="green"
            variant="link"
            onClick={() => router.push({ pathname: `/${from}/config` })}
            leftIcon={<ArrowBackUp />}
          >
            設定に戻る
          </Button>
        </Box>
      )}
      <H2>問題管理</H2>
      <Box>
        <H3>問題の読み込み</H3>
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
    </>
  );
};

QuizPage.getLayout = (page) => <Layout>{page}</Layout>;

export default QuizPage;
