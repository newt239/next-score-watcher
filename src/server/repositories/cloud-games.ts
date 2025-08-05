import { eq, and, desc, asc, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";

import type {
  CreateGameData,
  UpdateGameData,
  AddPlayerData,
  AddLogData,
} from "@/server/models/cloud-games";
import type { Variants } from "@/utils/types";

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
 * 複数ゲームのログ数を一括取得
 */
export const getCloudGamesLogCounts = async (
  gameIds: string[],
  userId: string
) => {
  if (gameIds.length === 0) return {};

  const logs = await DBClient.select({
    gameId: gameLog.gameId,
    count: gameLog.id,
  })
    .from(gameLog)
    .where(and(eq(gameLog.userId, userId), inArray(gameLog.gameId, gameIds)));

  const logCounts: Record<string, number> = {};
  for (const log of logs) {
    if (log.gameId) {
      logCounts[log.gameId] = (logCounts[log.gameId] || 0) + 1;
    }
  }

  return logCounts;
};

/**
 * 複数ゲームのプレイヤー数を一括取得
 */
export const getCloudGamesPlayerCounts = async (
  gameIds: string[],
  userId: string
) => {
  if (gameIds.length === 0) return {};

  const players = await DBClient.select({
    gameId: gamePlayer.gameId,
    count: gamePlayer.id,
  })
    .from(gamePlayer)
    .where(
      and(eq(gamePlayer.userId, userId), inArray(gamePlayer.gameId, gameIds))
    );

  const playerCounts: Record<string, number> = {};
  for (const player of players) {
    if (player.gameId) {
      playerCounts[player.gameId] = (playerCounts[player.gameId] || 0) + 1;
    }
  }

  return playerCounts;
};

/**
 * クラウドゲーム作成
 */
export const createCloudGame = async (
  gameData: CreateGameData,
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
  gameData: UpdateGameData,
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
  playerData: AddPlayerData,
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
export const addCloudGameLog = async (logData: AddLogData, userId: string) => {
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
