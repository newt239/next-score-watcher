import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { z } from "zod";

import { getUserId } from "@/server/repositories/auth";
import { getQuizDetail } from "@/server/repositories/quiz";

const factory = createFactory();

const QuizDetailParamSchema = z.object({
  id: z.string().min(1, "クイズ問題IDは必須です"),
});

/**
 * クイズ問題詳細取得
 */
const handler = factory.createHandlers(
  zValidator("param", QuizDetailParamSchema),
  async (c) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        return c.json(
          { success: false, error: "ユーザーが見つかりません" } as const,
          404
        );
      }

      const { id } = c.req.valid("param");
      const quiz = await getQuizDetail(id, userId);

      if (!quiz) {
        return c.json(
          { success: false, error: "クイズ問題が見つかりません" } as const,
          404
        );
      }

      return c.json({
        success: true,
        data: quiz,
      } as const);
    } catch (error) {
      console.error("クイズ問題詳細取得エラー:", error);
      return c.json(
        {
          success: false,
          error: "クイズ問題詳細の取得に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
