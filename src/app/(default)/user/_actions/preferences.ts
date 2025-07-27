"use server";

import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

import { getUser } from "@/utils/auth/auth-helpers";
import { DBClient } from "@/utils/drizzle/client";
import { userPreference } from "@/utils/drizzle/schema";
import {
  UserPreferences,
  defaultUserPreferences,
  getUserPreferences as utilGetUserPreferences,
} from "@/utils/user-preferences";
import { eq } from "drizzle-orm";

// ユーザー設定を取得
export async function getUserPreferences(): Promise<UserPreferences | null> {
  const user = await getUser();

  if (!user) {
    return null;
  }

  try {
    // 新しいユーティリティ関数を使用してユーザープリファレンスを取得
    return await utilGetUserPreferences(user.id);
  } catch (error) {
    console.error("Failed to get user preferences:", error);
    return null;
  }
}

// ユーザー設定を保存/更新
export async function updateUserPreferences(
  preferences: Partial<UserPreferences>
) {
  const user = await getUser();

  if (!user) {
    throw new Error("認証が必要です");
  }

  const existingPreferences = await DBClient.select()
    .from(userPreference)
    .where(eq(userPreference.userId, user.id))
    .limit(1);

  const now = new Date();

  if (existingPreferences.length === 0) {
    // 新規作成（デフォルト値を使用）
    await DBClient.insert(userPreference).values({
      id: nanoid(),
      userId: user.id,
      theme: preferences.theme ?? defaultUserPreferences.theme,
      showWinthroughPopup:
        preferences.showWinthroughPopup ??
        defaultUserPreferences.showWinthroughPopup,
      showBoardHeader:
        preferences.showBoardHeader ?? defaultUserPreferences.showBoardHeader,
      showQn: preferences.showQn ?? defaultUserPreferences.showQn,
      showSignString:
        preferences.showSignString ?? defaultUserPreferences.showSignString,
      reversePlayerInfo:
        preferences.reversePlayerInfo ??
        defaultUserPreferences.reversePlayerInfo,
      wrongNumber:
        preferences.wrongNumber ?? defaultUserPreferences.wrongNumber,
      webhookUrl: preferences.webhookUrl ?? defaultUserPreferences.webhookUrl,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    // 更新
    await DBClient.update(userPreference)
      .set({
        ...preferences,
        updatedAt: now,
      })
      .where(eq(userPreference.userId, user.id));
  }

  revalidatePath("/user");
}

// 個別設定を更新（部分更新用）
export async function updateUserPreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
) {
  await updateUserPreferences({ [key]: value });
}
