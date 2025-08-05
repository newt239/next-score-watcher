import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { GetPlayersListRequestSchema } from "@/models/players";
import {
  getPlayers,
  getPlayersWithPagination,
} from "@/server/repositories/players";

const factory = createFactory();

/**
 * プレイヤー一覧取得
 */
const handler = factory.createHandlers(
  zValidator("query", GetPlayersListRequestSchema),
  async (c) => {
    const userId = c.req.header("x-user-id");
    if (!userId) {
      return c.json(
        {
          success: false,
          error: "認証が必要です",
        } as const,
        401
      );
    }

    const { limit, offset } = c.req.valid("query");

    try {
      // ページネーションパラメータがある場合は getPlayersWithPagination を使用
      if (limit !== undefined || offset !== undefined) {
        const result = await getPlayersWithPagination(
          userId,
          limit ?? 50,
          offset ?? 0
        );
        return c.json({
          success: true,
          data: result,
        } as const);
      }

      // パラメータがない場合は従来の getPlayers を使用
      const players = await getPlayers(userId);
      return c.json({
        success: true,
        data: { players },
      } as const);
    } catch (error) {
      console.error("プレイヤー一覧取得エラー:", error);
      return c.json(
        {
          success: false,
          error: "プレイヤー一覧の取得に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
