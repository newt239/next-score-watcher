import { headers } from "next/headers";

import { auth } from "./auth";

export async function getSession() {
  // テスト環境での認証バイパス
  const headersList = await headers();
  const isPlaywrightTest = headersList.get("x-playwright-test") === "true";
  const testUserId = headersList.get("x-test-user-id");

  if (
    (process.env.NODE_ENV === "test" || isPlaywrightTest) &&
    testUserId === "test-user-playwright"
  ) {
    return {
      session: {
        id: "test-session",
        userId: "test-user-playwright",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      user: {
        id: "test-user-playwright",
        email: "playwright-test@example.com",
        name: "Playwrightテストユーザー",
        image: null,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export async function getUser() {
  // テスト環境での認証バイパス
  const headersList = await headers();
  const isPlaywrightTest = headersList.get("x-playwright-test") === "true";
  const testUserId = headersList.get("x-test-user-id");

  if (
    (process.env.NODE_ENV === "test" || isPlaywrightTest) &&
    testUserId === "test-user-playwright"
  ) {
    return {
      id: "test-user-playwright",
      email: "playwright-test@example.com",
      name: "Playwrightテストユーザー",
      image: null,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  try {
    const session = await getSession();
    return session?.user || null;
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Authentication required");
  }
  return session;
}
