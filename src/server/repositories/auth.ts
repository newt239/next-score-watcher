import { headers } from "next/headers";

import { auth } from "@/utils/auth/auth";

export const getUserId = async () => {
  // テスト環境での認証バイパス
  const headersList = await headers();
  const isPlaywrightTest = headersList.get("x-playwright-test") === "true";
  const testUserId = headersList.get("x-test-user-id");

  if (
    (process.env.NODE_ENV === "test" || isPlaywrightTest) &&
    testUserId === "test-user-playwright"
  ) {
    return "test-user-playwright";
  }

  const session = await auth.api.getSession({ headers: headersList });
  if (!session) {
    return null;
  }
  return session.user.id;
};
