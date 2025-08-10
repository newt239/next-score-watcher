import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { UpdateGameRequestSchema } from "@/models/games";
import { getUserId } from "@/server/repositories/auth";
import { updateGame, updateGameExtended } from "@/server/repositories/games";

const factory = createFactory();

/**
 * ゲーム更新
 */
const handler = factory.createHandlers(
  zValidator("json", UpdateGameRequestSchema),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json(
          { success: false, error: "ユーザーが見つかりません" } as const,
          404
        );
      }

      const gamesData = c.req.valid("json");

      // 拡張機能（players, quiz）が含まれているかチェック
      const hasExtendedFeatures = gamesData.some(
        (game) => game.players || game.quiz
      );

      if (hasExtendedFeatures) {
        // 拡張更新処理
        let totalUpdated = 0;
        let totalPlayersUpdated = 0;
        let totalQuizUpdated = 0;

        for (const gameData of gamesData) {
          const result = await updateGameExtended(gameData, userId);
          totalUpdated += result.updatedCount;
          totalPlayersUpdated += result.playersUpdatedCount || 0;
          if (result.quizUpdated) totalQuizUpdated++;
        }

        return c.json(
          {
            success: true,
            data: {
              updatedCount: totalUpdated,
              playersUpdatedCount: totalPlayersUpdated,
              quizUpdatedCount: totalQuizUpdated,
              message: `${totalUpdated}件のゲーム、${totalPlayersUpdated}件のプレイヤー設定、${totalQuizUpdated}件のクイズ設定を更新しました`,
            },
          } as const,
          200
        );
      } else {
        // 通常の更新処理
        const result = await updateGame(gamesData, userId);

        return c.json(
          {
            success: true,
            data: {
              updatedCount: result.updatedCount,
              message: `${result.updatedCount}件のゲームを更新しました`,
            },
          } as const,
          200
        );
      }
    } catch (error) {
      console.error("ゲーム更新エラー:", error);
      return c.json(
        {
          success: false,
          error: "ゲームの更新に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
