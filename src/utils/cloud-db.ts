"use server";

import { eq, and, desc, asc } from "drizzle-orm";
import { nanoid } from "nanoid";

import type { RuleNames, Variants } from "@/utils/types";

import { DBClient } from "@/utils/drizzle/client";
import { game, player, gamePlayer, gameLog } from "@/utils/drizzle/schema";

/**
 * クラウドゲーム取得
 */
export const getCloudGame = async (gameId: string, userId: string) => {
  const gameData = await DBClient.select()
    .from(game)
    .where(and(eq(game.id, gameId), eq(game.userId, userId)))
    .limit(1);

  if (gameData.length === 0) {
    return null;
  }

  return gameData[0];
};

/**
 * クラウドゲーム一覧取得
 */
export const getCloudGames = async (userId: string) => {
  const games = await DBClient.select()
    .from(game)
    .where(eq(game.userId, userId))
    .orderBy(desc(game.updatedAt));

  return games;
};

/**
 * クラウドゲーム作成
 */
export const createCloudGame = async (
  gameData: {
    name: string;
    ruleType: RuleNames;
    discordWebhookUrl?: string;
  },
  userId: string
) => {
  const gameId = nanoid();

  await DBClient.insert(game).values({
    id: gameId,
    name: gameData.name,
    ruleType: gameData.ruleType,
    discordWebhookUrl: gameData.discordWebhookUrl,
    userId,
  });

  return gameId;
};

/**
 * クラウドゲーム更新
 */
export const updateCloudGame = async (
  gameId: string,
  gameData: Partial<{
    name: string;
    discordWebhookUrl: string;
  }>,
  userId: string
) => {
  await DBClient.update(game)
    .set({
      ...gameData,
      updatedAt: new Date(),
    })
    .where(and(eq(game.id, gameId), eq(game.userId, userId)));
};

/**
 * クラウドゲーム削除
 */
export const deleteCloudGame = async (gameId: string, userId: string) => {
  await DBClient.delete(game).where(
    and(eq(game.id, gameId), eq(game.userId, userId))
  );
};

/**
 * クラウドゲームプレイヤー取得
 */
export const getCloudGamePlayers = async (gameId: string, userId: string) => {
  const players = await DBClient.select({
    id: gamePlayer.id,
    gameId: gamePlayer.gameId,
    playerId: gamePlayer.playerId,
    displayOrder: gamePlayer.displayOrder,
    initialScore: gamePlayer.initialScore,
    initialCorrectCount: gamePlayer.initialCorrectCount,
    initialWrongCount: gamePlayer.initialWrongCount,
    playerName: player.name,
    playerDisplayName: player.displayName,
  })
    .from(gamePlayer)
    .leftJoin(player, eq(gamePlayer.playerId, player.id))
    .where(and(eq(gamePlayer.gameId, gameId), eq(gamePlayer.userId, userId)))
    .orderBy(asc(gamePlayer.displayOrder));

  return players.map((p) => ({
    id: p.playerId || "",
    name: p.playerDisplayName || p.playerName || "",
    initial_correct: p.initialCorrectCount || 0,
    initial_wrong: p.initialWrongCount || 0,
    base_correct_point: 1,
    base_wrong_point: 1,
  }));
};

/**
 * クラウドゲームプレイヤー追加
 */
export const addCloudGamePlayer = async (
  gameId: string,
  playerData: {
    playerId: string;
    displayOrder: number;
    initialScore?: number;
    initialCorrectCount?: number;
    initialWrongCount?: number;
  },
  userId: string
) => {
  await DBClient.insert(gamePlayer).values({
    gameId,
    playerId: playerData.playerId,
    displayOrder: playerData.displayOrder,
    initialScore: playerData.initialScore || 0,
    initialCorrectCount: playerData.initialCorrectCount || 0,
    initialWrongCount: playerData.initialWrongCount || 0,
    userId,
  });
};

/**
 * クラウドゲームログ取得
 */
export const getCloudGameLogs = async (gameId: string, userId: string) => {
  const logs = await DBClient.select()
    .from(gameLog)
    .where(and(eq(gameLog.gameId, gameId), eq(gameLog.userId, userId)))
    .orderBy(asc(gameLog.timestamp));

  return logs.map((log) => ({
    id: log.id,
    game_id: log.gameId!,
    player_id: log.playerId!,
    variant: log.actionType as Variants,
    system: log.isSystemAction ? 1 : 0,
    timestamp: log.timestamp.toISOString(),
    available: 1,
  }));
};

/**
 * クラウドゲームログ追加
 */
export const addCloudGameLog = async (
  logData: {
    gameId: string;
    playerId: string;
    questionNumber?: number;
    actionType: Variants;
    scoreChange?: number;
    isSystemAction?: boolean;
  },
  userId: string
) => {
  const logId = nanoid();

  await DBClient.insert(gameLog).values({
    id: logId,
    gameId: logData.gameId,
    playerId: logData.playerId,
    questionNumber: logData.questionNumber,
    actionType: logData.actionType,
    scoreChange: logData.scoreChange || 0,
    isSystemAction: logData.isSystemAction || false,
    userId,
  });

  return logId;
};

/**
 * クラウドゲームログ削除（元に戻す用）
 */
export const removeCloudGameLog = async (logId: string, userId: string) => {
  await DBClient.delete(gameLog).where(
    and(eq(gameLog.id, logId), eq(gameLog.userId, userId))
  );
};

/**
 * プレイヤー一覧取得
 */
export const getCloudPlayers = async (userId: string) => {
  const players = await DBClient.select()
    .from(player)
    .where(eq(player.userId, userId))
    .orderBy(asc(player.name));

  return players.map((p) => ({
    id: p.id,
    name: p.name,
    text: p.displayName,
    belong: p.affiliation || "",
    tags: [], // TODO: タグ機能実装時に修正
  }));
};

/**
 * プレイヤー作成
 */
export const createCloudPlayer = async (
  playerData: {
    name: string;
    displayName: string;
    affiliation?: string;
    description?: string;
  },
  userId: string
) => {
  const playerId = nanoid();

  await DBClient.insert(player).values({
    id: playerId,
    name: playerData.name,
    displayName: playerData.displayName,
    affiliation: playerData.affiliation,
    description: playerData.description,
    userId,
  });

  return playerId;
};
