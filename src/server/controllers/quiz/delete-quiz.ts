import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { DeleteQuizRequestSchema } from "@/models/quizes";
import { getUserId } from "@/server/repositories/auth";
import { deleteQuiz } from "@/server/repositories/quiz";

const factory = createFactory();

/**
 * クイズ問題削除
 */
const handler = factory.createHandlers(
  zValidator("json", DeleteQuizRequestSchema),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json(
          { success: false, error: "ユーザーが見つかりません" } as const,
          404
        );
      }

      const quizIds = c.req.valid("json");
      const result = await deleteQuiz(quizIds, userId);

      return c.json(
        {
          success: true,
          data: {
            deletedQuizIds: result,
            message: `${result.length}件のクイズ問題を削除しました`,
          },
        } as const,
        200
      );
    } catch (error) {
      console.error("クイズ問題削除エラー:", error);
      return c.json(
        {
          success: false,
          error: "クイズ問題の削除に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
