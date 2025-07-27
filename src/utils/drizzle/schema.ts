import {
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

// ユーザーテーブル
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// セッションテーブル
export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

// アカウントテーブル（OAuth用）
export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// 認証用検証テーブル
export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

// ユーザー環境設定テーブル
export const userPreference = sqliteTable("user_preference", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  theme: text("theme").notNull().default("light"),
});

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
  id: text("id").primaryKey(),
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
  id: text("id").primaryKey(),
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
  id: text("id").primaryKey(),
  gameId: text("game_id").references(() => game.id, { onDelete: "cascade" }),
  tagId: text("tag_id").references(() => tag.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
});

// プレイヤーテーブル
export const player = sqliteTable("player", {
  id: text("id").primaryKey(),
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
  id: text("id").primaryKey(),
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
  id: text("id").primaryKey(),
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
  id: text("id").primaryKey(),
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
  id: text("id").primaryKey(),
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

// クイズセットテーブル
export const quizSet = sqliteTable("quiz_set", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  totalQuestions: integer("total_questions").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
});

// クイズ問題テーブル
export const quizQuestion = sqliteTable("quiz_question", {
  id: text("id").primaryKey(),
  quizSetId: text("quiz_set_id").references(() => quizSet.id, {
    onDelete: "cascade",
  }),
  questionNumber: integer("question_number").notNull(),
  questionText: text("question_text").notNull(),
  answerText: text("answer_text").notNull(),
  category: text("category"),
  difficultyLevel: integer("difficulty_level"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
});

export const quizQuestionUniqueIdx = unique().on(
  quizQuestion.quizSetId,
  quizQuestion.questionNumber
);

// ゲーム形式別設定テーブル
export const gameNomxSetting = sqliteTable("game_nomx_setting", {
  gameId: text("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(7),
  losePoint: integer("lose_point").notNull().default(3),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameNomxAdSetting = sqliteTable("game_nomx_ad_setting", {
  gameId: text("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(7),
  losePoint: integer("lose_point").notNull().default(3),
  streakOver3: integer("streak_over3", { mode: "boolean" })
    .notNull()
    .default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameNySetting = sqliteTable("game_ny_setting", {
  gameId: text("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  targetPoint: integer("target_point").notNull().default(10),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameNomrSetting = sqliteTable("game_nomr_setting", {
  gameId: text("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(7),
  restCount: integer("rest_count").notNull().default(3),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameNbynSetting = sqliteTable("game_nbyn_setting", {
  gameId: text("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  nValue: integer("n_value").notNull().default(5),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameNupdownSetting = sqliteTable("game_nupdown_setting", {
  gameId: text("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(5),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameDivideSetting = sqliteTable("game_divide_setting", {
  gameId: text("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(100),
  basePoint: integer("base_point").notNull().default(10),
  initialPoint: integer("initial_point").notNull().default(10),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameSwedish10Setting = sqliteTable("game_swedish10_setting", {
  gameId: text("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(10),
  losePoint: integer("lose_point").notNull().default(10),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameBackstreamSetting = sqliteTable("game_backstream_setting", {
  gameId: text("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  initialPoint: integer("initial_point").notNull().default(10),
  winPoint: integer("win_point").notNull().default(20),
  loseThreshold: integer("lose_threshold").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameAttacksurvivalSetting = sqliteTable(
  "game_attacksurvival_setting",
  {
    gameId: text("game_id")
      .primaryKey()
      .references(() => game.id, { onDelete: "cascade" }),
    winPoint: integer("win_point").notNull().default(5),
    losePoint: integer("lose_point").notNull().default(3),
    attackPoint: integer("attack_point").notNull().default(3),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
      () => new Date()
    ),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
      () => new Date()
    ),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
  }
);

export const gameSquarexSetting = sqliteTable("game_squarex_setting", {
  gameId: text("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  squareSize: integer("square_size").notNull().default(3),
  winCondition: integer("win_condition").notNull().default(3),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameZSetting = sqliteTable("game_z_setting", {
  gameId: text("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(5),
  zonePoint: integer("zone_point").notNull().default(3),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameFreezexSetting = sqliteTable("game_freezex_setting", {
  gameId: text("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(5),
  freezePoint: integer("freeze_point").notNull().default(3),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameEndlessChanceSetting = sqliteTable(
  "game_endless_chance_setting",
  {
    gameId: text("game_id")
      .primaryKey()
      .references(() => game.id, { onDelete: "cascade" }),
    loseCount: integer("lose_count").notNull().default(3),
    useR: integer("use_r", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
      () => new Date()
    ),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
      () => new Date()
    ),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
  }
);

export const gameVariablesSetting = sqliteTable("game_variables_setting", {
  gameId: text("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(10),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameAqlSetting = sqliteTable("game_aql_setting", {
  gameId: text("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  leftTeam: text("left_team").notNull(),
  rightTeam: text("right_team").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});
