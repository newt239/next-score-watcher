"use client";

import { useRouter } from "next/router";
import { useState } from "react";

import {
  Box,
  Button,
  Container,
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

import ImportQuiz from "#/app/(default)/quizes/_components/ImportQuiz";
import LoadQuiz from "#/app/(default)/quizes/_components/LoadQuiz";
import QuizTable from "#/app/(default)/quizes/_components/QuizTable";

export default function QuizesConfigPage({
  searchParams,
}: {
  searchParams: { from: string };
}) {
  const router = useRouter();
  const [setName, setSetName] = useState<string>("セット1");

  return (
    <Container pt={5}>
      <Box pt={5}>
        {searchParams.from && (
          <Box>
            <Button
              colorScheme="green"
              leftIcon={<ArrowBackUp />}
              onClick={() =>
                router.push({ pathname: `/${searchParams.from}/config` })
              }
              variant="link"
            >
              設定に戻る
            </Button>
          </Box>
        )}
        <h2>問題管理</h2>
        <Box pt={5}>
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
        </Box>
        <QuizTable />
      </Box>
    </Container>
  );
}
