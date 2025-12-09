import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { parseResponse } from "hono/client";

import ManageQuiz from "./_components/ManageQuiz";

import { createApiClientOnServer } from "@/utils/hono/server";

export const metadata: Metadata = {
  title: "クイズ問題管理",
  alternates: {
    canonical: "https://score-watcher.com/online/quizes",
  },
};

const OnlineQuizPage = async () => {
  const apiClient = await createApiClientOnServer();

  const initialQuizes = await parseResponse(apiClient.quizes.$get({ query: {} }));
  if ("error" in initialQuizes) {
    return notFound();
  }

  return <ManageQuiz initialQuizes={initialQuizes.data.quizes} />;
};

export default OnlineQuizPage;
