import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

import { user } from "./auth";

// ゲーム形式のenum（SQLiteではtextで代用）
const gameRuleValues = [
  "normal",
  "nomx",
  "nomx-ad",
  "ny",
  "nomr",
  "nbyn",
  "nupdown",
  "divide",
  "swedish10",
  "backstream",
  "attacksurvival",
  "squarex",
  "z",
  "freezex",
  "endless-chance",
  "variables",
  "aql",
  "linear",
] as const;

// ゲームテーブル
export const game = sqliteTable("game", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  ruleType: text("rule_type", { enum: gameRuleValues }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  lastAccessedAt: integer("last_accessed_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  discordWebhookUrl: text("discord_webhook_url"),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
});

// ゲームテーブルのユーザーごとのインデックス
export const gameUserIdIdx = index("idx_game_user_id").on(game.userId);

// ゲームテーブルの形式ごとのインデックス
export const gameRuleTypeIdx = index("idx_game_rule_type").on(game.ruleType);

// タグテーブル
export const tag = sqliteTable("tag", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
});

export const tagNameIdx = index("idx_tag_name").on(tag.name);

// ゲームとタグの中間
export const gameTag = sqliteTable("game_tag", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id").references(() => game.id, { onDelete: "cascade" }),
  tagId: text("tag_id").references(() => tag.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
});

// プレイヤーテーブル
export const player = sqliteTable("player", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  affiliation: text("affiliation"),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
});

export const playerNameIdx = index("idx_player_name").on(player.name);

// プレイヤータグ
export const playerTag = sqliteTable("player_tag", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  playerId: text("player_id").references(() => player.id, {
    onDelete: "cascade",
  }),
  tagName: text("tag_name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
});

// プレイヤーとプレイヤータグの中間テーブル
export const playerPlayerTag = sqliteTable("player_player_tag", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  playerId: text("player_id").references(() => player.id, {
    onDelete: "cascade",
  }),
  playerTagId: text("player_tag_id").references(() => playerTag.id, {
    onDelete: "cascade",
  }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

// ゲーム参加プレイヤーテーブル
export const gamePlayer = sqliteTable("game_player", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id").references(() => game.id, { onDelete: "cascade" }),
  playerId: text("player_id").references(() => player.id),
  displayOrder: integer("display_order").notNull(),
  initialScore: integer("initial_score").default(0),
  initialCorrectCount: integer("initial_correct_count").default(0),
  initialWrongCount: integer("initial_wrong_count").default(0),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

const actionTypeValues = [
  "correct",
  "wrong",
  "through",
  "mutiple_correct",
  "multiple_wrong",
  "skip",
  "blank",
] as const;

// ゲーム操作ログテーブル
export const gameLog = sqliteTable("game_log", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id").references(() => game.id, { onDelete: "cascade" }),
  playerId: text("player_id").references(() => player.id),
  questionNumber: integer("question_number"),
  actionType: text("action_type", { enum: actionTypeValues }).notNull(),
  scoreChange: integer("score_change").default(0),
  timestamp: integer("timestamp", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  isSystemAction: integer("is_system_action", { mode: "boolean" }).default(
    false
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
});

export const gameLogGamePlayerIdx = index("idx_game_log_game_player").on(
  gameLog.gameId,
  gameLog.playerId
);
export const gameLogTimestampIdx = index("idx_game_log_timestamp").on(
  gameLog.timestamp
);
