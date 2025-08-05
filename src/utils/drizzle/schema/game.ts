import { sql } from "drizzle-orm";
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
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  discordWebhookUrl: text("discord_webhook_url"),
  userId: text("user_id").references(() => user.id),
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
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  userId: text("user_id").references(() => user.id),
});

export const tagNameIdx = index("idx_tag_name").on(tag.name);

// ゲームとタグの中間
export const gameTag = sqliteTable("game_tag", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id").references(() => game.id),
  tagId: text("tag_id").references(() => tag.id),
  userId: text("user_id").references(() => user.id),
});

export const gameTagGameIdTagIdIdx = index("idx_game_tag_game_id_tag_id").on(
  gameTag.gameId,
  gameTag.tagId
);

// プレイヤーテーブル
export const player = sqliteTable("player", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  affiliation: text("affiliation"),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  userId: text("user_id").references(() => user.id),
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
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  userId: text("user_id").references(() => user.id),
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
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const playerPlayerTagPlayerIdTagNameIdx = index(
  "idx_player_player_tag_player_id_tag_name"
).on(playerPlayerTag.playerId, playerPlayerTag.playerTagId);

// ゲーム参加プレイヤーテーブル
export const gamePlayer = sqliteTable("game_player", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id").references(() => game.id),
  playerId: text("player_id").references(() => player.id),
  displayOrder: integer("display_order").notNull(),
  initialScore: integer("initial_score").default(0),
  initialCorrectCount: integer("initial_correct_count").default(0),
  initialWrongCount: integer("initial_wrong_count").default(0),
  userId: text("user_id").references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gamePlayerGameIdIdx = index("idx_game_player_game_id").on(
  gamePlayer.gameId
);

export const gamePlayerGameIdPlayerIdIdx = index(
  "idx_game_player_game_id_player_id"
).on(gamePlayer.gameId, gamePlayer.playerId);

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
  gameId: text("game_id").references(() => game.id),
  playerId: text("player_id").references(() => player.id),
  questionNumber: integer("question_number"),
  actionType: text("action_type", { enum: actionTypeValues }).notNull(),
  scoreChange: integer("score_change").default(0),
  timestamp: integer("timestamp", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  isSystemAction: integer("is_system_action", { mode: "boolean" }).default(
    false
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  userId: text("user_id").references(() => user.id),
});

export const gameLogGameIdIdx = index("idx_game_log_game_id").on(
  gameLog.gameId
);

export const gameLogTimestampIdx = index("idx_game_log_timestamp").on(
  gameLog.timestamp
);
