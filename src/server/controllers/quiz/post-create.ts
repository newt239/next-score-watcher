import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { CreateQuizRequestSchema } from "@/models/quiz";
import { getUserId } from "@/server/repositories/auth";
import { createQuiz } from "@/server/repositories/quiz";

const factory = createFactory();

/**
 * クイズ問題作成
 */
const handler = factory.createHandlers(
  zValidator("json", CreateQuizRequestSchema),
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
      const result = await createQuiz(quizesData, userId);

      return c.json(
        {
          success: true,
          data: {
            ids: result.ids,
            createdCount: result.createdCount,
            message: `${result.createdCount}件のクイズ問題を作成しました`,
          },
        } as const,
        201
      );
    } catch (error) {
      console.error("クイズ問題作成エラー:", error);
      return c.json(
        {
          success: false,
          error: "クイズ問題の作成に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
