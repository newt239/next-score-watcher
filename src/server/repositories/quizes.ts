import { and, asc, count, eq, isNull, like } from "drizzle-orm";
import { nanoid } from "nanoid";

import type {
  ApiQuizDataType,
  CreateQuizRequestType,
  DeleteQuizRequestType,
  GetQuizesListResponseType,
  UpdateQuizRequestType,
} from "@/models/quizes";

import { DBClient } from "@/utils/drizzle/client";
import { quizQuestion } from "@/utils/drizzle/schema";

/**
 * クイズ問題一覧取得
 */
export const getQuizes = async (userId: string) => {
  const quizes = await DBClient.select()
    .from(quizQuestion)
    .where(and(eq(quizQuestion.userId, userId), isNull(quizQuestion.deletedAt)))
    .orderBy(asc(quizQuestion.questionText));

  const quizesWithFormattedData = quizes.map((q) => ({
    id: q.id,
    question: q.questionText,
    answer: q.answerText,
    annotation: "", // データベースにannotationフィールドがないため空文字
    category: q.category || "",
    createdAt: q.createdAt?.toISOString(),
    updatedAt: q.updatedAt?.toISOString(),
  }));

  return quizesWithFormattedData;
};

/**
 * ページネーション付きクイズ問題一覧取得
 */
export const getQuizesWithPagination = async (
  userId: string,
  limit: number = 50,
  offset: number = 0,
  category?: string
): Promise<GetQuizesListResponseType> => {
  // フィルタ条件を構築
  const whereConditions = [
    eq(quizQuestion.userId, userId),
    isNull(quizQuestion.deletedAt),
  ];

  if (category) {
    whereConditions.push(like(quizQuestion.category, `%${category}%`));
  }

  // 総数を取得
  const [totalResult] = await DBClient.select({ count: count() })
    .from(quizQuestion)
    .where(and(...whereConditions));

  // データを取得
  const quizes = await DBClient.select()
    .from(quizQuestion)
    .where(and(...whereConditions))
    .orderBy(asc(quizQuestion.questionText))
    .limit(limit)
    .offset(offset);

  const quizesWithFormattedData: ApiQuizDataType[] = quizes.map((q) => ({
    id: q.id,
    question: q.questionText,
    answer: q.answerText,
    annotation: "", // データベースにannotationフィールドがないため空文字
    category: q.category || "",
    createdAt: q.createdAt?.toISOString(),
    updatedAt: q.updatedAt?.toISOString(),
  }));

  return {
    quizes: quizesWithFormattedData,
    total: totalResult.count,
  };
};

/**
 * クイズ問題詳細取得
 */
export const getQuizDetail = async (quizId: string, userId: string) => {
  const [quiz] = await DBClient.select()
    .from(quizQuestion)
    .where(
      and(
        eq(quizQuestion.id, quizId),
        eq(quizQuestion.userId, userId),
        isNull(quizQuestion.deletedAt)
      )
    );

  if (!quiz) return null;

  return {
    id: quiz.id,
    question: quiz.questionText,
    answer: quiz.answerText,
    annotation: "", // データベースにannotationフィールドがないため空文字
    category: quiz.category || "",
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
  };
};

/**
 * クイズ問題作成
 */
export const createQuiz = async (
  quizesData: CreateQuizRequestType,
  userId: string
) => {
  const createdQuizes = [];

  for (const quizData of quizesData) {
    const id = nanoid();
    await DBClient.insert(quizQuestion).values({
      id,
      questionText: quizData.question,
      answerText: quizData.answer,
      category: quizData.category || null,
      questionNumber: 0, // 必須フィールドなので0を設定
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    createdQuizes.push(id);
  }

  return {
    ids: createdQuizes,
    createdCount: createdQuizes.length,
  };
};

/**
 * クイズ問題更新
 */
export const updateQuiz = async (
  quizesData: UpdateQuizRequestType,
  userId: string
) => {
  let updatedCount = 0;

  for (const quizData of quizesData) {
    const updateData: Partial<{
      questionText: string;
      answerText: string;
      category: string | null;
      updatedAt: Date;
    }> = {
      updatedAt: new Date(),
    };

    if (quizData.question !== undefined) {
      updateData.questionText = quizData.question;
    }
    if (quizData.answer !== undefined) {
      updateData.answerText = quizData.answer;
    }
    if (quizData.category !== undefined) {
      updateData.category = quizData.category || null;
    }

    const result = await DBClient.update(quizQuestion)
      .set(updateData)
      .where(
        and(
          eq(quizQuestion.id, quizData.id),
          eq(quizQuestion.userId, userId),
          isNull(quizQuestion.deletedAt)
        )
      );

    if (result.rowsAffected > 0) {
      updatedCount++;
    }
  }

  return { updatedCount };
};

/**
 * クイズ問題削除（ソフトデリート）
 */
export const deleteQuiz = async (
  quizIds: DeleteQuizRequestType,
  userId: string
) => {
  const deletedIds = [];

  for (const quizId of quizIds) {
    const result = await DBClient.update(quizQuestion)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(quizQuestion.id, quizId),
          eq(quizQuestion.userId, userId),
          isNull(quizQuestion.deletedAt)
        )
      );

    if (result.rowsAffected > 0) {
      deletedIds.push(quizId);
    }
  }

  return deletedIds;
};
