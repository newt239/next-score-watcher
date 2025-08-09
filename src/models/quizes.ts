import { z } from "zod";

/**
 * クイズ問題作成リクエストの基本スキーマ
 */
export const CreateQuizSchema = z.object({
  question: z.string().min(1, "問題文は必須です"),
  answer: z.string().min(1, "答えは必須です"),
  annotation: z.string().optional().default(""),
  category: z.string().optional().default(""),
});

/**
 * クイズ問題作成リクエストのスキーマ
 */
export const CreateQuizRequestSchema = z
  .array(CreateQuizSchema)
  .min(1, "最低1つのクイズ問題が必要です");

/**
 * クイズ問題作成の基本型
 */
export type CreateQuizType = z.infer<typeof CreateQuizSchema>;

/**
 * クイズ問題作成リクエストの型
 */
export type CreateQuizRequestType = z.infer<typeof CreateQuizRequestSchema>;

/**
 * クイズ問題更新の基本スキーマ
 */
export const UpdateQuizSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1, "問題文は必須です").optional(),
  answer: z.string().min(1, "答えは必須です").optional(),
  annotation: z.string().optional(),
  category: z.string().optional(),
});

/**
 * クイズ問題更新リクエストのスキーマ
 */
export const UpdateQuizRequestSchema = z
  .array(UpdateQuizSchema)
  .min(1, "最低1つのクイズ問題が必要です");

/**
 * クイズ問題削除リクエストのスキーマ
 */
export const DeleteQuizRequestSchema = z
  .array(z.string().min(1))
  .min(1, "最低1つのクイズ問題IDが必要です");

/**
 * クイズ問題更新の基本型
 */
export type UpdateQuizType = z.infer<typeof UpdateQuizSchema>;

/**
 * クイズ問題更新リクエストの型
 */
export type UpdateQuizRequestType = z.infer<typeof UpdateQuizRequestSchema>;

/**
 * クイズ問題削除リクエストの型
 */
export type DeleteQuizRequestType = z.infer<typeof DeleteQuizRequestSchema>;

/**
 * クイズ問題詳細レスポンスの型
 */
export type QuizDetailResponseType = {
  id: string;
  question: string;
  answer: string;
  annotation: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * クイズ問題一覧取得リクエストのクエリパラメータスキーマ
 */
export const GetQuizesListRequestSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  category: z.string().optional(),
});

/**
 * クイズ問題一覧取得リクエストのクエリパラメータ型
 */
export type GetQuizesListRequestType = z.infer<
  typeof GetQuizesListRequestSchema
>;

/**
 * API レスポンス内のクイズ問題データの型（APIから返される生の型）
 */
export type ApiQuizDataType = {
  id: string;
  question: string;
  answer: string;
  annotation: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * クイズ問題一覧取得レスポンスの型
 */
export type GetQuizesListResponseType = {
  quizes: ApiQuizDataType[];
  total: number;
};

/**
 * クイズ問題作成レスポンスの型
 */
export type CreateQuizResponseType = {
  ids: string[];
  createdCount: number;
  message: string;
};

/**
 * クイズ問題更新レスポンスの型
 */
export type UpdateQuizResponseType = {
  updatedCount: number;
  message: string;
};

/**
 * クイズ問題削除レスポンスの型
 */
export type DeleteQuizResponseType = {
  deletedCount: number;
  message: string;
};
