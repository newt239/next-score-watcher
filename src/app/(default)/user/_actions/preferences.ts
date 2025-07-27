"use server";

import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";

import { getUser } from "@/utils/auth/auth-helpers";
import { DBClient } from "@/utils/drizzle/client";
import { userPreference } from "@/utils/drizzle/schema";
import {
  UserPreferences,
  getUserPreferences as utilGetUserPreferences,
} from "@/utils/user-preferences";

// ユーザー設定を取得
export async function getUserPreferences(): Promise<UserPreferences | null> {
  const user = await getUser();

  if (!user) {
    return null;
  }

  try {
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
    await DBClient.insert(userPreference).values({
      userId: user.id,
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
