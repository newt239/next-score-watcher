import { and, asc, desc, eq, inArray, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";

import type {
  AddGameLogRequestType,
  AddPlayerToGameRequestType,
  CreateGameRequestType,
  CreateGameType,
  DeleteGameRequestType,
  UpdateGameRequestType,
  UpdateGameType,
  UpdateGameSettingsRequestType,
  GetGameSettingsResponseType,
  UpdateGamePlayerType,
  UpdateGameQuizType,
} from "@/models/games";
import type { Variants } from "@/utils/types";

import { DBClient } from "@/utils/drizzle/client";
import { game, gameLog, gamePlayer, player } from "@/utils/drizzle/schema";
import {
  gameNomxSetting,
  gameNomxAdSetting,
  gameNySetting,
  gameNomrSetting,
  gameEndlessChanceSetting,
  gameAqlSetting,
} from "@/utils/drizzle/schema/rule";

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
    .where(and(eq(game.userId, userId), isNull(game.deletedAt)))
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
      and(
        eq(gamePlayer.userId, userId),
        inArray(gamePlayer.gameId, gameIds),
        isNull(gamePlayer.deletedAt)
      )
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
  const result = await DBClient.update(game)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(game.id, gameId), eq(game.userId, userId)));

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
    .where(
      and(
        eq(gamePlayer.gameId, gameId),
        eq(gamePlayer.userId, userId),
        isNull(gamePlayer.deletedAt)
      )
    )
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
    .where(
      and(
        eq(gameLog.gameId, gameId),
        eq(gameLog.userId, userId),
        isNull(gameLog.deletedAt)
      )
    )
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

/**
 * クラウドゲーム設定取得
 */
export const getGameSettings = async (
  gameId: string,
  userId: string
): Promise<GetGameSettingsResponseType | null> => {
  const gameData = await getGame(gameId, userId);
  if (!gameData) return null;

  // ゲーム基本情報
  const settings: GetGameSettingsResponseType = {
    name: gameData.name,
    discordWebhookUrl: gameData.discordWebhookUrl,
  };

  // 各ルール形式の設定を取得
  try {
    switch (gameData.ruleType) {
      case "nomx": {
        const result = await DBClient.select()
          .from(gameNomxSetting)
          .where(eq(gameNomxSetting.gameId, gameId))
          .limit(1);
        if (result[0]) {
          settings.winPoint = result[0].winPoint;
          settings.losePoint = result[0].losePoint;
        }
        break;
      }
      case "nomx-ad": {
        const result = await DBClient.select()
          .from(gameNomxAdSetting)
          .where(eq(gameNomxAdSetting.gameId, gameId))
          .limit(1);
        if (result[0]) {
          settings.winPoint = result[0].winPoint;
          settings.losePoint = result[0].losePoint;
          settings.streakOver3 = result[0].streakOver3;
        }
        break;
      }
      case "ny": {
        const result = await DBClient.select()
          .from(gameNySetting)
          .where(eq(gameNySetting.gameId, gameId))
          .limit(1);
        if (result[0]) {
          settings.targetPoint = result[0].targetPoint;
        }
        break;
      }
      case "nomr": {
        const result = await DBClient.select()
          .from(gameNomrSetting)
          .where(eq(gameNomrSetting.gameId, gameId))
          .limit(1);
        if (result[0]) {
          settings.winPoint = result[0].winPoint;
          settings.restCount = result[0].restCount;
        }
        break;
      }
      case "endless-chance": {
        const result = await DBClient.select()
          .from(gameEndlessChanceSetting)
          .where(eq(gameEndlessChanceSetting.gameId, gameId))
          .limit(1);
        if (result[0]) {
          settings.loseCount = result[0].loseCount;
          settings.useR = result[0].useR;
        }
        break;
      }
      case "aql": {
        const result = await DBClient.select()
          .from(gameAqlSetting)
          .where(eq(gameAqlSetting.gameId, gameId))
          .limit(1);
        if (result[0]) {
          settings.leftTeam = result[0].leftTeam;
          settings.rightTeam = result[0].rightTeam;
        }
        break;
      }
      // 他のルール形式も必要に応じて追加
    }
  } catch (error) {
    console.error("Failed to get game settings:", error);
    // 設定が取得できない場合でも基本情報は返す
  }

  return settings;
};

/**
 * クラウドゲーム設定更新
 */
export const updateGameSettings = async (
  gameId: string,
  settingsData: UpdateGameSettingsRequestType,
  userId: string
): Promise<boolean> => {
  try {
    const gameData = await getGame(gameId, userId);
    if (!gameData) return false;

    // 基本情報の更新
    const basicUpdateData: {
      name?: string;
      discordWebhookUrl?: string;
      updatedAt?: Date;
    } = {};
    if (settingsData.name !== undefined)
      basicUpdateData.name = settingsData.name;
    if (settingsData.discordWebhookUrl !== undefined)
      basicUpdateData.discordWebhookUrl = settingsData.discordWebhookUrl;

    if (Object.keys(basicUpdateData).length > 0) {
      basicUpdateData.updatedAt = new Date();
      await DBClient.update(game)
        .set(basicUpdateData)
        .where(and(eq(game.id, gameId), eq(game.userId, userId)));
    }

    // 各ルール形式の設定を更新
    switch (gameData.ruleType) {
      case "nomx": {
        const updateData: { winPoint?: number; losePoint?: number } = {};
        if (settingsData.winPoint !== undefined)
          updateData.winPoint = settingsData.winPoint;
        if (settingsData.losePoint !== undefined)
          updateData.losePoint = settingsData.losePoint;

        if (Object.keys(updateData).length > 0) {
          await DBClient.update(gameNomxSetting)
            .set(updateData)
            .where(eq(gameNomxSetting.gameId, gameId));
        }
        break;
      }
      case "nomx-ad": {
        const updateData: {
          winPoint?: number;
          losePoint?: number;
          streakOver3?: boolean;
        } = {};
        if (settingsData.winPoint !== undefined)
          updateData.winPoint = settingsData.winPoint;
        if (settingsData.losePoint !== undefined)
          updateData.losePoint = settingsData.losePoint;
        if (settingsData.streakOver3 !== undefined)
          updateData.streakOver3 = settingsData.streakOver3;

        if (Object.keys(updateData).length > 0) {
          await DBClient.update(gameNomxAdSetting)
            .set(updateData)
            .where(eq(gameNomxAdSetting.gameId, gameId));
        }
        break;
      }
      case "ny": {
        const updateData: { targetPoint?: number } = {};
        if (settingsData.targetPoint !== undefined)
          updateData.targetPoint = settingsData.targetPoint;

        if (Object.keys(updateData).length > 0) {
          await DBClient.update(gameNySetting)
            .set(updateData)
            .where(eq(gameNySetting.gameId, gameId));
        }
        break;
      }
      case "nomr": {
        const updateData: { winPoint?: number; restCount?: number } = {};
        if (settingsData.winPoint !== undefined)
          updateData.winPoint = settingsData.winPoint;
        if (settingsData.restCount !== undefined)
          updateData.restCount = settingsData.restCount;

        if (Object.keys(updateData).length > 0) {
          await DBClient.update(gameNomrSetting)
            .set(updateData)
            .where(eq(gameNomrSetting.gameId, gameId));
        }
        break;
      }
      case "endless-chance": {
        const updateData: { loseCount?: number; useR?: boolean } = {};
        if (settingsData.loseCount !== undefined)
          updateData.loseCount = settingsData.loseCount;
        if (settingsData.useR !== undefined)
          updateData.useR = settingsData.useR;

        if (Object.keys(updateData).length > 0) {
          await DBClient.update(gameEndlessChanceSetting)
            .set(updateData)
            .where(eq(gameEndlessChanceSetting.gameId, gameId));
        }
        break;
      }
      case "aql": {
        const updateData: { leftTeam?: string; rightTeam?: string } = {};
        if (settingsData.leftTeam !== undefined)
          updateData.leftTeam = settingsData.leftTeam;
        if (settingsData.rightTeam !== undefined)
          updateData.rightTeam = settingsData.rightTeam;

        if (Object.keys(updateData).length > 0) {
          await DBClient.update(gameAqlSetting)
            .set(updateData)
            .where(eq(gameAqlSetting.gameId, gameId));
        }
        break;
      }
    }

    return true;
  } catch (error) {
    console.error("Failed to update game settings:", error);
    return false;
  }
};

/**
 * ゲームプレイヤー一括更新
 */
export const updateGamePlayers = async (
  gameId: string,
  players: UpdateGamePlayerType[],
  userId: string
): Promise<{ updatedCount: number }> => {
  let updatedCount = 0;

  // 既存のプレイヤーを論理削除
  await DBClient.update(gamePlayer)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gamePlayer.gameId, gameId),
        eq(gamePlayer.userId, userId),
        isNull(gamePlayer.deletedAt)
      )
    );

  // 新しいプレイヤーリストを挿入
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    await DBClient.insert(gamePlayer).values({
      gameId,
      playerId: player.id,
      displayOrder: i,
      initialScore: player.initialScore || 0,
      initialCorrectCount: player.initialCorrectCount || 0,
      initialWrongCount: player.initialWrongCount || 0,
      userId,
    });
    updatedCount++;
  }

  return { updatedCount };
};

/**
 * 既存ゲームからプレイヤーをコピー
 */
export const copyPlayersFromGame = async (
  targetGameId: string,
  sourceGameId: string,
  userId: string
): Promise<{ copiedCount: number }> => {
  // ソースゲームのプレイヤーを取得
  const sourcePlayers = await DBClient.select({
    playerId: gamePlayer.playerId,
    displayOrder: gamePlayer.displayOrder,
    initialScore: gamePlayer.initialScore,
    initialCorrectCount: gamePlayer.initialCorrectCount,
    initialWrongCount: gamePlayer.initialWrongCount,
  })
    .from(gamePlayer)
    .where(
      and(
        eq(gamePlayer.gameId, sourceGameId),
        eq(gamePlayer.userId, userId),
        isNull(gamePlayer.deletedAt)
      )
    )
    .orderBy(asc(gamePlayer.displayOrder));

  if (sourcePlayers.length === 0) {
    return { copiedCount: 0 };
  }

  // 既存のプレイヤーを論理削除
  await DBClient.update(gamePlayer)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(gamePlayer.gameId, targetGameId),
        eq(gamePlayer.userId, userId),
        isNull(gamePlayer.deletedAt)
      )
    );

  // コピーしたプレイヤーを挿入
  let copiedCount = 0;
  for (const player of sourcePlayers) {
    if (player.playerId) {
      await DBClient.insert(gamePlayer).values({
        gameId: targetGameId,
        playerId: player.playerId,
        displayOrder: player.displayOrder || copiedCount,
        initialScore: player.initialScore || 0,
        initialCorrectCount: player.initialCorrectCount || 0,
        initialWrongCount: player.initialWrongCount || 0,
        userId,
      });
      copiedCount++;
    }
  }

  return { copiedCount };
};

/**
 * ゲームクイズ設定更新（今後データベーススキーマ拡張時に実装）
 */
export const updateGameQuiz = async (
  gameId: string,
  quiz: UpdateGameQuizType,
  _userId: string
): Promise<{ updated: boolean }> => {
  // TODO: gameテーブルにクイズ関連フィールドを追加してから実装
  // 現在はプレースホルダー実装
  console.log(`Quiz settings update for game ${gameId}:`, quiz);
  return { updated: true };
};

/**
 * 拡張ゲーム更新（プレイヤー・クイズ設定対応）
 */
export const updateGameExtended = async (
  gameData: {
    id: string;
    name?: string;
    discordWebhookUrl?: string;
    players?: UpdateGamePlayerType[];
    quiz?: UpdateGameQuizType;
  },
  userId: string
): Promise<{
  updatedCount: number;
  playersUpdatedCount?: number;
  quizUpdated?: boolean;
}> => {
  const result = {
    updatedCount: 0,
    playersUpdatedCount: 0,
    quizUpdated: false,
  };

  // 基本情報の更新
  const { id, players, quiz, ...basicData } = gameData;
  if (Object.keys(basicData).length > 0) {
    const updated = await updateSingleGame(id, basicData, userId);
    if (updated) {
      result.updatedCount = 1;
    }
  }

  // プレイヤー情報の更新
  if (players && players.length > 0) {
    const playersResult = await updateGamePlayers(id, players, userId);
    result.playersUpdatedCount = playersResult.updatedCount;
  }

  // クイズ設定の更新
  if (quiz) {
    const quizResult = await updateGameQuiz(id, quiz, userId);
    result.quizUpdated = quizResult.updated;
  }

  return result;
};

/**
 * 指定ゲームが存在し、ユーザーがアクセス可能かを確認
 */
export const verifyGameAccess = async (
  gameId: string,
  userId: string
): Promise<boolean> => {
  const gameData = await DBClient.select({ id: game.id })
    .from(game)
    .where(
      and(eq(game.id, gameId), eq(game.userId, userId), isNull(game.deletedAt))
    )
    .limit(1);

  return gameData.length > 0;
};
