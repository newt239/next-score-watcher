import { z } from "zod";

/**
 * プレイヤー作成リクエストのスキーマ
 */
export const CreatePlayerRequestSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  displayName: z.string().min(1, "表示名は必須です"),
  affiliation: z.string().optional(),
  description: z.string().optional(),
});

/**
 * プレイヤー作成リクエストの型
 */
export type CreatePlayerRequestType = z.infer<typeof CreatePlayerRequestSchema>;

/**
 * プレイヤー更新リクエストのスキーマ
 */
export const UpdatePlayerRequestSchema = z.object({
  name: z.string().min(1, "名前は必須です").optional(),
  displayName: z.string().min(1, "表示名は必須です").optional(),
  affiliation: z.string().optional(),
  description: z.string().optional(),
});

/**
 * プレイヤー更新リクエストの型
 */
export type UpdatePlayerRequestType = z.infer<typeof UpdatePlayerRequestSchema>;

/**
 * プレイヤー詳細レスポンスの型
 */
export type PlayerDetailResponseType = {
  id: string;
  name: string;
  text: string; // displayName
  belong: string; // affiliation
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

/**
 * プレイヤー一覧取得リクエストのクエリパラメータスキーマ
 */
export const GetPlayersListRequestSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

/**
 * プレイヤー一覧取得リクエストのクエリパラメータ型
 */
export type GetPlayersListRequestType = z.infer<
  typeof GetPlayersListRequestSchema
>;

/**
 * API レスポンス内のプレイヤーデータの型（APIから返される生の型）
 */
export type ApiPlayerDataType = {
  id: string;
  name: string;
  text: string;
  belong: string;
  tags: string[] | never[];
  createdAt?: string;
  updatedAt?: string;
};

/**
 * プレイヤー一覧取得レスポンスの型
 */
export type GetPlayersListResponseType = {
  players: ApiPlayerDataType[];
  total: number;
};

/**
 * プレイヤー作成レスポンスの型
 */
export type CreatePlayerResponseType = {
  id: string;
  message: string;
};

/**
 * プレイヤー更新レスポンスの型
 */
export type UpdatePlayerResponseType = {
  message: string;
};

/**
 * プレイヤー削除レスポンスの型
 */
export type DeletePlayerResponseType = {
  message: string;
};

/**
 * プレイヤータグ追加リクエストのスキーマ
 */
export const AddPlayerTagRequestSchema = z.object({
  tagName: z.string().min(1, "タグ名は必須です"),
});

/**
 * プレイヤータグ追加リクエストの型
 */
export type AddPlayerTagRequestType = z.infer<typeof AddPlayerTagRequestSchema>;

/**
 * プレイヤータグ削除リクエストのスキーマ
 */
export const RemovePlayerTagRequestSchema = z.object({
  tagName: z.string().min(1, "タグ名は必須です"),
});

/**
 * プレイヤータグ削除リクエストの型
 */
export type RemovePlayerTagRequestType = z.infer<
  typeof RemovePlayerTagRequestSchema
>;

/**
 * プレイヤータグ操作レスポンスの型
 */
export type PlayerTagResponseType = {
  message: string;
};
