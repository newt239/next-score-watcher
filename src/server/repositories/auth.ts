import { headers } from "next/headers";

import { auth } from "@/utils/auth/auth";

export const getUserId = async () => {
  // テスト環境での認証バイパス
  const headersList = await headers();
  const isPlaywrightTest = headersList.get("x-playwright-test") === "true";
  const testUserId = headersList.get("x-test-user-id");

  if (
    (process.env.NODE_ENV !== "production" || isPlaywrightTest) &&
    testUserId === process.env.PLAYWRIGHT_TEST_USER_ID
  ) {
    return process.env.PLAYWRIGHT_TEST_USER_ID;
  }

  const session = await auth.api.getSession({ headers: headersList });
  if (!session) {
    return null;
  }
  return session.user.id;
};
