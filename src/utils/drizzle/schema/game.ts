import { relations, sql } from "drizzle-orm";
import { blob, index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

import { user } from "./auth";

export const gameRuleValues = [
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
] as const;

export type RuleNames = (typeof gameRuleValues)[number];

// ゲームテーブル
export const game = sqliteTable("game", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  ruleType: text("rule_type", { enum: gameRuleValues }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  discordWebhookUrl: text("discord_webhook_url"),
  option: blob("options", { mode: "json" }),
  isPublic: integer("is_public", { mode: "boolean" }).default(false).notNull(),
  userId: text("user_id").references(() => user.id),
});

// ゲームテーブルのユーザーごとのインデックス
export const gameUserIdIdx = index("idx_game_user_id").on(game.userId);

// ゲームテーブルの形式ごとのインデックス
export const gameRuleTypeIdx = index("idx_game_rule_type").on(game.ruleType);

// ゲームテーブルの公開状態のインデックス
export const gameIsPublicIdx = index("idx_game_is_public").on(game.isPublic);

// タグテーブル
export const tag = sqliteTable("tag", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
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
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
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
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
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
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
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
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gamePlayerGameIdIdx = index("idx_game_player_game_id").on(gamePlayer.gameId);

export const gamePlayerGameIdPlayerIdIdx = index("idx_game_player_game_id_player_id").on(
  gamePlayer.gameId,
  gamePlayer.playerId
);

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
  timestamp: integer("timestamp", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  isSystemAction: integer("is_system_action", { mode: "boolean" }).default(false),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  userId: text("user_id").references(() => user.id),
});

export const gameLogGameIdIdx = index("idx_game_log_game_id").on(gameLog.gameId);

export const gameLogTimestampIdx = index("idx_game_log_timestamp").on(gameLog.timestamp);

// game のリレーション
export const gameRelations = relations(game, ({ one, many }) => ({
  user: one(user, {
    fields: [game.userId],
    references: [user.id],
  }),
  gameLog: many(gameLog),
  gamePlayer: many(gamePlayer),
  gameTag: many(gameTag), // 中間テーブル（タグは gameTag 経由で辿れます）
}));

// tag のリレーション
export const tagRelations = relations(tag, ({ one, many }) => ({
  user: one(user, {
    fields: [tag.userId],
    references: [user.id],
  }),
  gameTag: many(gameTag),
}));

// game_tag（中間）のリレーション
export const gameTagRelations = relations(gameTag, ({ one }) => ({
  game: one(game, {
    fields: [gameTag.gameId],
    references: [game.id],
  }),
  tag: one(tag, {
    fields: [gameTag.tagId],
    references: [tag.id],
  }),
  user: one(user, {
    fields: [gameTag.userId],
    references: [user.id],
  }),
}));

// player のリレーション
export const playerRelations = relations(player, ({ one, many }) => ({
  user: one(user, {
    fields: [player.userId],
    references: [user.id],
  }),
  gamePlayer: many(gamePlayer),
  gameLog: many(gameLog),
  playerPlayerTag: many(playerPlayerTag), // プレイヤー⇔プレイヤータグの中間
}));

// player_tag のリレーション
export const playerTagRelations = relations(playerTag, ({ one, many }) => ({
  user: one(user, {
    fields: [playerTag.userId],
    references: [user.id],
  }),
  playerPlayerTag: many(playerPlayerTag),
}));

// player_player_tag（中間）のリレーション
export const playerPlayerTagRelations = relations(playerPlayerTag, ({ one }) => ({
  player: one(player, {
    fields: [playerPlayerTag.playerId],
    references: [player.id],
  }),
  playerTag: one(playerTag, {
    fields: [playerPlayerTag.playerTagId],
    references: [playerTag.id],
  }),
}));

// game_player のリレーション
export const gamePlayerRelations = relations(gamePlayer, ({ one }) => ({
  game: one(game, {
    fields: [gamePlayer.gameId],
    references: [game.id],
  }),
  player: one(player, {
    fields: [gamePlayer.playerId],
    references: [player.id],
  }),
  user: one(user, {
    fields: [gamePlayer.userId],
    references: [user.id],
  }),
}));

// game_log のリレーション
export const gameLogRelations = relations(gameLog, ({ one }) => ({
  game: one(game, {
    fields: [gameLog.gameId],
    references: [game.id],
  }),
  player: one(player, {
    fields: [gameLog.playerId],
    references: [player.id],
  }),
  user: one(user, {
    fields: [gameLog.userId],
    references: [user.id],
  }),
}));
