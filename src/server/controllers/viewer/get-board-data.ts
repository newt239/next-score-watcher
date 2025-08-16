import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { getPublicGameById } from "../../repositories/game";

import { GetViewerBoardDataParamSchema } from "@/models/games";
import { getCachedBoardData } from "@/utils/cache/cache-service";

const factory = createFactory();

/**
 * 公開ゲームのボードデータを取得（認証不要・viewer用）
 */
const handler = factory.createHandlers(
  zValidator("param", GetViewerBoardDataParamSchema),
  async (c) => {
    try {
      const { gameId } = c.req.valid("param");

      // まずキャッシュからデータを取得
      const cachedData = await getCachedBoardData(gameId);

      if (cachedData) {
        return c.json({
          data: cachedData,
        } as const);
      }

      // キャッシュにない場合は、ゲームが公開設定かどうかを確認
      const gameData = await getPublicGameById(gameId);

      if (!gameData) {
        return c.json(
          {
            error: "ゲームが見つからないか、非公開に設定されています",
          } as const,
          404
        );
      }

      // キャッシュが存在しない場合は、データが準備中である旨を返す
      return c.json(
        {
          error: "データを準備中です。しばらくしてから再度お試しください",
        },
        202
      );
    } catch (error) {
      console.error("Failed to get viewer board data:", error);
      return c.json(
        {
          error: "ボードデータの取得に失敗しました",
        },
        500
      );
    }
  }
);

export default handler;
