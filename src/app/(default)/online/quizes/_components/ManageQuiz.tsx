"use client";

import { Suspense, useCallback, useState } from "react";

import { Tabs, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import CreateQuiz from "./CreateQuiz";
import ImportQuiz from "./ImportQuiz";
import LoadQuiz from "./LoadQuiz";
import QuizesTable from "./QuizesTable";

import type { ApiQuizDataType, CreateQuizType } from "@/models/quizes";

import createApiClient from "@/utils/hono/client";

type Props = {
  initialQuizes: ApiQuizDataType[];
  userId: string;
};

const ManageQuiz: React.FC<Props> = ({ initialQuizes }) => {
  const [quizes, setQuizes] = useState<ApiQuizDataType[]>(initialQuizes);
  const apiClient = createApiClient();

  const refetchQuizes = async () => {
    try {
      const response = await apiClient.quizes.$get({ query: {} });
      if (!response.ok) {
        throw new Error("クイズ問題一覧の取得に失敗しました");
      }
      const result = await response.json();
      setQuizes(result.data.quizes);
    } catch (error) {
      notifications.show({
        title: "エラー",
        message:
          error instanceof Error ? error.message : "不明なエラーが発生しました",
        color: "red",
      });
    }
  };

  // 共通のAPIリクエスト関数群
  // クイズ問題作成（単体・複数統一）
  const createQuizes = useCallback(async (quizData: CreateQuizType[]) => {
    try {
      const response = await apiClient.quizes.$post({
        json: quizData,
      });

      if (!response.ok) {
        throw new Error("クイズ問題の作成に失敗しました");
      }

      const data = await response.json();

      if (data.success) {
        const count = data.data.createdCount;

        notifications.show({
          title: "クイズ問題を作成しました",
          message: `${count}問のクイズ問題を追加しました`,
          color: "green",
        });

        await refetchQuizes();

        return count;
      }
      throw new Error("クイズ問題の作成に失敗しました");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "クイズ問題の作成に失敗しました";
      notifications.show({
        title: "エラー",
        message: errorMessage,
        color: "red",
      });
      throw error;
    }
  }, []);

  // クイズ問題削除
  const deleteQuizes = useCallback(async (quizIds: string[]) => {
    try {
      const response = await apiClient.quizes.$delete({
        json: quizIds,
      });

      if (!response.ok) {
        throw new Error("クイズ問題の削除に失敗しました");
      }

      notifications.show({
        title: `${quizIds.length}問のクイズ問題を削除しました`,
        message: "削除が完了しました",
        autoClose: 9000,
        withCloseButton: true,
      });

      return true;
    } catch (error) {
      notifications.show({
        title: "エラー",
        message: "クイズ問題の削除に失敗しました",
        color: "red",
      });
      throw error;
    }
  }, []);

  return (
    <>
      <Title order={2}>クイズ問題管理</Title>
      <h3>クイズ問題の追加</h3>
      <Tabs pt="lg" variant="outline" defaultValue="add">
        <Tabs.List mt="lg" grow>
          <Tabs.Tab value="add">個別に追加</Tabs.Tab>
          <Tabs.Tab value="paste">貼り付け</Tabs.Tab>
          <Tabs.Tab value="import">インポート</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="add" style={{ paddingTop: "1rem" }}>
          <Suspense>
            <CreateQuiz createQuizes={createQuizes} />
          </Suspense>
        </Tabs.Panel>
        <Tabs.Panel value="paste" style={{ paddingTop: "1rem" }}>
          <LoadQuiz createQuizes={createQuizes} />
        </Tabs.Panel>
        <Tabs.Panel value="import" style={{ paddingTop: "1rem" }}>
          <ImportQuiz createQuizes={createQuizes} />
        </Tabs.Panel>
      </Tabs>

      <QuizesTable
        quizes={quizes}
        deleteQuizes={deleteQuizes}
        refetchQuizes={refetchQuizes}
      />
    </>
  );
};

export default ManageQuiz;
