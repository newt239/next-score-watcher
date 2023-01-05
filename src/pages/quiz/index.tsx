import { NextPageWithLayout } from "next";

import H2 from "#/blocks/H2";
import LoadQuiz from "#/components/LoadQuiz";
import QuizTable from "#/components/QuizTable";
import { Layout } from "#/layouts/Layout";

const QuizPage: NextPageWithLayout = () => {
  return (
    <>
      <H2>問題管理</H2>
      <LoadQuiz />
      <QuizTable />
    </>
  );
};

QuizPage.getLayout = (page) => <Layout>{page}</Layout>;

export default QuizPage;
