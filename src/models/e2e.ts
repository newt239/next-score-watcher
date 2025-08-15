import { z } from "zod";

/**
 * テスト用ログインリクエストスキーマ
 */
export const TestLoginRequestSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上である必要があります"),
});

/**
 * テスト用ログインレスポンス型
 */
export type TestLoginResponseType = {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
  };
  token: string;
};
