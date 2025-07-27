import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

import { game } from "./game";

// ゲーム形式別設定テーブル
export const gameNomxSetting = sqliteTable("game_nomx_setting", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id")
    .notNull()
    .unique()
    .references(() => game.id),
  winPoint: integer("win_point").notNull().default(7),
  losePoint: integer("lose_point").notNull().default(3),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameNomxAdSetting = sqliteTable("game_nomx_ad_setting", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id")
    .notNull()
    .unique()
    .references(() => game.id),
  winPoint: integer("win_point").notNull().default(7),
  losePoint: integer("lose_point").notNull().default(3),
  streakOver3: integer("streak_over3", { mode: "boolean" })
    .notNull()
    .default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameNySetting = sqliteTable("game_ny_setting", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id")
    .notNull()
    .unique()
    .references(() => game.id),
  targetPoint: integer("target_point").notNull().default(10),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameNomrSetting = sqliteTable("game_nomr_setting", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id")
    .notNull()
    .unique()
    .references(() => game.id),
  winPoint: integer("win_point").notNull().default(7),
  restCount: integer("rest_count").notNull().default(3),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameNbynSetting = sqliteTable("game_nbyn_setting", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id")
    .notNull()
    .unique()
    .references(() => game.id),
  nValue: integer("n_value").notNull().default(5),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameNupdownSetting = sqliteTable("game_nupdown_setting", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id")
    .notNull()
    .unique()
    .references(() => game.id),
  winPoint: integer("win_point").notNull().default(5),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameDivideSetting = sqliteTable("game_divide_setting", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id")
    .notNull()
    .unique()
    .references(() => game.id),
  winPoint: integer("win_point").notNull().default(100),
  basePoint: integer("base_point").notNull().default(10),
  initialPoint: integer("initial_point").notNull().default(10),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameSwedish10Setting = sqliteTable("game_swedish10_setting", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id")
    .notNull()
    .unique()
    .references(() => game.id),
  winPoint: integer("win_point").notNull().default(10),
  losePoint: integer("lose_point").notNull().default(10),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameBackstreamSetting = sqliteTable("game_backstream_setting", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id")
    .notNull()
    .unique()
    .references(() => game.id),
  initialPoint: integer("initial_point").notNull().default(10),
  winPoint: integer("win_point").notNull().default(20),
  loseThreshold: integer("lose_threshold").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameAttacksurvivalSetting = sqliteTable(
  "game_attacksurvival_setting",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    gameId: text("game_id")
      .notNull()
      .unique()
      .references(() => game.id),
    winPoint: integer("win_point").notNull().default(5),
    losePoint: integer("lose_point").notNull().default(3),
    attackPoint: integer("attack_point").notNull().default(3),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
  }
);

export const gameSquarexSetting = sqliteTable("game_squarex_setting", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id")
    .notNull()
    .unique()
    .references(() => game.id),
  squareSize: integer("square_size").notNull().default(3),
  winCondition: integer("win_condition").notNull().default(3),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameZSetting = sqliteTable("game_z_setting", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id")
    .notNull()
    .unique()
    .references(() => game.id),
  winPoint: integer("win_point").notNull().default(5),
  zonePoint: integer("zone_point").notNull().default(3),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameFreezexSetting = sqliteTable("game_freezex_setting", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id")
    .notNull()
    .unique()
    .references(() => game.id),
  winPoint: integer("win_point").notNull().default(5),
  freezePoint: integer("freeze_point").notNull().default(3),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameEndlessChanceSetting = sqliteTable(
  "game_endless_chance_setting",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    gameId: text("game_id")
      .notNull()
      .unique()
      .references(() => game.id),
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
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id")
    .notNull()
    .unique()
    .references(() => game.id),
  winPoint: integer("win_point").notNull().default(10),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const gameAqlSetting = sqliteTable("game_aql_setting", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  gameId: text("game_id")
    .notNull()
    .unique()
    .references(() => game.id),
  leftTeam: text("left_team").notNull(),
  rightTeam: text("right_team").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});
