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
 * 既存ゲームからプレイヤーをコピーするリクエストスキーマ
 */
export const CopyPlayersFromGameRequestSchema = z.object({
  sourceGameId: z.string().min(1),
});

/**
 * 既存ゲームからプレイヤーをコピーするリクエスト型
 */
export type CopyPlayersFromGameRequestType = z.infer<
  typeof CopyPlayersFromGameRequestSchema
>;

/**
 * ゲーム作成リクエストのスキーマ
 */
export const CreateGameRequestSchema = z
  .array(CreateGameSchema)
  .min(1, "最低1つのゲームが必要です");

/**
 * プレイヤー設定更新のスキーマ
 */
export const UpdateGamePlayerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  displayOrder: z.number().int().min(0),
  initialScore: z.number().int().default(0),
  initialCorrectCount: z.number().int().default(0),
  initialWrongCount: z.number().int().default(0),
});

/**
 * クイズ設定更新のスキーマ
 */
export const UpdateGameQuizSchema = z.object({
  setName: z.string().optional(),
  offset: z.number().int().min(0).default(0),
});

/**
 * ゲーム更新の基本スキーマ
 */
export const UpdateGameSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  discordWebhookUrl: z.string().optional(),
  players: z.array(UpdateGamePlayerSchema).optional(),
  quiz: UpdateGameQuizSchema.optional(),
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
 * プレイヤー設定更新の型
 */
export type UpdateGamePlayerType = z.infer<typeof UpdateGamePlayerSchema>;

/**
 * クイズ設定更新の型
 */
export type UpdateGameQuizType = z.infer<typeof UpdateGameQuizSchema>;

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

/**
 * ゲーム設定取得レスポンスのスキーマ
 */
export const GetGameSettingsResponseSchema = z.object({
  name: z.string(),
  discordWebhookUrl: z.string().nullable().optional(),
  winPoint: z.number().int().optional(),
  losePoint: z.number().int().optional(),
  targetPoint: z.number().int().optional(),
  restCount: z.number().int().optional(),
  basePoint: z.number().int().optional(),
  initialPoint: z.number().int().optional(),
  loseThreshold: z.number().int().optional(),
  attackPoint: z.number().int().optional(),
  squareSize: z.number().int().optional(),
  winCondition: z.number().int().optional(),
  zonePoint: z.number().int().optional(),
  freezePoint: z.number().int().optional(),
  loseCount: z.number().int().optional(),
  useR: z.boolean().optional(),
  streakOver3: z.boolean().optional(),
  leftTeam: z.string().optional(),
  rightTeam: z.string().optional(),
});

/**
 * ゲーム設定更新リクエストのスキーマ
 */
export const UpdateGameSettingsRequestSchema = z.object({
  name: z.string().min(1).optional(),
  discordWebhookUrl: z.string().optional(),
  winPoint: z.number().int().min(1).max(1000).optional(),
  losePoint: z.number().int().min(1).max(100).optional(),
  targetPoint: z.number().int().min(3).max(1000).optional(),
  restCount: z.number().int().min(1).max(100).optional(),
  basePoint: z.number().int().min(1).max(100).optional(),
  initialPoint: z.number().int().min(0).max(100).optional(),
  loseThreshold: z.number().int().min(-100).max(100).optional(),
  attackPoint: z.number().int().min(1).max(100).optional(),
  squareSize: z.number().int().min(2).max(10).optional(),
  winCondition: z.number().int().min(1).max(10).optional(),
  zonePoint: z.number().int().min(1).max(100).optional(),
  freezePoint: z.number().int().min(1).max(100).optional(),
  loseCount: z.number().int().min(1).max(100).optional(),
  useR: z.boolean().optional(),
  streakOver3: z.boolean().optional(),
  leftTeam: z.string().max(50).optional(),
  rightTeam: z.string().max(50).optional(),
});

/**
 * ゲーム設定取得レスポンスの型
 */
export type GetGameSettingsResponseType = z.infer<
  typeof GetGameSettingsResponseSchema
>;

/**
 * ゲーム設定更新リクエストの型
 */
export type UpdateGameSettingsRequestType = z.infer<
  typeof UpdateGameSettingsRequestSchema
>;

/**
 * ゲーム設定更新レスポンスの型
 */
export type UpdateGameSettingsResponseType = {
  updated: boolean;
  message: string;
};

/**
 * プレイヤー一括更新レスポンスの型
 */
export type UpdateGamePlayersResponseType = {
  updated: boolean;
  updatedCount: number;
  message: string;
};

/**
 * クイズ設定更新レスポンスの型
 */
export type UpdateGameQuizResponseType = {
  updated: boolean;
  message: string;
};

/**
 * 既存ゲームからプレイヤーコピーレスポンスの型
 */
export type CopyPlayersFromGameResponseType = {
  copied: boolean;
  copiedCount: number;
  message: string;
};
