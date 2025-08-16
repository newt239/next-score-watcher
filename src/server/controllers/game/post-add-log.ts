import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import type { Variants } from "@/models/games";

import { AddGameLogRequestSchema } from "@/models/games";
import { getUserId } from "@/server/repositories/auth";
import { addGameLog, getGameById } from "@/server/repositories/game";
import { cacheBoardData } from "@/utils/cache/cache-service";
import { computeOnlineScore } from "@/utils/online/computeScore/computeOnlineScore";

const factory = createFactory();

/**
 * 公開ゲームの場合、ボードキャッシュを更新
 */
const updateBoardCacheIfPublic = async (gameId: string, userId: string) => {
  try {
    // ゲームデータを取得
    const gameData = await getGameById(gameId, userId);

    if (!gameData || !gameData.isPublic) {
      // 非公開ゲームの場合は何もしない
      return;
    }

    // プレイヤーデータを整形
    const playersData = gameData.players.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      affiliation: p.affiliation,
      displayOrder: p.displayOrder,
      initialScore: p.initialScore,
      initialCorrectCount: p.initialCorrectCount,
      initialWrongCount: p.initialWrongCount,
    }));

    // ログデータを日付文字列形式に変換
    const serializedLogs = gameData.logs.map((log) => ({
      ...log,
      timestamp: log.timestamp?.toISOString() || "",
      deletedAt: log.deletedAt?.toISOString() || null,
    }));

    // ゲームデータを計算用形式に変換
    const gameForCompute = {
      ...gameData,
      createdAt: gameData.createdAt?.toISOString() || "",
      updatedAt: gameData.updatedAt?.toISOString() || "",
      deletedAt: gameData.deletedAt?.toISOString() || null,
      players: playersData,
      logs: serializedLogs,
    };

    // スコア計算実行
    const computedResult = computeOnlineScore(
      gameForCompute as Parameters<typeof computeOnlineScore>[0],
      playersData,
      serializedLogs as Parameters<typeof computeOnlineScore>[2]
    );

    // キャッシュ用データ作成
    const boardData = {
      game: {
        id: gameData.id,
        name: gameData.name,
        ruleType: gameData.ruleType,
        isPublic: true,
        createdAt: gameData.createdAt?.toISOString(),
        updatedAt: gameData.updatedAt?.toISOString(),
      },
      players: computedResult.scores || [],
      logs: gameData.logs.map((log) => ({
        id: log.id,
        player_id: log.playerId || "",
        variant: log.actionType as Variants,
        system: log.isSystemAction ? 1 : 0,
        available: 1,
        createdAt: log.timestamp?.toISOString(),
        updatedAt: log.timestamp?.toISOString(),
      })),
    };

    // キャッシュに保存
    await cacheBoardData(gameId, boardData);
  } catch (error) {
    console.error(`Failed to update board cache for game ${gameId}:`, error);
    // キャッシュ更新失敗は非致命的エラーとして扱う
  }
};

/**
 * ゲームログ追加
 */
const handler = factory.createHandlers(
  zValidator("json", AddGameLogRequestSchema),
  async (c) => {
    try {
      const userId = await getUserId();

      if (!userId) {
        return c.json({ error: "認証が必要です" } as const, 401);
      }

      const logData = c.req.valid("json");
      const logId = await addGameLog(logData, userId);

      // ログ追加後、ゲームが公開設定の場合はスコア計算してキャッシュ更新
      await updateBoardCacheIfPublic(logData.gameId, userId);

      return c.json({ logId } as const, 201);
    } catch (error) {
      console.error("Error adding cloud game log:", error);
      return c.json({ error: "サーバーエラーが発生しました" } as const, 500);
    }
  }
);

export default handler;
