import { NextPageWithLayout } from "next";
import Head from "next/head";
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
  Text,
} from "@chakra-ui/react";

import H2 from "#/blocks/H2";
import ImportQuiz from "#/components/quiz/ImportQuiz";
import LoadQuiz from "#/components/quiz/LoadQuiz";
import QuizTable from "#/components/quiz/QuizTable";
import { Layout } from "#/layouts/Layout";

const QuizPage: NextPageWithLayout = () => {
  const [setName, setSetName] = useState<string>("テスト");

  return (
    <>
      <Head>
        <title>問題管理</title>
      </Head>
      <H2>問題管理</H2>
      <FormControl py={5}>
        <FormLabel>セット名</FormLabel>
        <Input
          value={setName}
          isInvalid={setName === ""}
          errorBorderColor="crimson"
          onChange={(e) => setSetName(e.target.value)}
        />
      </FormControl>
      <Tabs isFitted variant="enclosed" pt={5}>
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
      <QuizTable />
    </>
  );
};

QuizPage.getLayout = (page) => <Layout>{page}</Layout>;

export default QuizPage;
