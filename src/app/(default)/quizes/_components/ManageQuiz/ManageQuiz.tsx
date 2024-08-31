"use client";

import { useState } from "react";

import { Tabs, TextInput, Title } from "@mantine/core";

import ImportQuiz from "../ImportQuiz/ImportQuiz";
import LoadQuiz from "../LoadQuiz/LoadQuiz";
import QuizesTable from "../QuizesTable/QuizesTable";

import classes from "./ManageQuiz.module.css";

type Props = {
  currentProfile: string;
};

const ManageQuiz: React.FC<Props> = ({ currentProfile }) => {
  const [setName, setSetName] = useState<string>("セット1");

  return (
    <>
      <Title order={2}>問題管理</Title>
      <h3>問題の読み込み</h3>
      <TextInput
        label="セット名"
        onChange={(e) => setSetName(e.target.value)}
        value={setName}
      />
      <Tabs pt="lg" variant="outline" defaultValue="paste">
        <Tabs.List mt="lg" grow>
          <Tabs.Tab value="paste">貼り付け</Tabs.Tab>
          <Tabs.Tab value="import">インポート</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="paste" className={classes.tab_panel}>
          <LoadQuiz currentProfile={currentProfile} set_name={setName} />
        </Tabs.Panel>
        <Tabs.Panel value="import" className={classes.tab_panel}>
          <ImportQuiz currentProfile={currentProfile} set_name={setName} />
        </Tabs.Panel>
      </Tabs>

      <QuizesTable currentProfile={currentProfile} />
    </>
  );
};

export default ManageQuiz;
