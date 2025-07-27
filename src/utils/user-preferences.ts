import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { DBClient } from "./drizzle/client";
import { userPreference } from "./drizzle/schema";

export type UserPreferences = {
  theme: "light" | "dark";
  showWinthroughPopup: boolean;
  showBoardHeader: boolean;
  showQn: boolean;
  showSignString: boolean;
  reversePlayerInfo: boolean;
  wrongNumber: boolean;
  webhookUrl: string | null;
};

/**
 * ユーザープリファレンスのデフォルト値
 */
export const defaultUserPreferences: UserPreferences = {
  theme: "light",
  showWinthroughPopup: true,
  showBoardHeader: true,
  showQn: false,
  showSignString: true,
  reversePlayerInfo: false,
  wrongNumber: true,
  webhookUrl: null,
};

/**
 * ユーザープリファレンスが存在しない場合、デフォルト値で新規作成する
 * @param userId ユーザーID
 * @returns 作成されたかどうかの真偽値
 */
export async function ensureUserPreferences(userId: string): Promise<boolean> {
  try {
    // 既存のプリファレンスを確認
    const existingPreferences = await DBClient.select()
      .from(userPreference)
      .where(eq(userPreference.userId, userId))
      .limit(1);

    // 既に存在する場合は何もしない
    if (existingPreferences.length > 0) {
      return false; // 新規作成されなかった
    }

    // 新規作成
    const now = new Date();
    await DBClient.insert(userPreference).values({
      id: nanoid(),
      userId: userId,
      theme: defaultUserPreferences.theme,
      showWinthroughPopup: defaultUserPreferences.showWinthroughPopup,
      showBoardHeader: defaultUserPreferences.showBoardHeader,
      showQn: defaultUserPreferences.showQn,
      showSignString: defaultUserPreferences.showSignString,
      reversePlayerInfo: defaultUserPreferences.reversePlayerInfo,
      wrongNumber: defaultUserPreferences.wrongNumber,
      webhookUrl: defaultUserPreferences.webhookUrl,
      createdAt: now,
      updatedAt: now,
    });

    console.log(`User preferences created for user: ${userId}`);
    return true;
  } catch (error) {
    console.error("Failed to ensure user preferences:", error);
    throw error;
  }
}

/**
 * ユーザープリファレンスを取得（存在しない場合はデフォルト値を返す）
 * @param userId ユーザーID
 * @returns ユーザープリファレンス
 */
export async function getUserPreferences(
  userId: string
): Promise<UserPreferences> {
  try {
    const preferences = await DBClient.select()
      .from(userPreference)
      .where(eq(userPreference.userId, userId))
      .limit(1);

    if (preferences.length === 0) {
      // 設定が存在しない場合はデフォルト値を返す
      return defaultUserPreferences;
    }

    const pref = preferences[0];
    return {
      theme: pref.theme,
      showWinthroughPopup: pref.showWinthroughPopup,
      showBoardHeader: pref.showBoardHeader,
      showQn: pref.showQn,
      showSignString: pref.showSignString,
      reversePlayerInfo: pref.reversePlayerInfo,
      wrongNumber: pref.wrongNumber,
      webhookUrl: pref.webhookUrl,
    };
  } catch (error) {
    console.error("Failed to get user preferences:", error);
    return defaultUserPreferences;
  }
}
