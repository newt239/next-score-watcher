import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { UpdateQuizRequestSchema } from "@/models/quizes";
import { getUserId } from "@/server/repositories/auth";
import { updateQuiz } from "@/server/repositories/quiz";

const factory = createFactory();

/**
 * クイズ問題更新
 */
const handler = factory.createHandlers(
  zValidator("json", UpdateQuizRequestSchema),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json(
          { success: false, error: "ユーザーが見つかりません" } as const,
          404
        );
      }

      const quizesData = c.req.valid("json");
      const result = await updateQuiz(quizesData, userId);

      return c.json(
        {
          success: true,
          data: {
            updatedCount: result.updatedCount,
            message: `${result.updatedCount}件のクイズ問題を更新しました`,
          },
        } as const,
        200
      );
    } catch (error) {
      console.error("クイズ問題更新エラー:", error);
      return c.json(
        {
          success: false,
          error: "クイズ問題の更新に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
