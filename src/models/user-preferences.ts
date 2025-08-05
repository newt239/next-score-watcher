import { z } from "zod";

/**
 * ユーザー設定の型定義
 */
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
 * デフォルトユーザー設定
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
 * ユーザー設定更新用の型
 */
export type UserPreferencesUpdateInput = Partial<UserPreferences>;

/**
 * ユーザーIDパラメータのスキーマ
 */
export const UserIdParamSchema = z.object({
  user_id: z.string(),
});

/**
 * ユーザー設定更新時のスキーマ
 */
export const UpdateUserPreferencesSchema = z.object({
  theme: z.enum(["light", "dark"]).optional(),
  showWinthroughPopup: z.boolean().optional(),
  showBoardHeader: z.boolean().optional(),
  showQn: z.boolean().optional(),
  showSignString: z.boolean().optional(),
  reversePlayerInfo: z.boolean().optional(),
  wrongNumber: z.boolean().optional(),
  webhookUrl: z.string().nullable().optional(),
});

/**
 * ユーザーIDパラメータの型
 */
export type UserIdParam = z.infer<typeof UserIdParamSchema>;

/**
 * ユーザー設定更新データの型
 */
export type UpdateUserPreferencesData = z.infer<
  typeof UpdateUserPreferencesSchema
>;
