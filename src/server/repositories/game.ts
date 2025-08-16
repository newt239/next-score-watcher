import { and, asc, count, desc, eq, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";

import { parseGameOption, setupDefaultGameOption } from "../utils/options";

import type {
  AddGameLogRequestType,
  AddPlayerToGameRequestType,
  CreateGameRequestType,
  UpdateGamePlayerRequestJsonType,
  UpdateGamePlayerType,
  UpdateGameRequestJsonType,
  UpdateGameSettingsRequestType,
} from "@/models/games";

import { DBClient } from "@/utils/drizzle/client";
import { game, gameLog, gamePlayer, player } from "@/utils/drizzle/schema";

/**
 * 特定のゲーム情報を取得
 */
export const getGameById = async (gameId: string, userId: string) => {
  const queryResult = await DBClient.query.game.findFirst({
    where: and(
      eq(game.id, gameId),
      eq(game.userId, userId),
      isNull(game.deletedAt)
    ),
    with: {
      gameLog: {
        where: isNull(gameLog.deletedAt),
      },
      gamePlayer: {
        where: isNull(gamePlayer.deletedAt),
        with: {
          player: {
            columns: {
              id: true,
              name: true,
              description: true,
              affiliation: true,
            },
          },
        },
        columns: {
          displayOrder: true,
          initialScore: true,
          initialCorrectCount: true,
          initialWrongCount: true,
        },
      },
    },
  });

  if (!queryResult || !queryResult.id) {
    return null;
  }

  const {
    gameLog: gameLogData,
    gamePlayer: gamePlayerData,
    ...gameData
  } = queryResult;

  // ゲーム設定を取得
  const parsedGame = parseGameOption(gameData);

  if (!parsedGame) {
    return null;
  }

  return {
    ...parsedGame,
    players: gamePlayerData.map((p) => ({
      id: p.player?.id || "",
      name: p.player?.name || "",
      description: p.player?.description || "",
      affiliation: p.player?.affiliation || "",
      displayOrder: p.displayOrder,
      initialScore: p.initialScore,
      initialCorrectCount: p.initialCorrectCount,
      initialWrongCount: p.initialWrongCount,
    })),
    logs: gameLogData,
  };
};

/**
 * ユーザーのゲーム一覧を取得
 */
export const getGames = async (userId: string) => {
  const games = await DBClient.select({
    id: game.id,
    name: game.name,
    ruleType: game.ruleType,
    updatedAt: game.updatedAt,
    isPublic: game.isPublic,
    logCount: count(gameLog.id),
    playerCount: count(gamePlayer.id),
  })
    .from(game)
    .leftJoin(gameLog, eq(game.id, gameLog.gameId))
    .leftJoin(gamePlayer, eq(game.id, gamePlayer.gameId))
    .where(and(eq(game.userId, userId), isNull(game.deletedAt)))
    .orderBy(desc(game.updatedAt));

  return games.filter((g) => g.id !== null);
};

/**
 * ゲーム作成
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
    option: setupDefaultGameOption(gameData),
    userId,
  }));

  await DBClient.insert(game).values(gamesToInsert);

  return {
    ids: gamesToInsert.map((g) => g.id),
    createdCount: gamesToInsert.length,
  };
};

/**
 * ゲーム更新
 */
export const updateGameByKey = async (
  updateData: {
    gameId: string;
  } & UpdateGameRequestJsonType,
  userId: string
) => {
  // keyがnameかdiscordWebhookUrlかそれ以外かで分岐
  const { gameId, key, value } = updateData;
  if (key === "name" || key === "discordWebhookUrl") {
    const result = await DBClient.update(game)
      .set({
        [key]: value,
        updatedAt: new Date(),
      })
      .where(and(eq(game.id, gameId), eq(game.userId, userId)));
    return result.rowsAffected > 0;
  } else if (key === "option") {
    // TODO: valueが正しいスキーマであるかZodでバリデーション
    const result = await DBClient.update(game)
      .set({ option: value })
      .where(and(eq(game.id, gameId), eq(game.userId, userId)));
    return result.rowsAffected > 0;
  } else if (key === "isPublic") {
    const result = await DBClient.update(game)
      .set({
        isPublic: value as boolean,
        updatedAt: new Date(),
      })
      .where(and(eq(game.id, gameId), eq(game.userId, userId)));
    return result.rowsAffected > 0;
  }
  return false;
};

/**
 * ゲーム削除
 */
export const deleteGameById = async (gameId: string, userId: string) => {
  const result = await DBClient.update(game)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(game.id, gameId), eq(game.userId, userId)));

  return result.rowsAffected > 0;
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
 * ゲームプレイヤー追加
 */
export const addGamePlayer = async (
  gameId: string,
  playerData: AddPlayerToGameRequestType,
  userId: string
) => {
  const result = await DBClient.insert(gamePlayer).values({
    ...playerData,
    gameId,
    userId,
  });
  return result.rowsAffected > 0;
};

/**
 * ゲームログ取得
 */
export const getGameLogsById = async (gameId: string, userId: string) => {
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

  return logs;
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
 * ゲームログ情報を取得
 */
export const getGameLogById = async (logId: string, userId: string) => {
  const log = await DBClient.select({
    id: gameLog.id,
    gameId: gameLog.gameId,
  })
    .from(gameLog)
    .where(and(eq(gameLog.id, logId), eq(gameLog.userId, userId)))
    .limit(1);

  return log[0] || null;
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
 * ゲームの名前かDiscord Webhook URLを更新
 */
export const updateGameSettings = async (
  gameId: string,
  settingsData: UpdateGameSettingsRequestType,
  userId: string
): Promise<boolean> => {
  try {
    const gameData = await getGameById(gameId, userId);
    if (!gameData) return false;

    await DBClient.update(game)
      .set({
        ...settingsData,
        updatedAt: new Date(),
      })
      .where(and(eq(game.id, gameId), eq(game.userId, userId)));

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

  try {
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
  } catch (error) {
    console.error("Error in updateGamePlayers:", error);
    throw error;
  }
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
 * ゲームオプション取得
 */
export const getGameOptionById = async (gameId: string, userId: string) => {
  const gameData = await DBClient.query.game.findFirst({
    where: and(eq(game.id, gameId), eq(game.userId, userId)),
    columns: {
      ruleType: true,
      option: true,
    },
  });
  if (!gameData) {
    return null;
  }
  const parsedOption = setupDefaultGameOption(gameData);
  return parsedOption;
};

/**
 * ゲームオプション更新
 */
export const updateGameOption = async (
  gameId: string,
  option: {
    [key: string]: string | number | boolean;
  },
  userId: string
) => {
  const result = await DBClient.update(game)
    .set({
      option,
      updatedAt: new Date(),
    })
    .where(
      and(eq(game.id, gameId), eq(game.userId, userId), isNull(game.deletedAt))
    );

  return result.rowsAffected > 0;
};

/**
 * ゲームプレイヤー個別更新
 */
export const updateGamePlayerByKey = async (
  gamePlayerId: string,
  updateData: UpdateGamePlayerRequestJsonType,
  userId: string
): Promise<boolean> => {
  try {
    const { key, value } = updateData;

    const result = await DBClient.update(gamePlayer)
      .set({
        [key]: value,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(gamePlayer.id, gamePlayerId),
          eq(gamePlayer.userId, userId),
          isNull(gamePlayer.deletedAt)
        )
      );

    return result.rowsAffected > 0;
  } catch (error) {
    console.error("Failed to update game player:", error);
    return false;
  }
};

/**
 * ゲームプレイヤー削除（指定されたプレイヤーIDのリストを削除）
 */
export const removeGamePlayers = async (
  gameId: string,
  playerIds: string[],
  userId: string
): Promise<{ deletedCount: number }> => {
  try {
    let deletedCount = 0;

    for (const playerId of playerIds) {
      const result = await DBClient.update(gamePlayer)
        .set({
          deletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(gamePlayer.gameId, gameId),
            eq(gamePlayer.playerId, playerId),
            eq(gamePlayer.userId, userId),
            isNull(gamePlayer.deletedAt)
          )
        );

      if (result.rowsAffected > 0) {
        deletedCount++;
      }
    }

    return { deletedCount };
  } catch (error) {
    console.error("Failed to remove game players:", error);
    throw error;
  }
};

/**
 * 公開ゲーム情報を取得（認証不要）
 */
export const getPublicGameById = async (gameId: string) => {
  const queryResult = await DBClient.query.game.findFirst({
    where: and(
      eq(game.id, gameId),
      eq(game.isPublic, true),
      isNull(game.deletedAt)
    ),
    with: {
      gameLog: {
        where: isNull(gameLog.deletedAt),
      },
      gamePlayer: {
        where: isNull(gamePlayer.deletedAt),
        with: {
          player: {
            columns: {
              id: true,
              name: true,
              description: true,
              affiliation: true,
            },
          },
        },
        columns: {
          displayOrder: true,
          initialScore: true,
          initialCorrectCount: true,
          initialWrongCount: true,
        },
      },
    },
  });

  if (!queryResult || !queryResult.id) {
    return null;
  }

  const {
    gameLog: gameLogData,
    gamePlayer: gamePlayerData,
    ...gameData
  } = queryResult;

  // ゲーム設定を取得
  const parsedGame = parseGameOption(gameData);

  if (!parsedGame) {
    return null;
  }

  return {
    ...parsedGame,
    players: gamePlayerData.map((p) => ({
      id: p.player?.id || "",
      name: p.player?.name || "",
      description: p.player?.description || "",
      affiliation: p.player?.affiliation || "",
      displayOrder: p.displayOrder,
      initialScore: p.initialScore,
      initialCorrectCount: p.initialCorrectCount,
      initialWrongCount: p.initialWrongCount,
    })),
    logs: gameLogData,
  };
};
