import { eq } from "drizzle-orm";
import { createFactory } from "hono/factory";

import { DBClient } from "@/utils/drizzle/client";
import { session } from "@/utils/drizzle/schema";

const factory = createFactory();

/**
 * テスト専用: セッションをクリーンアップするエンドポイント
 * 本番環境では使用しない
 */
const handler = factory.createHandlers(async (c) => {
  // 本番環境では無効にする
  if (process.env.NODE_ENV === "production") {
    return c.json({ error: "Not available in production" } as const, 403);
  }

  try {
    const sessionId = c.req.param("sessionId");

    if (!sessionId) {
      return c.json(
        { error: "セッションIDが指定されていません" } as const,
        400
      );
    }

    // セッションを削除
    await DBClient.delete(session).where(eq(session.id, sessionId));

    return c.json({ success: true } as const);
  } catch (error) {
    console.error("Error cleaning up test session:", error);
    return c.json({ error: "Failed to cleanup session" } as const, 500);
  }
});

export default handler;
