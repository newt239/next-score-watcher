import { z } from "zod";

/**
 * ユーザー設定の型定義
 */
export type UserPreferencesType = {
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
export const defaultUserPreferences: UserPreferencesType = {
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
 * ユーザー設定更新リクエストの型
 */
export type UpdateUserPreferencesRequestType = Partial<UserPreferencesType>;

/**
 * ユーザーIDパラメータのスキーマ
 */
export const UserIdParamSchema = z.object({
  user_id: z.string(),
});

/**
 * ユーザー設定更新リクエストのスキーマ
 */
export const UpdateUserPreferencesRequestSchema = z.object({
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
export type UserIdParamType = z.infer<typeof UserIdParamSchema>;

/**
 * ユーザー設定取得レスポンスの型
 */
export type GetUserPreferencesResponseType = UserPreferencesType;

/**
 * ユーザー設定更新レスポンスの型
 */
export type UpdateUserPreferencesResponseType = {
  message: string;
};
