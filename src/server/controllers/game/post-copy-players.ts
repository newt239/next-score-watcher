import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { z } from "zod";

import { CopyPlayersFromGameRequestSchema } from "@/models/games";
import { getUserId } from "@/server/repositories/auth";
import {
  copyPlayersFromGame,
  verifyGameAccess,
} from "@/server/repositories/games";

const factory = createFactory();

/**
 * 既存ゲームからプレイヤーをコピー
 */
const handler = factory.createHandlers(
  zValidator("json", CopyPlayersFromGameRequestSchema),
  zValidator("param", z.object({ game_id: z.string().min(1) })),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json(
          { success: false, error: "ユーザーが見つかりません" } as const,
          404
        );
      }

      const { sourceGameId } = c.req.valid("json");
      const { game_id: targetGameId } = c.req.valid("param");

      // 両方のゲームにアクセス権があるかチェック
      const [targetAccess, sourceAccess] = await Promise.all([
        verifyGameAccess(targetGameId, userId),
        verifyGameAccess(sourceGameId, userId),
      ]);

      if (!targetAccess || !sourceAccess) {
        return c.json(
          { success: false, error: "アクセス権限がありません" } as const,
          403
        );
      }

      const result = await copyPlayersFromGame(
        targetGameId,
        sourceGameId,
        userId
      );

      return c.json(
        {
          success: true,
          data: {
            copied: result.copiedCount > 0,
            copiedCount: result.copiedCount,
            message:
              result.copiedCount > 0
                ? `${result.copiedCount}件のプレイヤーをコピーしました`
                : "コピーできるプレイヤーがありませんでした",
          },
        } as const,
        200
      );
    } catch (error) {
      console.error("プレイヤーコピーエラー:", error);
      return c.json(
        {
          success: false,
          error: "プレイヤーのコピーに失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
