import { Metadata } from "next";

import ManageQuiz from "./_components/ManageQuiz";

export const metadata: Metadata = {
  title: "問題管理",
};

export default function QuizesPage() {
  return (
    <>
      <ManageQuiz />
    </>
  );
}
