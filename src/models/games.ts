import { z } from "zod";

import type { RuleNames, Variants } from "@/utils/types";

/**
 * ゲーム作成リクエストのスキーマ
 */
export const CreateGameRequestSchema = z.object({
  name: z.string().min(1),
  ruleType: z.string() as z.ZodSchema<RuleNames>,
  discordWebhookUrl: z.string().optional(),
});

/**
 * ゲーム更新リクエストのスキーマ
 */
export const UpdateGameRequestSchema = z.object({
  name: z.string().min(1).optional(),
  discordWebhookUrl: z.string().optional(),
});

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
 * ゲーム作成リクエストの型
 */
export type CreateGameRequestType = z.infer<typeof CreateGameRequestSchema>;

/**
 * ゲーム更新リクエストの型
 */
export type UpdateGameRequestType = z.infer<typeof UpdateGameRequestSchema>;

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
  id: string;
  message: string;
};

/**
 * ゲーム更新レスポンスの型
 */
export type UpdateGameResponseType = {
  message: string;
};

/**
 * ゲーム削除レスポンスの型
 */
export type DeleteGameResponseType = {
  message: string;
};
