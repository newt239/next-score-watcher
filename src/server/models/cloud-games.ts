import { z } from "zod";

import type { RuleNames, Variants } from "@/utils/types";

/**
 * ゲーム作成時のスキーマ
 */
export const createGameSchema = z.object({
  name: z.string().min(1),
  ruleType: z.string() as z.ZodSchema<RuleNames>,
  discordWebhookUrl: z.string().optional(),
});

/**
 * ゲーム更新時のスキーマ
 */
export const updateGameSchema = z.object({
  name: z.string().min(1).optional(),
  discordWebhookUrl: z.string().optional(),
});

/**
 * プレイヤー追加時のスキーマ
 */
export const addPlayerSchema = z.object({
  playerId: z.string().min(1),
  displayOrder: z.number().int().min(0),
  initialScore: z.number().int().default(0),
  initialCorrectCount: z.number().int().default(0),
  initialWrongCount: z.number().int().default(0),
});

/**
 * ログ追加時のスキーマ
 */
export const addLogSchema = z.object({
  gameId: z.string().min(1),
  playerId: z.string().min(1),
  questionNumber: z.number().int().optional(),
  actionType: z.string() as z.ZodSchema<Variants>,
  scoreChange: z.number().int().default(0),
  isSystemAction: z.boolean().default(false),
});

/**
 * ゲーム数取得時のスキーマ
 */
export const gameCountsSchema = z.object({
  gameIds: z.array(z.string().min(1)),
});

/**
 * ゲーム作成データの型
 */
export type CreateGameData = z.infer<typeof createGameSchema>;

/**
 * ゲーム更新データの型
 */
export type UpdateGameData = z.infer<typeof updateGameSchema>;

/**
 * プレイヤー追加データの型
 */
export type AddPlayerData = z.infer<typeof addPlayerSchema>;

/**
 * ログ追加データの型
 */
export type AddLogData = z.infer<typeof addLogSchema>;

/**
 * ゲーム数取得データの型
 */
export type GameCountsData = z.infer<typeof gameCountsSchema>;
