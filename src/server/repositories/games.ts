import { eq, and, desc, asc, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";

import type {
  CreateGameRequestType,
  CreateGameType,
  UpdateGameRequestType,
  UpdateGameType,
  DeleteGameRequestType,
  AddPlayerToGameRequestType,
  AddGameLogRequestType,
} from "@/models/games";
import type { Variants } from "@/utils/types";

import { DBClient } from "@/utils/drizzle/client";
import { game, player, gamePlayer, gameLog } from "@/utils/drizzle/schema";

/**
 * クラウドゲーム取得
 */
export const getGame = async (gameId: string, userId: string) => {
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
export const getGames = async (userId: string) => {
  const games = await DBClient.select()
    .from(game)
    .where(eq(game.userId, userId))
    .orderBy(desc(game.updatedAt));

  return games;
};

/**
 * 複数ゲームのログ数を一括取得
 */
export const getGamesLogCounts = async (gameIds: string[], userId: string) => {
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
export const getGamesPlayerCounts = async (
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
 * 単一ゲーム作成
 */
export const createSingleGame = async (
  gameData: CreateGameType,
  userId: string
): Promise<string> => {
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
 * ゲーム作成（複数対応）
 */
export const createGame = async (
  gamesData: CreateGameRequestType,
  userId: string
): Promise<{ ids: string[]; createdCount: number }> => {
  const gamesToInsert = gamesData.map((gameData) => ({
    id: nanoid(),
    name: gameData.name,
    ruleType: gameData.ruleType,
    discordWebhookUrl: gameData.discordWebhookUrl,
    userId,
  }));

  await DBClient.insert(game).values(gamesToInsert);

  return {
    ids: gamesToInsert.map((g) => g.id),
    createdCount: gamesToInsert.length,
  };
};

/**
 * 単一ゲーム更新
 */
export const updateSingleGame = async (
  gameId: string,
  gameData: Omit<UpdateGameType, "id">,
  userId: string
): Promise<boolean> => {
  const result = await DBClient.update(game)
    .set({
      ...gameData,
      updatedAt: new Date(),
    })
    .where(and(eq(game.id, gameId), eq(game.userId, userId)));

  return result.rowsAffected > 0;
};

/**
 * ゲーム更新（複数対応）
 */
export const updateGame = async (
  gamesData: UpdateGameRequestType,
  userId: string
): Promise<{ updatedCount: number }> => {
  let updatedCount = 0;

  for (const gameData of gamesData) {
    const { id, ...updateData } = gameData;
    const updated = await updateSingleGame(id, updateData, userId);
    if (updated) {
      updatedCount++;
    }
  }

  return { updatedCount };
};

/**
 * 単一ゲーム削除
 */
export const deleteSingleGame = async (
  gameId: string,
  userId: string
): Promise<boolean> => {
  const result = await DBClient.delete(game).where(
    and(eq(game.id, gameId), eq(game.userId, userId))
  );

  return result.rowsAffected > 0;
};

/**
 * ゲーム削除（複数対応）
 */
export const deleteGame = async (
  gameIds: DeleteGameRequestType,
  userId: string
): Promise<{ deletedCount: number }> => {
  let deletedCount = 0;

  for (const gameId of gameIds) {
    const deleted = await deleteSingleGame(gameId, userId);
    if (deleted) {
      deletedCount++;
    }
  }

  return { deletedCount };
};

/**
 * クラウドゲームプレイヤー取得
 */
export const getGamePlayers = async (gameId: string, userId: string) => {
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
export const addGamePlayer = async (
  gameId: string,
  playerData: AddPlayerToGameRequestType,
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
export const getGameLogs = async (gameId: string, userId: string) => {
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
export const addGameLog = async (
  logData: AddGameLogRequestType,
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
export const removeGameLog = async (logId: string, userId: string) => {
  await DBClient.delete(gameLog).where(
    and(eq(gameLog.id, logId), eq(gameLog.userId, userId))
  );
};
