import type * as schema from "./schema/index";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

// 基本型定義
export type Player = InferSelectModel<typeof schema.player>;
export type NewPlayer = InferInsertModel<typeof schema.player>;

export type PlayerTag = InferSelectModel<typeof schema.playerTag>;
export type NewPlayerTag = InferInsertModel<typeof schema.playerTag>;

export type Game = InferSelectModel<typeof schema.game>;
export type NewGame = InferInsertModel<typeof schema.game>;

export type GamePlayer = InferSelectModel<typeof schema.gamePlayer>;
export type NewGamePlayer = InferInsertModel<typeof schema.gamePlayer>;

export type GameLog = InferSelectModel<typeof schema.gameLog>;
export type NewGameLog = InferInsertModel<typeof schema.gameLog>;

export type QuizSet = InferSelectModel<typeof schema.quizSet>;
export type NewQuizSet = InferInsertModel<typeof schema.quizSet>;

export type QuizQuestion = InferSelectModel<typeof schema.quizQuestion>;
export type NewQuizQuestion = InferInsertModel<typeof schema.quizQuestion>;

// ゲーム形式別設定型定義
export type GameNomxSetting = InferSelectModel<typeof schema.gameNomxSetting>;
export type NewGameNomxSetting = InferInsertModel<
  typeof schema.gameNomxSetting
>;

export type GameNomxAdSetting = InferSelectModel<
  typeof schema.gameNomxAdSetting
>;
export type NewGameNomxAdSetting = InferInsertModel<
  typeof schema.gameNomxAdSetting
>;

export type GameNySetting = InferSelectModel<typeof schema.gameNySetting>;
export type NewGameNySetting = InferInsertModel<typeof schema.gameNySetting>;

export type GameNomrSetting = InferSelectModel<typeof schema.gameNomrSetting>;
export type NewGameNomrSetting = InferInsertModel<
  typeof schema.gameNomrSetting
>;

export type GameNbynSetting = InferSelectModel<typeof schema.gameNbynSetting>;
export type NewGameNbynSetting = InferInsertModel<
  typeof schema.gameNbynSetting
>;

export type GameNupdownSetting = InferSelectModel<
  typeof schema.gameNupdownSetting
>;
export type NewGameNupdownSetting = InferInsertModel<
  typeof schema.gameNupdownSetting
>;

export type GameDivideSetting = InferSelectModel<
  typeof schema.gameDivideSetting
>;
export type NewGameDivideSetting = InferInsertModel<
  typeof schema.gameDivideSetting
>;

export type GameSwedish10Setting = InferSelectModel<
  typeof schema.gameSwedish10Setting
>;
export type NewGameSwedish10Setting = InferInsertModel<
  typeof schema.gameSwedish10Setting
>;

export type GameBackstreamSetting = InferSelectModel<
  typeof schema.gameBackstreamSetting
>;
export type NewGameBackstreamSetting = InferInsertModel<
  typeof schema.gameBackstreamSetting
>;

export type GameAttacksurvivalSetting = InferSelectModel<
  typeof schema.gameAttacksurvivalSetting
>;
export type NewGameAttacksurvivalSetting = InferInsertModel<
  typeof schema.gameAttacksurvivalSetting
>;

export type GameSquarexSetting = InferSelectModel<
  typeof schema.gameSquarexSetting
>;
export type NewGameSquarexSetting = InferInsertModel<
  typeof schema.gameSquarexSetting
>;

export type GameZSetting = InferSelectModel<typeof schema.gameZSetting>;
export type NewGameZSetting = InferInsertModel<typeof schema.gameZSetting>;

export type GameFreezexSetting = InferSelectModel<
  typeof schema.gameFreezexSetting
>;
export type NewGameFreezexSetting = InferInsertModel<
  typeof schema.gameFreezexSetting
>;

export type GameEndlessChanceSetting = InferSelectModel<
  typeof schema.gameEndlessChanceSetting
>;
export type NewGameEndlessChanceSetting = InferInsertModel<
  typeof schema.gameEndlessChanceSetting
>;

export type GameVariablesSetting = InferSelectModel<
  typeof schema.gameVariablesSetting
>;
export type NewGameVariablesSetting = InferInsertModel<
  typeof schema.gameVariablesSetting
>;

export type GameAqlSetting = InferSelectModel<typeof schema.gameAqlSetting>;
export type NewGameAqlSetting = InferInsertModel<typeof schema.gameAqlSetting>;

// ルール名の型定義
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

// ゲーム設定の統合型
export type GameSettings = {
  normal: null;
  nomx: GameNomxSetting;
  "nomx-ad": GameNomxAdSetting;
  ny: GameNySetting;
  nomr: GameNomrSetting;
  nbyn: GameNbynSetting;
  nupdown: GameNupdownSetting;
  divide: GameDivideSetting;
  swedish10: GameSwedish10Setting;
  backstream: GameBackstreamSetting;
  attacksurvival: GameAttacksurvivalSetting;
  squarex: GameSquarexSetting;
  z: GameZSetting;
  freezex: GameFreezexSetting;
  "endless-chance": GameEndlessChanceSetting;
  variables: GameVariablesSetting;
  aql: GameAqlSetting;
};

// 完全な型安全性を持つゲーム型
export type GameWithSettings<T extends RuleNames> = Game & {
  ruleType: T;
  settings: GameSettings[T];
};

// 使用例の型定義
export type NomxGame = GameWithSettings<"nomx">;
export type AQLGame = GameWithSettings<"aql">;
export type NyGame = GameWithSettings<"ny">;
