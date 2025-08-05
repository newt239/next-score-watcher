import { z } from "zod";

/**
 * プレイヤー作成時のスキーマ
 */
export const CreatePlayerSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  displayName: z.string().min(1, "表示名は必須です"),
  affiliation: z.string().optional(),
  description: z.string().optional(),
});

/**
 * プレイヤー作成データの型
 */
export type CreatePlayerData = z.infer<typeof CreatePlayerSchema>;

/**
 * プレイヤー更新時のスキーマ
 */
export const UpdatePlayerSchema = z.object({
  name: z.string().min(1, "名前は必須です").optional(),
  displayName: z.string().min(1, "表示名は必須です").optional(),
  affiliation: z.string().optional(),
  description: z.string().optional(),
});

/**
 * プレイヤー更新データの型
 */
export type UpdatePlayerData = z.infer<typeof UpdatePlayerSchema>;

/**
 * プレイヤー取得レスポンスの型
 */
export type PlayerResponse = {
  id: string;
  name: string;
  text: string; // displayName
  belong: string; // affiliation
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

/**
 * プレイヤー一覧取得クエリパラメータのスキーマ
 */
export const GetPlayersQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

/**
 * プレイヤー一覧取得クエリパラメータの型
 */
export type GetPlayersQuery = z.infer<typeof GetPlayersQuerySchema>;

/**
 * API レスポンス内のプレイヤーデータの型（APIから返される生の型）
 */
export type ApiPlayerData = {
  id: string;
  name: string;
  text: string;
  belong: string;
  tags: string[] | never[];
  createdAt?: string;
  updatedAt?: string;
};

/**
 * プレイヤー一覧取得APIレスポンスの型
 */
export type ApiPlayersListResponse = {
  players: ApiPlayerData[];
  total: number;
};

/**
 * プレイヤー一覧取得レスポンスの型
 */
export type PlayersListResponse = {
  players: PlayerResponse[];
  total: number;
};
