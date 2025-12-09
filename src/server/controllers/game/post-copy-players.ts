import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { z } from "zod";

import { CopyPlayersFromGameRequestSchema } from "@/models/game";
import { getUserId } from "@/server/repositories/auth";
import { copyPlayersFromGame } from "@/server/repositories/game";

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
        return c.json({ success: false, error: "ユーザーが見つかりません" } as const, 404);
      }

      const { sourceGameId } = c.req.valid("json");
      const { game_id: targetGameId } = c.req.valid("param");

      const result = await copyPlayersFromGame(targetGameId, sourceGameId, userId);

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
