"use client";

import { Tabs, TextInput, Title } from "@mantine/core";
import { useState } from "react";

import ImportQuiz from "./_components/ImportQuiz";
import LoadQuiz from "./_components/LoadQuiz";

export default function QuizesPage() {
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
      <Tabs variant="outline" defaultValue="paste">
        <Tabs.List>
          <Tabs.Tab value="paste">貼り付け</Tabs.Tab>
          <Tabs.Tab value="import">インポート</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="paste">
          <LoadQuiz set_name={setName} />
        </Tabs.Panel>
        <Tabs.Panel value="import">
          <ImportQuiz set_name={setName} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
