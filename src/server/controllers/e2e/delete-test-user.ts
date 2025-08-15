import { eq } from "drizzle-orm";
import { createFactory } from "hono/factory";

import { DBClient, user, account, session } from "@/utils/drizzle/client";

const factory = createFactory();

/**
 * テスト専用ユーザー削除エンドポイント
 * E2Eテストでのみ使用される
 */
export default factory.createHandlers(async (c) => {
  // 本番環境では無効
  if (process.env.NODE_ENV === "production") {
    return c.json({ error: "このエンドポイントは利用できません" }, 403);
  }

  const TEST_EMAIL = "e2e-test@example.com";

  try {
    // テストユーザーを取得
    const testUser = await DBClient.select()
      .from(user)
      .where(eq(user.email, TEST_EMAIL))
      .limit(1);

    if (testUser.length === 0) {
      return c.json({ message: "テストユーザーは存在しません" });
    }

    const userId = testUser[0].id;

    // 関連データを削除
    await DBClient.delete(session).where(eq(session.userId, userId));
    await DBClient.delete(account).where(eq(account.userId, userId));
    await DBClient.delete(user).where(eq(user.id, userId));

    return c.json({ message: "テストユーザーを削除しました" });
  } catch (error) {
    console.error("テストユーザー削除エラー:", error);
    return c.json({ error: "テストユーザー削除に失敗しました" }, 500);
  }
});
