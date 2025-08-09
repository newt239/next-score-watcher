import { z } from "zod";

import type { RuleNames, Variants } from "@/utils/types";

/**
 * ゲーム作成の基本スキーマ
 */
export const CreateGameSchema = z.object({
  name: z.string().min(1),
  ruleType: z.string() as z.ZodSchema<RuleNames>,
  discordWebhookUrl: z.string().optional(),
});

/**
 * ゲーム作成リクエストのスキーマ
 */
export const CreateGameRequestSchema = z
  .array(CreateGameSchema)
  .min(1, "最低1つのゲームが必要です");

/**
 * ゲーム更新の基本スキーマ
 */
export const UpdateGameSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  discordWebhookUrl: z.string().optional(),
});

/**
 * ゲーム更新リクエストのスキーマ
 */
export const UpdateGameRequestSchema = z
  .array(UpdateGameSchema)
  .min(1, "最低1つのゲームが必要です");

/**
 * ゲーム削除リクエストのスキーマ
 */
export const DeleteGameRequestSchema = z
  .array(z.string().min(1))
  .min(1, "最低1つのゲームIDが必要です");

/**
 * ゲームにプレイヤー追加リクエストのスキーマ
 */
export const AddPlayerToGameRequestSchema = z.object({
  playerId: z.string().min(1),
  displayOrder: z.number().int().min(0),
  initialScore: z.number().int().default(0),
  initialCorrectCount: z.number().int().default(0),
  initialWrongCount: z.number().int().default(0),
});

/**
 * ゲームログ追加リクエストのスキーマ
 */
export const AddGameLogRequestSchema = z.object({
  gameId: z.string().min(1),
  playerId: z.string().min(1),
  questionNumber: z.number().int().optional(),
  actionType: z.string() as z.ZodSchema<Variants>,
  scoreChange: z.number().int().default(0),
  isSystemAction: z.boolean().default(false),
});

/**
 * ゲーム数取得リクエストのスキーマ
 */
export const GetGameCountsRequestSchema = z.object({
  gameIds: z.array(z.string().min(1)),
});

/**
 * ゲーム作成の基本型
 */
export type CreateGameType = z.infer<typeof CreateGameSchema>;

/**
 * ゲーム作成リクエストの型
 */
export type CreateGameRequestType = z.infer<typeof CreateGameRequestSchema>;

/**
 * ゲーム更新の基本型
 */
export type UpdateGameType = z.infer<typeof UpdateGameSchema>;

/**
 * ゲーム更新リクエストの型
 */
export type UpdateGameRequestType = z.infer<typeof UpdateGameRequestSchema>;

/**
 * ゲーム削除リクエストの型
 */
export type DeleteGameRequestType = z.infer<typeof DeleteGameRequestSchema>;

/**
 * ゲームにプレイヤー追加リクエストの型
 */
export type AddPlayerToGameRequestType = z.infer<
  typeof AddPlayerToGameRequestSchema
>;

/**
 * ゲームログ追加リクエストの型
 */
export type AddGameLogRequestType = z.infer<typeof AddGameLogRequestSchema>;

/**
 * ゲーム数取得リクエストの型
 */
export type GetGameCountsRequestType = z.infer<
  typeof GetGameCountsRequestSchema
>;

/**
 * ゲーム作成レスポンスの型
 */
export type CreateGameResponseType = {
  ids: string[];
  createdCount: number;
  message: string;
};

/**
 * ゲーム更新レスポンスの型
 */
export type UpdateGameResponseType = {
  updatedCount: number;
  message: string;
};

/**
 * ゲーム削除レスポンスの型
 */
export type DeleteGameResponseType = {
  deletedCount: number;
  message: string;
};
