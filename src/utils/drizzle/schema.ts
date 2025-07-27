import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  unique,
  index,
} from "drizzle-orm/pg-core";

// プロファイル管理テーブル
export const profile = pgTable("profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// プレイヤーマスター
export const player = pgTable("player", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 255 }),
  affiliation: varchar("affiliation", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  profileId: uuid("profile_id").references(() => profile.id),
});

export const playerNameIdx = index("idx_player_name").on(player.name);
export const playerProfileIdx = index("idx_player_profile").on(
  player.profileId
);

// プレイヤータグ
export const playerTag = pgTable("player_tag", {
  id: uuid("id").primaryKey().defaultRandom(),
  playerId: uuid("player_id").references(() => player.id, {
    onDelete: "cascade",
  }),
  tagName: varchar("tag_name", { length: 100 }).notNull(),
});

export const playerTagUniqueIdx = unique().on(
  playerTag.playerId,
  playerTag.tagName
);

// ゲーム基本情報
export const game = pgTable("game", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  ruleType: varchar("rule_type", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  isArchived: boolean("is_archived").default(false),
  discordWebhookUrl: text("discord_webhook_url"),
  profileId: uuid("profile_id").references(() => profile.id),
});

export const gameRuleTypeIdx = index("idx_game_rule_type").on(game.ruleType);
export const gameProfileIdx = index("idx_game_profile").on(game.profileId);
export const gameLastAccessedIdx = index("idx_game_last_accessed").on(
  game.lastAccessedAt
);

// ゲーム参加プレイヤー
export const gamePlayer = pgTable("game_player", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id").references(() => game.id, { onDelete: "cascade" }),
  playerId: uuid("player_id").references(() => player.id),
  displayOrder: integer("display_order").notNull(),
  initialScore: integer("initial_score").default(0),
  initialCorrectCount: integer("initial_correct_count").default(0),
  initialWrongCount: integer("initial_wrong_count").default(0),
});

// ゲーム操作ログ
export const gameLog = pgTable("game_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id").references(() => game.id, { onDelete: "cascade" }),
  playerId: uuid("player_id").references(() => player.id),
  questionNumber: integer("question_number"),
  actionType: varchar("action_type", { length: 50 }).notNull(),
  scoreChange: integer("score_change").default(0),
  timestamp: timestamp("timestamp").defaultNow(),
  isSystemAction: boolean("is_system_action").default(false),
  isActive: boolean("is_active").default(true),
});

export const gameLogGamePlayerIdx = index("idx_game_log_game_player").on(
  gameLog.gameId,
  gameLog.playerId
);
export const gameLogTimestampIdx = index("idx_game_log_timestamp").on(
  gameLog.timestamp
);
export const gameLogActiveIdx = index("idx_game_log_active").on(
  gameLog.gameId,
  gameLog.isActive
);

// クイズセット
export const quizSet = pgTable("quiz_set", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  totalQuestions: integer("total_questions").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  profileId: uuid("profile_id").references(() => profile.id),
});

// クイズ問題
export const quizQuestion = pgTable("quiz_question", {
  id: uuid("id").primaryKey().defaultRandom(),
  quizSetId: uuid("quiz_set_id").references(() => quizSet.id, {
    onDelete: "cascade",
  }),
  questionNumber: integer("question_number").notNull(),
  questionText: text("question_text").notNull(),
  answerText: text("answer_text").notNull(),
  category: varchar("category", { length: 100 }),
  difficultyLevel: integer("difficulty_level"),
});

export const quizQuestionUniqueIdx = unique().on(
  quizQuestion.quizSetId,
  quizQuestion.questionNumber
);

// クイズセッション
export const quizSession = pgTable("quiz_session", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id").references(() => game.id, { onDelete: "cascade" }),
  quizSetName: varchar("quiz_set_name", { length: 255 }),
  currentQuestionIndex: integer("current_question_index").default(0),
  totalQuestions: integer("total_questions"),
  sessionStatus: varchar("session_status", { length: 50 }).default("active"),
});

// ゲーム形式別設定テーブル
export const gameNomxSetting = pgTable("game_nomx_setting", {
  gameId: uuid("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(7),
  losePoint: integer("lose_point").notNull().default(3),
});

export const gameNomxAdSetting = pgTable("game_nomx_ad_setting", {
  gameId: uuid("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(7),
  losePoint: integer("lose_point").notNull().default(3),
  streakOver3: boolean("streak_over3").notNull().default(true),
});

export const gameNySetting = pgTable("game_ny_setting", {
  gameId: uuid("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  targetPoint: integer("target_point").notNull().default(10),
});

export const gameNomrSetting = pgTable("game_nomr_setting", {
  gameId: uuid("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(7),
  restCount: integer("rest_count").notNull().default(3),
});

export const gameNbynSetting = pgTable("game_nbyn_setting", {
  gameId: uuid("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  nValue: integer("n_value").notNull().default(5),
});

export const gameNupdownSetting = pgTable("game_nupdown_setting", {
  gameId: uuid("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(5),
});

export const gameDivideSetting = pgTable("game_divide_setting", {
  gameId: uuid("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(100),
  basePoint: integer("base_point").notNull().default(10),
  initialPoint: integer("initial_point").notNull().default(10),
});

export const gameSwedish10Setting = pgTable("game_swedish10_setting", {
  gameId: uuid("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(10),
  losePoint: integer("lose_point").notNull().default(10),
});

export const gameBackstreamSetting = pgTable("game_backstream_setting", {
  gameId: uuid("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  initialPoint: integer("initial_point").notNull().default(10),
  winPoint: integer("win_point").notNull().default(20),
  loseThreshold: integer("lose_threshold").notNull().default(0),
});

export const gameAttacksurvivalSetting = pgTable(
  "game_attacksurvival_setting",
  {
    gameId: uuid("game_id")
      .primaryKey()
      .references(() => game.id, { onDelete: "cascade" }),
    winPoint: integer("win_point").notNull().default(5),
    losePoint: integer("lose_point").notNull().default(3),
    attackPoint: integer("attack_point").notNull().default(3),
  }
);

export const gameSquarexSetting = pgTable("game_squarex_setting", {
  gameId: uuid("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  squareSize: integer("square_size").notNull().default(3),
  winCondition: integer("win_condition").notNull().default(3),
});

export const gameZSetting = pgTable("game_z_setting", {
  gameId: uuid("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(5),
  zonePoint: integer("zone_point").notNull().default(3),
});

export const gameFreezexSetting = pgTable("game_freezex_setting", {
  gameId: uuid("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(5),
  freezePoint: integer("freeze_point").notNull().default(3),
});

export const gameEndlessChanceSetting = pgTable("game_endless_chance_setting", {
  gameId: uuid("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  loseCount: integer("lose_count").notNull().default(3),
  useR: boolean("use_r").notNull().default(false),
});

export const gameVariablesSetting = pgTable("game_variables_setting", {
  gameId: uuid("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(10),
});

export const gameAqlSetting = pgTable("game_aql_setting", {
  gameId: uuid("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  leftTeam: varchar("left_team", { length: 255 }).notNull(),
  rightTeam: varchar("right_team", { length: 255 }).notNull(),
});

export const gameLinearSetting = pgTable("game_linear_setting", {
  gameId: uuid("game_id")
    .primaryKey()
    .references(() => game.id, { onDelete: "cascade" }),
  winPoint: integer("win_point").notNull().default(100),
  losePoint: integer("lose_point").notNull().default(3),
});

// RLS (Row Level Security) ポリシー用のSQL文
// 注意: これらはDrizzleでは管理されず、手動でSupabaseダッシュボードまたは
// 別途マイグレーションスクリプトで実行する必要があります

/*
-- プロファイルのRLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profiles" ON profiles
  FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can insert their own profiles" ON profiles
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);
CREATE POLICY "Users can update their own profiles" ON profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

-- プレイヤーのRLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view players in their profiles" ON players
  FOR SELECT USING (profile_id IN (SELECT id FROM profiles WHERE auth.uid()::text = id::text));
CREATE POLICY "Users can insert players in their profiles" ON players
  FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE auth.uid()::text = id::text));
CREATE POLICY "Users can update players in their profiles" ON players
  FOR UPDATE USING (profile_id IN (SELECT id FROM profiles WHERE auth.uid()::text = id::text));

-- ゲームのRLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view games in their profiles" ON games
  FOR SELECT USING (profile_id IN (SELECT id FROM profiles WHERE auth.uid()::text = id::text));
CREATE POLICY "Users can insert games in their profiles" ON games
  FOR INSERT WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE auth.uid()::text = id::text));
CREATE POLICY "Users can update games in their profiles" ON games
  FOR UPDATE USING (profile_id IN (SELECT id FROM profiles WHERE auth.uid()::text = id::text));

-- その他のテーブルについても同様のパターンでRLSを設定
*/
