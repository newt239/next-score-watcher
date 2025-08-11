import { eq } from "drizzle-orm";
import { createFactory } from "hono/factory";

import { DBClient } from "@/utils/drizzle/client";
import { session, user } from "@/utils/drizzle/schema";

const factory = createFactory();

/**
 * テスト専用: セッション状態を確認するエンドポイント
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
      return c.json({ error: "Session ID required" } as const, 400);
    }

    console.log("Checking session:", sessionId);

    // セッション情報をデータベースから取得
    const sessionData = await DBClient.select()
      .from(session)
      .where(eq(session.id, sessionId))
      .leftJoin(user, eq(session.userId, user.id));

    console.log("Database session query result:", sessionData);

    if (sessionData.length === 0) {
      return c.json({ error: "Session not found" } as const, 404);
    }

    const sessionInfo = sessionData[0];

    return c.json({
      success: true,
      session: {
        id: sessionInfo.session.id,
        token: sessionInfo.session.token,
        userId: sessionInfo.session.userId,
        expiresAt: sessionInfo.session.expiresAt,
        createdAt: sessionInfo.session.createdAt,
        user: sessionInfo.user
          ? {
              id: sessionInfo.user.id,
              email: sessionInfo.user.email,
              name: sessionInfo.user.name,
            }
          : null,
      },
    } as const);
  } catch (error) {
    console.error("Error checking session:", error);
    return c.json(
      {
        error: "Failed to check session",
        details: error instanceof Error ? error.message : String(error),
      } as const,
      500
    );
  }
});

export default handler;
