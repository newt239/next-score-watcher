"use client";

import { useState } from "react";

import ImportQuiz from "#/app/(default)/quizes/_components/ImportQuiz";
import LoadQuiz from "#/app/(default)/quizes/_components/LoadQuiz";
import QuizTable from "#/app/(default)/quizes/_components/QuizTable";
import ButtonLink from "#/app/_components/ButtonLink";
import FormControl from "#/app/_components/FormControl";
import { Tab, TabItem } from "#/app/_components/Tab";
import TextInput from "#/app/_components/TextInput";

export default function QuizesConfigPage({
  searchParams,
}: {
  searchParams: { from: string };
}) {
  const [setName, setSetName] = useState<string>("セット1");

  return (
    <>
      <div>
        {searchParams.from && (
          <div>
            <ButtonLink href={`/${searchParams.from}/config`}>
              設定に戻る
            </ButtonLink>
          </div>
        )}
        <h2>問題管理</h2>
        <div>
          <h3>問題の読み込み</h3>
          <FormControl label="セット名">
            <TextInput
              onChange={(e) => setSetName(e.target.value)}
              value={setName}
            />
          </FormControl>
          <Tab defaultKey="load-quiz">
            <TabItem tabKey="load-quiz" title="貼り付け">
              <LoadQuiz setName={setName} />
            </TabItem>
            <TabItem tabKey="import-quiz" title="インポート">
              <ImportQuiz setName={setName} />
            </TabItem>
          </Tab>
        </div>
        <QuizTable />
      </div>
    </>
  );
}
