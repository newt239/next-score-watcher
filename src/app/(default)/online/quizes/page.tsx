import type { Metadata } from "next";
import { redirect } from "next/navigation";

import ManageQuiz from "./_components/ManageQuiz";

import type { ApiQuizDataType } from "@/models/quiz";

import { getUser } from "@/utils/auth/auth-helpers";
import { createApiClientOnServer } from "@/utils/hono/server";

export const metadata: Metadata = {
  title: "クイズ問題管理",
  alternates: {
    canonical: "https://score-watcher.com/online/quizes",
  },
};

const OnlineQuizPage = async () => {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  // API Routes経由でクイズ問題一覧を取得
  const apiClient = await createApiClientOnServer();

  let initialQuizes: ApiQuizDataType[] = [];
  try {
    const response = await apiClient.quizes.$get({ query: {} });
    if (response.ok) {
      const data = await response.json();
      initialQuizes = data.data.quizes || [];
    }
  } catch (error) {
    console.error("Failed to fetch initial quizes:", error);
  }

  return <ManageQuiz initialQuizes={initialQuizes} userId={user.id} />;
};

export default OnlineQuizPage;
