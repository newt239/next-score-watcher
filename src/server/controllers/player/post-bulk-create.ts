import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { BulkCreatePlayersRequestSchema } from "@/models/players";
import { insertMultiplePlayers } from "@/server/repositories/players";

const factory = createFactory();

/**
 * 複数プレイヤーを一括作成するハンドラー
 */
const handler = factory.createHandlers(
  zValidator("json", BulkCreatePlayersRequestSchema),
  async (c) => {
    const userId = c.req.header("x-user-id");
    if (!userId) {
      return c.json(
        {
          success: false as const,
          error: { message: "認証が必要です" },
        },
        401
      );
    }

    const { players } = c.req.valid("json");

    try {
      const createdCount = await insertMultiplePlayers(userId, players);

      return c.json({
        success: true as const,
        data: {
          createdCount,
          message: `${createdCount}件のプレイヤーを作成しました`,
        },
      });
    } catch (error) {
      return c.json(
        {
          success: false as const,
          error: {
            message:
              error instanceof Error
                ? error.message
                : "プレイヤーの一括作成に失敗しました",
          },
        },
        500
      );
    }
  }
);

export default handler;
