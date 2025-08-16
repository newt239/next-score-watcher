import { z } from "zod";

import { type SeriarizedGameLog, type TypedGame } from "@/utils/drizzle/types";

/**
 * ルール名の型定義
 */
export type RuleNames =
  | "normal"
  | "nomx"
  | "nomx-ad"
  | "ny"
  | "nomr"
  | "nbyn"
  | "nupdown"
  | "divide"
  | "swedish10"
  | "backstream"
  | "attacksurvival"
  | "squarex"
  | "z"
  | "freezex"
  | "endless-chance"
  | "variables"
  | "aql";

/**
 * 操作の種類の型定義
 */
export type Variants =
  | "correct"
  | "wrong"
  | "through"
  | "mutiple_correct"
  | "multiple_wrong"
  | "skip"
  | "blank";

/**
 * オンライン版での GameProps 型（ローカル版の GamePropsUnion に相当）
 */
export type OnlineGameProps = {
  id: string;
  name: string;
  rule: RuleNames;
  discord_webhook_url: string;
  correct_me: number;
  wrong_me: number;
  options?: {
    left_team?: string;
    right_team?: string;
  };
  editable: boolean;
  last_open: string;
};

/**
 * オンライン版でのプレイヤーDB型（ローカル版の PlayerDBProps に相当）
 */
export type OnlinePlayerDBProps = {
  id: string;
  name: string;
  text: string;
  belong: string;
  tags: string[];
};

/**
 * プレイヤーの状態の型定義
 */
export type States = "win" | "lose" | "playing";

/**
 * 計算されたスコアの型定義
 */
export type ComputedScoreProps = {
  game_id: string;
  player_id: string;
  state: States;
  reach_state: States;
  score: number;
  correct: number; // 正解数
  wrong: number; // 誤答数
  last_correct: number; // 最後に正解した問題番号
  last_wrong: number; // 最後に誤答した問題番号
  odd_score: number; // 奇数問目のスコア
  even_score: number; // 偶数問目のスコア
  stage: number;
  is_incapacity: boolean;
  order: number; // プレイヤー同士の評価順
  text: string; // 画面上に表示するための文字
};

/**
 * オンライン版でのログDB型（ローカル版の LogDBProps に相当）
 */
export type LogDBProps = {
  id: string;
  game_id: string;
  player_id: string;
  variant: Variants;
  system: 0 | 1;
  timestamp: string;
  available: 0 | 1;
};

export type PlayerProps = {
  id: string;
  name: string;
  description: string;
  affiliation: string;
  tags: string[];
};

export type GamePlayerProps = {
  id: string;
  name: string;
  description: string;
  affiliation: string;
  displayOrder: number;
  initialScore: number | null;
  initialCorrectCount: number | null;
  initialWrongCount: number | null;
};

/**
 * ゲーム詳細取得のレスポンスの型
 */
export type GetGameDetailResponseType = TypedGame & {
  players: GamePlayerProps[];
  logs: SeriarizedGameLog[];
};

/**
 * ゲーム作成の基本スキーマ
 */
export const CreateGameSchema = z.object({
  name: z.string().min(1),
  ruleType: z.string() as z.ZodSchema<RuleNames>,
  discordWebhookUrl: z.string().optional(),
  option: z.unknown().optional(),
});

/**
 * 既存ゲームからプレイヤーをコピーするリクエストスキーマ
 */
export const CopyPlayersFromGameRequestSchema = z.object({
  sourceGameId: z.string().min(1),
});

/**
 * 既存ゲームからプレイヤーをコピーするリクエスト型
 */
export type CopyPlayersFromGameRequestType = z.infer<
  typeof CopyPlayersFromGameRequestSchema
>;

/**
 * ゲーム作成リクエストのスキーマ
 */
export const CreateGameRequestSchema = z
  .array(CreateGameSchema)
  .min(1, "最低1つのゲームが必要です");

/**
 * プレイヤー設定更新のスキーマ
 */
export const UpdateGamePlayerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  displayOrder: z.number().int().min(0),
  initialScore: z.number().int().default(0),
  initialCorrectCount: z.number().int().default(0),
  initialWrongCount: z.number().int().default(0),
});

/**
 * ゲームプレイヤー更新リクエストのパラメータスキーマ
 */
export const UpdateGamePlayerRequestParamSchema = z.object({
  gamePlayerId: z.string().min(1),
});

/**
 * ゲームプレイヤー更新リクエストのjsonスキーマ
 */
export const UpdateGamePlayerRequestJsonSchema = z.union([
  z.object({
    key: z.literal("displayOrder"),
    value: z.number().int().min(0),
  }),
  z.object({
    key: z.literal("initialScore"),
    value: z.number().int(),
  }),
  z.object({
    key: z.literal("initialCorrectCount"),
    value: z.number().int().min(0),
  }),
  z.object({
    key: z.literal("initialWrongCount"),
    value: z.number().int().min(0),
  }),
]);

/**
 * ゲームプレイヤー一括更新リクエストのパラメータスキーマ
 */
export const UpdateGamePlayersRequestParamSchema = z.object({
  gameId: z.string().min(1),
});

/**
 * ゲームプレイヤー一括更新リクエストのjsonスキーマ
 */
export const UpdateGamePlayersRequestJsonSchema = z.object({
  players: z.array(UpdateGamePlayerSchema),
});

/**
 * クイズ設定更新のスキーマ
 */
export const UpdateGameQuizSchema = z.object({
  setName: z.string().optional(),
  offset: z.number().int().min(0).default(0),
});

/**
 * ゲーム更新リクエストのスキーマ
 */
export const UpdateGameRequestParamSchema = z.object({
  gameId: z.string().min(1),
});

/**
 * ゲーム更新リクエストのjsonスキーマ
 */
export const UpdateGameRequestJsonSchema = z.union([
  z.object({
    key: z.union([z.literal("name"), z.literal("discordWebhookUrl")]),
    value: z.string(),
  }),
  z.object({
    key: z.literal("option"),
    value: z.record(z.string(), z.union([z.boolean(), z.number(), z.string()])),
  }),
  z.object({
    key: z.literal("isPublic"),
    value: z.boolean(),
  }),
]);

/**
 * ゲーム削除リクエストのスキーマ
 */
export const DeleteGameRequestParamSchema = z.object({
  gameId: z.string().min(1),
});

/**
 * ゲームにプレイヤー追加リクエストのスキーマ
 */
export const AddPlayerToGameRequestSchema = z.object({
  playerId: z.string().min(1),
  displayOrder: z.number().int().min(0),
  initialScore: z.number().int().default(0).optional(),
  initialCorrectCount: z.number().int().default(0).optional(),
  initialWrongCount: z.number().int().default(0).optional(),
});

/**
 * ゲームプレイヤー削除リクエストのスキーマ
 */
export const RemoveGamePlayersRequestParamSchema = z.object({
  gameId: z.string().min(1),
});

/**
 * ゲームプレイヤー削除リクエストのJSONスキーマ
 */
export const RemoveGamePlayersRequestJsonSchema = z.object({
  playerIds: z
    .array(z.string().min(1))
    .min(1, "削除するプレイヤーIDが必要です"),
});

/**
 * ゲームログ追加リクエストのスキーマ
 */
export const AddGameLogRequestSchema = z.object({
  gameId: z.string().min(1),
  playerId: z.string().min(1),
  questionNumber: z.number().int().optional(),
  actionType: z.string() as z.ZodSchema<Variants>,
  scoreChange: z.number().int().default(0),
  isSystemAction: z.boolean().default(false),
});

/**
 * ゲーム数取得リクエストのスキーマ
 */
export const GetGameCountsRequestSchema = z.object({
  gameIds: z
    .array(z.string().min(1, "Game ID cannot be empty"))
    .min(0, "Game IDs array is required"),
});

/**
 * ゲーム作成の基本型
 */
export type CreateGameType = z.infer<typeof CreateGameSchema>;

/**
 * ゲーム作成リクエストの型
 */
export type CreateGameRequestType = z.infer<typeof CreateGameRequestSchema>;

/**
 * プレイヤー設定更新の型
 */
export type UpdateGamePlayerType = z.infer<typeof UpdateGamePlayerSchema>;

/**
 * クイズ設定更新の型
 */
export type UpdateGameQuizType = z.infer<typeof UpdateGameQuizSchema>;

/**
 * ゲーム更新リクエストの型
 */
export type UpdateGameRequestJsonType = z.infer<
  typeof UpdateGameRequestJsonSchema
>;

/**
 * ゲームプレイヤー更新リクエストのパラメータ型
 */
export type UpdateGamePlayerRequestParamType = z.infer<
  typeof UpdateGamePlayerRequestParamSchema
>;

/**
 * ゲームプレイヤー更新リクエストのjson型
 */
export type UpdateGamePlayerRequestJsonType = z.infer<
  typeof UpdateGamePlayerRequestJsonSchema
>;

/**
 * ゲームプレイヤー一括更新リクエストのパラメータ型
 */
export type UpdateGamePlayersRequestParamType = z.infer<
  typeof UpdateGamePlayersRequestParamSchema
>;

/**
 * ゲームプレイヤー一括更新リクエストのjson型
 */
export type UpdateGamePlayersRequestJsonType = z.infer<
  typeof UpdateGamePlayersRequestJsonSchema
>;

/**
 * ゲーム削除リクエストの型
 */
export type DeleteGameRequestParamType = z.infer<
  typeof DeleteGameRequestParamSchema
>;

/**
 * ゲームにプレイヤー追加リクエストの型
 */
export type AddPlayerToGameRequestType = z.infer<
  typeof AddPlayerToGameRequestSchema
>;

/**
 * ゲームプレイヤー削除リクエストのパラメータ型
 */
export type RemoveGamePlayersRequestParamType = z.infer<
  typeof RemoveGamePlayersRequestParamSchema
>;

/**
 * ゲームプレイヤー削除リクエストのJSON型
 */
export type RemoveGamePlayersRequestJsonType = z.infer<
  typeof RemoveGamePlayersRequestJsonSchema
>;

/**
 * ゲームログ追加リクエストの型
 */
export type AddGameLogRequestType = z.infer<typeof AddGameLogRequestSchema>;

/**
 * ゲーム数取得リクエストの型
 */
export type GetGameCountsRequestType = z.infer<
  typeof GetGameCountsRequestSchema
>;

/**
 * ゲーム作成レスポンスの型
 */
export type CreateGameResponseType = {
  ids: string[];
  createdCount: number;
  message: string;
};

/**
 * ゲーム更新レスポンスの型
 */
export type UpdateGameResponseType = {
  updatedCount: number;
  message: string;
};

/**
 * ゲーム削除レスポンスの型
 */
export type DeleteGameResponseType = {
  deletedCount: number;
  message: string;
};

/**
 * ゲーム設定取得レスポンスのスキーマ
 */
export const GetGameSettingsResponseSchema = z.object({
  name: z.string(),
  discordWebhookUrl: z.string().nullable().optional(),
  winPoint: z.number().int().optional(),
  losePoint: z.number().int().optional(),
  targetPoint: z.number().int().optional(),
  restCount: z.number().int().optional(),
  basePoint: z.number().int().optional(),
  initialPoint: z.number().int().optional(),
  loseThreshold: z.number().int().optional(),
  attackPoint: z.number().int().optional(),
  squareSize: z.number().int().optional(),
  winCondition: z.number().int().optional(),
  zonePoint: z.number().int().optional(),
  freezePoint: z.number().int().optional(),
  loseCount: z.number().int().optional(),
  useR: z.boolean().optional(),
  streakOver3: z.boolean().optional(),
  leftTeam: z.string().optional(),
  rightTeam: z.string().optional(),
});

/**
 * ゲーム設定更新リクエストのスキーマ
 */
export const UpdateGameSettingsRequestSchema = z.union([
  z.object({
    name: z.string().min(1),
  }),
  z.object({
    discordWebhookUrl: z.string(),
  }),
]);

/**
 * ゲーム設定取得レスポンスの型
 */
export type GetGameSettingsResponseType = z.infer<
  typeof GetGameSettingsResponseSchema
>;

/**
 * ゲーム設定更新リクエストの型
 */
export type UpdateGameSettingsRequestType = z.infer<
  typeof UpdateGameSettingsRequestSchema
>;

/**
 * ゲーム設定更新レスポンスの型
 */
export type UpdateGameSettingsResponseType = {
  updated: boolean;
  message: string;
};

/**
 * ゲームオプション更新リクエストのスキーマ
 */
export const UpdateGameOptionsRequestParamSchema = z.object({
  gameId: z.string().min(1),
});

/**
 * ゲームオプション更新リクエストのjsonスキーマ
 */
export const UpdateGameOptionsRequestJsonSchema = z.object({
  key: z.string().min(1),
  value: z.union([z.number(), z.string(), z.boolean()]),
});

/**
 * ゲームオプション更新リクエストの型
 */
export type UpdateGameOptionsRequestParamType = z.infer<
  typeof UpdateGameOptionsRequestParamSchema
>;

/**
 * ゲームオプション更新リクエストのjson型
 */
export type UpdateGameOptionsRequestJsonType = z.infer<
  typeof UpdateGameOptionsRequestJsonSchema
>;

/**
 * ゲームオプション更新レスポンスの型
 */
export type UpdateGameOptionsResponseType = {
  updated: boolean;
  message: string;
};

/**
 * プレイヤー一括更新レスポンスの型
 */
export type UpdateGamePlayersResponseType = {
  updated: boolean;
  updatedCount: number;
  message: string;
};

/**
 * ゲームプレイヤー削除レスポンスの型
 */
export type RemoveGamePlayersResponseType = {
  removed: boolean;
  deletedCount: number;
  message: string;
};

/**
 * ゲームプレイヤー更新レスポンスの型
 */
export type UpdateGamePlayerResponseType = {
  updated: boolean;
  message: string;
};

/**
 * クイズ設定更新レスポンスの型
 */
export type UpdateGameQuizResponseType = {
  updated: boolean;
  message: string;
};

/**
 * 既存ゲームからプレイヤーコピーレスポンスの型
 */
export type CopyPlayersFromGameResponseType = {
  copied: boolean;
  copiedCount: number;
  message: string;
};

/**
 * オンラインゲーム情報の型（API専用）
 */
export type OnlineGameType = {
  id: string;
  name: string;
  ruleType: RuleNames;
  createdAt?: string;
  updatedAt?: string;
  discordWebhookUrl?: string | null;
  isPublic?: boolean;
};

/**
 * APIレスポンス用のプレイヤー型（変換前）
 */
export type ApiPlayerResponseType = {
  id: string;
  name: string;
  initialCorrectCount?: number;
  initialWrongCount?: number;
  displayOrder?: number;
  initialScore?: number;
};

/**
 * オンラインゲームプレイヤー情報の型（API専用）
 */
export type OnlineGamePlayerType = {
  id: string;
  name: string;
  displayOrder: number;
  initialScore: number;
  initialCorrectCount: number;
  initialWrongCount: number;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * オンラインゲーム実行時のプレイヤー型（ローカルDBのGameDBPlayerPropsと同等）
 */
export type OnlineGameExecutionPlayerType = {
  id: string;
  name: string;
  initial_correct: number;
  initial_wrong: number;
  base_correct_point: number;
  base_wrong_point: number;
};

/**
 * オンラインゲームログ情報の型（API専用）
 */
export type OnlineGameLogType = {
  id: number | string;
  player_id: string;
  variant: Variants;
  system: number;
  available: number;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * オンラインユーザー情報の型（API専用）
 */
export type OnlineUserType = {
  id: string;
  name: string;
  email: string;
};

/**
 * Viewer用ボードデータ取得パラメータスキーマ
 */
export const GetViewerBoardDataParamSchema = z.object({
  gameId: z.string().min(1),
});

/**
 * Viewer用ボードデータ取得パラメータ型
 */
export type GetViewerBoardDataParamType = z.infer<
  typeof GetViewerBoardDataParamSchema
>;

/**
 * Viewer用ボードデータレスポンス型
 */
export type GetViewerBoardDataResponseType = {
  game: {
    id: string;
    name: string;
    ruleType: RuleNames;
    isPublic: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  players: ComputedScoreProps[];
  logs: OnlineGameLogType[];
};
