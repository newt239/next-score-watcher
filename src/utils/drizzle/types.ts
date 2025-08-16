import z from "zod";

import type { RuleNames as SchemaRuleNames } from "@/utils/drizzle/schema/game";
import type * as schema from "@/utils/drizzle/schema/index";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

// 基本型定義
export type Player = InferSelectModel<typeof schema.player>;
export type SeriarizedPlayer = DeepDateToString<Player>;
export type NewPlayer = InferInsertModel<typeof schema.player>;

export type PlayerTag = InferSelectModel<typeof schema.playerTag>;
export type NewPlayerTag = InferInsertModel<typeof schema.playerTag>;

export type Game = InferSelectModel<typeof schema.game>;
export type NewGame = InferInsertModel<typeof schema.game>;

export type GamePlayer = InferSelectModel<typeof schema.gamePlayer>;
export type NewGamePlayer = InferInsertModel<typeof schema.gamePlayer>;

export type GameLog = InferSelectModel<typeof schema.gameLog>;
export type SeriarizedGameLog = DeepDateToString<GameLog>;
export type NewGameLog = InferInsertModel<typeof schema.gameLog>;

export type QuizSet = InferSelectModel<typeof schema.quizSet>;
export type NewQuizSet = InferInsertModel<typeof schema.quizSet>;

export type QuizQuestion = InferSelectModel<typeof schema.quizQuestion>;
export type NewQuizQuestion = InferInsertModel<typeof schema.quizQuestion>;

// ルール名の型定義
export type RuleNames = SchemaRuleNames;

export const NormalOptionSchema = z
  .object({
    limit: z.number().optional(),
    win_through: z.number().optional(),
  })
  .default({});
export const NormalOptionKeySchema = z.enum(["limit", "win_through"]);
export type NormalOption = z.infer<typeof NormalOptionSchema>;
export type NormalOptionKey = keyof NormalOption;

export const NomxOptionSchema = z
  .object({
    win_point: z.number().default(7),
    lose_point: z.number().default(3),
    limit: z.number().optional(),
    win_through: z.number().optional(),
  })
  .default({ win_point: 7, lose_point: 3 });
export const NomxOptionKeySchema = z.enum([
  "win_point",
  "lose_point",
  "limit",
  "win_through",
]);
export type NomxOption = z.infer<typeof NomxOptionSchema>;
export type NomxOptionKey = keyof NomxOption;

export const NomxAdOptionSchema = z
  .object({
    win_point: z.number().default(7),
    lose_point: z.number().default(3),
    streak_over3: z.boolean().default(true),
    limit: z.number().optional(),
    win_through: z.number().optional(),
  })
  .default({
    win_point: 7,
    lose_point: 3,
    streak_over3: true,
  });
export const NomxAdOptionKeySchema = z.enum([
  "win_point",
  "lose_point",
  "streak_over3",
  "limit",
  "win_through",
]);
export type NomxAdOption = z.infer<typeof NomxAdOptionSchema>;
export type NomxAdOptionKey = keyof NomxAdOption;

export const NyOptionSchema = z
  .object({
    win_point: z.number().default(10),
    lose_point: z.number().default(3),
    target_point: z.number().default(10),
    limit: z.number().optional(),
    win_through: z.number().optional(),
  })
  .default({ win_point: 10, lose_point: 3, target_point: 10 });
export const NyOptionKeySchema = z.enum([
  "win_point",
  "lose_point",
  "target_point",
  "limit",
  "win_through",
]);
export type NyOption = z.infer<typeof NyOptionSchema>;
export type NyOptionKey = keyof NyOption;

export const NomrOptionSchema = z
  .object({
    win_point: z.number().default(7),
    lose_point: z.number().default(3),
    rest_count: z.number().default(3),
    limit: z.number().optional(),
    win_through: z.number().optional(),
  })
  .default({
    win_point: 7,
    lose_point: 3,
    rest_count: 3,
  });
export const NomrOptionKeySchema = z.enum([
  "win_point",
  "lose_point",
  "rest_count",
  "limit",
  "win_through",
]);
export type NomrOption = z.infer<typeof NomrOptionSchema>;
export type NomrOptionKey = keyof NomrOption;

export const NbynOptionSchema = z
  .object({
    win_point: z.number().default(5),
    lose_point: z.number().default(5),
    limit: z.number().optional(),
    win_through: z.number().optional(),
  })
  .default({ win_point: 5, lose_point: 5 });
export const NbynOptionKeySchema = z.enum([
  "win_point",
  "lose_point",
  "limit",
  "win_through",
]);
export type NbynOption = z.infer<typeof NbynOptionSchema>;
export type NbynOptionKey = keyof NbynOption;

export const NupdownOptionSchema = z
  .object({
    win_point: z.number().default(5),
    lose_point: z.number().default(2),
    limit: z.number().optional(),
    win_through: z.number().optional(),
  })
  .default({ win_point: 5, lose_point: 2 });
export const NupdownOptionKeySchema = z.enum([
  "win_point",
  "lose_point",
  "limit",
  "win_through",
]);
export type NupdownOption = z.infer<typeof NupdownOptionSchema>;
export type NupdownOptionKey = keyof NupdownOption;

export const DivideOptionSchema = z
  .object({
    win_point: z.number().default(100),
    correct_me: z.number().default(10),
    limit: z.number().optional(),
    win_through: z.number().optional(),
  })
  .default({ win_point: 100, correct_me: 10 });
export const DivideOptionKeySchema = z.enum([
  "win_point",
  "correct_me",
  "limit",
  "win_through",
]);
export type DivideOption = z.infer<typeof DivideOptionSchema>;
export type DivideOptionKey = keyof DivideOption;

export const Swedish10OptionSchema = z
  .object({
    win_point: z.number().default(10),
    lose_point: z.number().default(10),
    limit: z.number().optional(),
    win_through: z.number().optional(),
  })
  .default({ win_point: 10, lose_point: 10 });
export const Swedish10OptionKeySchema = z.enum([
  "win_point",
  "lose_point",
  "limit",
  "win_through",
]);
export type Swedish10Option = z.infer<typeof Swedish10OptionSchema>;
export type Swedish10OptionKey = keyof Swedish10Option;

export const BackstreamOptionSchema = z
  .object({
    win_point: z.number().default(10),
    lose_point: z.number().default(-10),
    limit: z.number().optional(),
    win_through: z.number().optional(),
  })
  .default({ win_point: 10, lose_point: -10 });
export const BackstreamOptionKeySchema = z.enum([
  "win_point",
  "lose_point",
  "limit",
  "win_through",
]);
export type BackstreamOption = z.infer<typeof BackstreamOptionSchema>;
export type BackstreamOptionKey = keyof BackstreamOption;

export const AttacksurvivalOptionSchema = z
  .object({
    win_point: z.number().default(15),
    win_through: z.number().default(3),
    correct_me: z.number().default(0),
    wrong_me: z.number().default(-2),
    correct_other: z.number().default(-1),
    wrong_other: z.number().default(0),
    limit: z.number().optional(),
  })
  .default({
    win_point: 15,
    win_through: 3,
    correct_me: 0,
    wrong_me: -2,
    correct_other: -1,
    wrong_other: 0,
  });
export const AttacksurvivalOptionKeySchema = z.enum([
  "win_point",
  "win_through",
  "correct_me",
  "wrong_me",
  "correct_other",
  "wrong_other",
  "limit",
]);
export type AttacksurvivalOption = z.infer<typeof AttacksurvivalOptionSchema>;
export type AttacksurvivalOptionKey = keyof AttacksurvivalOption;

export const SquarexOptionSchema = z
  .object({
    win_point: z.number().default(16),
    limit: z.number().optional(),
    win_through: z.number().optional(),
  })
  .default({ win_point: 16 });
export const SquarexOptionKeySchema = z.enum([
  "win_point",
  "limit",
  "win_through",
]);
export type SquarexOption = z.infer<typeof SquarexOptionSchema>;
export type SquarexOptionKey = keyof SquarexOption;

export const ZOptionSchema = z
  .object({
    limit: z.number().optional(),
    win_through: z.number().optional(),
  })
  .default({});
export const ZOptionKeySchema = z.enum(["limit", "win_through"]);
export type ZOption = z.infer<typeof ZOptionSchema>;
export type ZOptionKey = keyof ZOption;

export const FreezexOptionSchema = z
  .object({
    win_point: z.number().default(7),
    limit: z.number().optional(),
    win_through: z.number().optional(),
  })
  .default({ win_point: 7 });
export const FreezexOptionKeySchema = z.enum([
  "win_point",
  "limit",
  "win_through",
]);
export type FreezexOption = z.infer<typeof FreezexOptionSchema>;
export type FreezexOptionKey = keyof FreezexOption;

export const EndlessChanceOptionSchema = z
  .object({
    win_point: z.number().default(7),
    lose_point: z.number().default(3),
    lose_count: z.number().default(3),
    use_r: z.boolean().default(false),
    limit: z.number().optional(),
    win_through: z.number().optional(),
  })
  .default({
    win_point: 7,
    lose_point: 3,
    lose_count: 3,
    use_r: false,
  });
export const EndlessChanceOptionKeySchema = z.enum([
  "win_point",
  "lose_point",
  "lose_count",
  "use_r",
  "limit",
  "win_through",
]);
export type EndlessChanceOption = z.infer<typeof EndlessChanceOptionSchema>;
export type EndlessChanceOptionKey = keyof EndlessChanceOption;

export const VariablesOptionSchema = z
  .object({
    win_point: z.number().default(30),
    limit: z.number().optional(),
    win_through: z.number().optional(),
  })
  .default({ win_point: 30 });
export const VariablesOptionKeySchema = z.enum([
  "win_point",
  "limit",
  "win_through",
]);
export type VariablesOption = z.infer<typeof VariablesOptionSchema>;
export type VariablesOptionKey = keyof VariablesOption;

export const AqlOptionSchema = z
  .object({
    left_team: z.string().default("Team A"),
    right_team: z.string().default("Team B"),
    limit: z.number().optional(),
    win_through: z.number().optional(),
  })
  .default({ left_team: "Team A", right_team: "Team B" });
export const AqlOptionKeySchema = z.enum([
  "left_team",
  "right_team",
  "limit",
  "win_through",
]);
export type AqlOption = z.infer<typeof AqlOptionSchema>;
export type AqlOptionKey = keyof AqlOption;

export const GameOptionSchema = z.union([
  NormalOptionSchema,
  NomxOptionSchema,
  NomxAdOptionSchema,
  NyOptionSchema,
  NomrOptionSchema,
  NbynOptionSchema,
  NupdownOptionSchema,
  DivideOptionSchema,
  Swedish10OptionSchema,
  BackstreamOptionSchema,
  AttacksurvivalOptionSchema,
  SquarexOptionSchema,
  ZOptionSchema,
  FreezexOptionSchema,
  EndlessChanceOptionSchema,
  VariablesOptionSchema,
  AqlOptionSchema,
]);
export const GameOptionKeySchema = z.union([
  NormalOptionKeySchema,
  NomxOptionKeySchema,
  NomxAdOptionKeySchema,
  NyOptionKeySchema,
  NomrOptionKeySchema,
  NbynOptionKeySchema,
  NupdownOptionKeySchema,
  DivideOptionKeySchema,
  Swedish10OptionKeySchema,
  BackstreamOptionKeySchema,
  AttacksurvivalOptionKeySchema,
  SquarexOptionKeySchema,
  ZOptionKeySchema,
  FreezexOptionKeySchema,
  EndlessChanceOptionKeySchema,
  VariablesOptionKeySchema,
  AqlOptionKeySchema,
]);
export type GameOptionKey =
  | NormalOptionKey
  | NomxOptionKey
  | NomxAdOptionKey
  | NyOptionKey
  | NomrOptionKey
  | NbynOptionKey
  | NupdownOptionKey
  | DivideOptionKey
  | Swedish10OptionKey
  | BackstreamOptionKey
  | AttacksurvivalOptionKey
  | SquarexOptionKey
  | ZOptionKey
  | FreezexOptionKey
  | EndlessChanceOptionKey
  | VariablesOptionKey
  | AqlOptionKey;

// 日付を文字列に変換
export type SeriarizedGame = DeepDateToString<Game>;

export type TypedGame<T extends RuleNames = RuleNames> = T extends "normal"
  ? SeriarizedGame & { ruleType: "normal"; option: NormalOption }
  : T extends "nomx"
    ? SeriarizedGame & { ruleType: "nomx"; option: NomxOption }
    : T extends "nomx-ad"
      ? SeriarizedGame & { ruleType: "nomx-ad"; option: NomxAdOption }
      : T extends "ny"
        ? SeriarizedGame & { ruleType: "ny"; option: NyOption }
        : T extends "nomr"
          ? SeriarizedGame & { ruleType: "nomr"; option: NomrOption }
          : T extends "nbyn"
            ? SeriarizedGame & { ruleType: "nbyn"; option: NbynOption }
            : T extends "nupdown"
              ? SeriarizedGame & { ruleType: "nupdown"; option: NupdownOption }
              : T extends "divide"
                ? SeriarizedGame & { ruleType: "divide"; option: DivideOption }
                : T extends "swedish10"
                  ? SeriarizedGame & {
                      ruleType: "swedish10";
                      option: Swedish10Option;
                    }
                  : T extends "backstream"
                    ? SeriarizedGame & {
                        ruleType: "backstream";
                        option: BackstreamOption;
                      }
                    : T extends "attacksurvival"
                      ? SeriarizedGame & {
                          ruleType: "attacksurvival";
                          option: AttacksurvivalOption;
                        }
                      : T extends "squarex"
                        ? SeriarizedGame & {
                            ruleType: "squarex";
                            option: SquarexOption;
                          }
                        : T extends "z"
                          ? SeriarizedGame & { ruleType: "z"; option: ZOption }
                          : T extends "freezex"
                            ? SeriarizedGame & {
                                ruleType: "freezex";
                                option: FreezexOption;
                              }
                            : T extends "endless-chance"
                              ? SeriarizedGame & {
                                  ruleType: "endless-chance";
                                  option: EndlessChanceOption;
                                }
                              : T extends "variables"
                                ? SeriarizedGame & {
                                    ruleType: "variables";
                                    option: VariablesOption;
                                  }
                                : T extends "aql"
                                  ? SeriarizedGame & {
                                      ruleType: "aql";
                                      option: AqlOption;
                                    }
                                  : never;

export type TypedGameOption =
  | NormalOption
  | NomxOption
  | NomxAdOption
  | NyOption
  | NomrOption
  | NbynOption
  | NupdownOption
  | DivideOption
  | Swedish10Option
  | BackstreamOption
  | AttacksurvivalOption
  | SquarexOption
  | ZOption
  | FreezexOption
  | EndlessChanceOption
  | VariablesOption
  | AqlOption;

export type DeepDateToString<T> = T extends Date
  ? string
  : T extends readonly (infer U)[]
    ? readonly DeepDateToString<U>[]
    : T extends (infer U)[]
      ? DeepDateToString<U>[]
      : T extends object
        ? { [K in keyof T]: DeepDateToString<T[K]> }
        : T;
