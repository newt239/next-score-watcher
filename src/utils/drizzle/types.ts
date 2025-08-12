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

// ルール名の型定義（スキーマから統一）
export type RuleNames = SchemaRuleNames;

export const NormalOptionSchema = z
  .object({
    maxPoint: z.number().default(10),
    minPoint: z.number().default(-10),
  })
  .default({ maxPoint: 10, minPoint: -10 });
export type NormalOption = z.infer<typeof NormalOptionSchema>;

export const NomxOptionSchema = z
  .object({
    winPoint: z.number().default(7),
    losePoint: z.number().default(3),
  })
  .default({ winPoint: 7, losePoint: 3 });
export type NomxOption = z.infer<typeof NomxOptionSchema>;

export const NomxAdOptionSchema = z
  .object({
    winPoint: z.number().default(7),
    losePoint: z.number().default(3),
  })
  .default({ winPoint: 7, losePoint: 3 });
export type NomxAdOption = z.infer<typeof NomxAdOptionSchema>;

export const NyOptionSchema = z
  .object({
    targetPoint: z.number().default(10),
  })
  .default({ targetPoint: 10 });
export type NyOption = z.infer<typeof NyOptionSchema>;

export const NomrOptionSchema = z
  .object({
    winPoint: z.number().default(7),
    restCount: z.number().default(3),
  })
  .default({ winPoint: 7, restCount: 3 });
export type NomrOption = z.infer<typeof NomrOptionSchema>;

export const NbynOptionSchema = z
  .object({
    nValue: z.number().default(7),
  })
  .default({ nValue: 7 });
export type NbynOption = z.infer<typeof NbynOptionSchema>;

export const NupdownOptionSchema = z
  .object({
    targetPoint: z.number().default(7),
  })
  .default({ targetPoint: 7 });
export type NupdownOption = z.infer<typeof NupdownOptionSchema>;

export const DivideOptionSchema = z
  .object({
    targetPoint: z.number().default(10),
  })
  .default({ targetPoint: 10 });
export type DivideOption = z.infer<typeof DivideOptionSchema>;

export const Swedish10OptionSchema = z
  .object({
    targetPoint: z.number().default(10),
  })
  .default({ targetPoint: 10 });
export type Swedish10Option = z.infer<typeof Swedish10OptionSchema>;

export const BackstreamOptionSchema = z
  .object({
    targetPoint: z.number().default(10),
  })
  .default({ targetPoint: 10 });
export type BackstreamOption = z.infer<typeof BackstreamOptionSchema>;

export const AttacksurvivalOptionSchema = z
  .object({
    targetPoint: z.number().default(10),
  })
  .default({ targetPoint: 10 });
export type AttacksurvivalOption = z.infer<typeof AttacksurvivalOptionSchema>;

export const SquarexOptionSchema = z
  .object({
    squareSize: z.number().default(3),
    winCondition: z.number().default(7),
  })
  .default({ squareSize: 3, winCondition: 7 });
export type SquarexOption = z.infer<typeof SquarexOptionSchema>;

export const ZOptionSchema = z
  .object({
    targetPoint: z.number().default(10),
    zonePoint: z.number().default(3),
  })
  .default({ targetPoint: 10, zonePoint: 3 });
export type ZOption = z.infer<typeof ZOptionSchema>;

export const FreezexOptionSchema = z
  .object({
    winPoint: z.number().default(7),
    freezePoint: z.number().default(3),
  })
  .default({ winPoint: 7, freezePoint: 3 });
export type FreezexOption = z.infer<typeof FreezexOptionSchema>;

export const EndlessChanceOptionSchema = z
  .object({
    winPoint: z.number().default(7),
    losePoint: z.number().default(3),
  })
  .default({ winPoint: 7, losePoint: 3 });
export type EndlessChanceOption = z.infer<typeof EndlessChanceOptionSchema>;

export const VariablesOptionSchema = z
  .object({
    winPoint: z.number().default(7),
    losePoint: z.number().default(3),
  })
  .default({ winPoint: 7, losePoint: 3 });
export type VariablesOption = z.infer<typeof VariablesOptionSchema>;

export const AqlOptionSchema = z
  .object({
    left_team: z.string().default("左チーム"),
    right_team: z.string().default("右チーム"),
  })
  .default({ left_team: "左チーム", right_team: "右チーム" });
export type AqlOption = z.infer<typeof AqlOptionSchema>;

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
