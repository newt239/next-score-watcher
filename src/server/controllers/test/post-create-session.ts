import { eq } from "drizzle-orm";
import { createFactory } from "hono/factory";

import { DBClient } from "@/utils/drizzle/client";
import { session, user } from "@/utils/drizzle/schema";

const factory = createFactory();

/**
 * テスト専用: セッションとユーザーを作成するエンドポイント
 * 本番環境では使用しない
 */
const handler = factory.createHandlers(async (c) => {
  // 本番環境では無効にする
  if (process.env.NODE_ENV === "production") {
    return c.json({ error: "Not available in production" } as const, 403);
  }

  try {
    const body = await c.req.json();
    const { sessionId, sessionToken, userId, expiresAt, user: userData } = body;

    // ユーザーが存在しない場合は作成
    const existingUsers = await DBClient.select()
      .from(user)
      .where(eq(user.id, userId));

    if (existingUsers.length === 0) {
      await DBClient.insert(user).values({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        image: userData.image,
        emailVerified: userData.emailVerified,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      });
    }

    // セッションを作成
    await DBClient.insert(session).values({
      id: sessionId,
      token: sessionToken,
      userId,
      expiresAt: new Date(expiresAt),
      ipAddress: "127.0.0.1",
      userAgent: "playwright-test",
    });

    return c.json({ success: true, sessionId, sessionToken } as const);
  } catch (error) {
    console.error("Error creating test session:", error);
    return c.json({ error: "Failed to create session" } as const, 500);
  }
});

export default handler;
