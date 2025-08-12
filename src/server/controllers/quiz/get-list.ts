import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";

import { GetQuizesListRequestSchema } from "@/models/quizes";
import { getUserId } from "@/server/repositories/auth";
import { getQuizes, getQuizesWithPagination } from "@/server/repositories/quiz";

const factory = createFactory();

/**
 * クイズ問題一覧取得
 */
const handler = factory.createHandlers(
  zValidator("query", GetQuizesListRequestSchema),
  async (c) => {
    const userId = await getUserId();
    if (!userId) {
      return c.json(
        { success: false, error: "ユーザーが見つかりません" } as const,
        404
      );
    }

    const { limit, offset, category } = c.req.valid("query");

    try {
      // ページネーションパラメータがある場合は getQuizesWithPagination を使用
      if (limit !== undefined || offset !== undefined) {
        const result = await getQuizesWithPagination(
          userId,
          limit ?? 50,
          offset ?? 0,
          category
        );
        return c.json({
          success: true,
          data: result,
        } as const);
      }

      // パラメータがない場合は従来の getQuizes を使用
      const quizes = await getQuizes(userId);
      return c.json({
        success: true,
        data: { quizes },
      } as const);
    } catch (error) {
      console.error("クイズ問題一覧取得エラー:", error);
      return c.json(
        {
          success: false,
          error: "クイズ問題一覧の取得に失敗しました",
        } as const,
        500
      );
    }
  }
);

export default handler;
