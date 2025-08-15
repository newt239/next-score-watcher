import type { Game } from "@/utils/drizzle/types";

import {
  AqlOptionSchema,
  AttacksurvivalOptionSchema,
  BackstreamOptionSchema,
  DivideOptionSchema,
  EndlessChanceOptionSchema,
  FreezexOptionSchema,
  NbynOptionSchema,
  NomrOptionSchema,
  NomxAdOptionSchema,
  NomxOptionSchema,
  NormalOptionSchema,
  NupdownOptionSchema,
  NyOptionSchema,
  SquarexOptionSchema,
  Swedish10OptionSchema,
  VariablesOptionSchema,
  ZOptionSchema,
} from "@/utils/drizzle/types";

/*
 * gameテーブルのoptionsをZodでバリデーションして返す
 * バリデーションに失敗した場合はnullを返す
 */
export const parseGameOption = (game: Game) => {
  if (typeof game.option !== "string" && typeof game.option !== "object") {
    return null;
  }
  const gameOption =
    typeof game.option === "string" ? JSON.parse(game.option) : game.option;
  if (typeof gameOption !== "object") {
    return null;
  }

  switch (game.ruleType) {
    case "normal":
      const normalOption = NormalOptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "normal",
        option: normalOption,
      } as const;
    case "nomx":
      const nomxOption = NomxOptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "nomx",
        option: nomxOption,
      } as const;
    case "nomx-ad":
      const nomxAdOption = NomxAdOptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "nomx-ad",
        option: nomxAdOption,
      } as const;
    case "ny":
      const nyOption = NyOptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "ny",
        option: nyOption,
      } as const;
    case "nomr":
      const nomrOption = NomrOptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "nomr",
        option: nomrOption,
      } as const;
    case "nbyn":
      const nbynOption = NbynOptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "nbyn",
        option: nbynOption,
      } as const;
    case "nupdown":
      const nupdownOption = NupdownOptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "nupdown",
        option: nupdownOption,
      } as const;
    case "divide":
      const divideOption = DivideOptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "divide",
        option: divideOption,
      } as const;
    case "swedish10":
      const swedish10Option = Swedish10OptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "swedish10",
        option: swedish10Option,
      } as const;
    case "backstream":
      const backstreamOption = BackstreamOptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "backstream",
        option: backstreamOption,
      } as const;
    case "attacksurvival":
      const attacksurvivalOption = AttacksurvivalOptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "attacksurvival",
        option: attacksurvivalOption,
      } as const;
    case "squarex":
      const squarexOption = SquarexOptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "squarex",
        option: squarexOption,
      } as const;
    case "z":
      const zOption = ZOptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "z",
        option: zOption,
      } as const;
    case "freezex":
      const freezexOption = FreezexOptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "freezex",
        option: freezexOption,
      } as const;
    case "endless-chance":
      const endlessChanceOption = EndlessChanceOptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "endless-chance",
        option: endlessChanceOption,
      } as const;
    case "variables":
      const variablesOption = VariablesOptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "variables",
        option: variablesOption,
      } as const;
    case "aql":
      const aqlOption = AqlOptionSchema.parse(gameOption);
      return {
        ...game,
        ruleType: "aql",
        option: aqlOption,
      } as const;
    default:
      return null;
  }
};

export const setupDefaultGameOption = (
  game: Partial<Pick<Game, "ruleType" | "option">>
) => {
  // optionが存在しない場合はデフォルトのオプションを作成
  let gameOption = {};
  if (game.option !== undefined && game.option !== null) {
    if (typeof game.option === "string") {
      try {
        gameOption = JSON.parse(game.option);
      } catch {
        gameOption = {};
      }
    } else if (typeof game.option === "object") {
      gameOption = game.option;
    }
  }

  switch (game.ruleType) {
    case "normal":
      return NormalOptionSchema.parse(gameOption);
    case "nomx":
      return NomxOptionSchema.parse(gameOption);
    case "nomx-ad":
      return NomxAdOptionSchema.parse(gameOption);
    case "ny":
      return NyOptionSchema.parse(gameOption);
    case "nomr":
      return NomrOptionSchema.parse(gameOption);
    case "nbyn":
      return NbynOptionSchema.parse(gameOption);
    case "nupdown":
      return NupdownOptionSchema.parse(gameOption);
    case "divide":
      return DivideOptionSchema.parse(gameOption);
    case "swedish10":
      return Swedish10OptionSchema.parse(gameOption);
    case "backstream":
      return BackstreamOptionSchema.parse(gameOption);
    case "attacksurvival":
      return AttacksurvivalOptionSchema.parse(gameOption);
    case "squarex":
      return SquarexOptionSchema.parse(gameOption);
    case "z":
      return ZOptionSchema.parse(gameOption);
    case "freezex":
      return FreezexOptionSchema.parse(gameOption);
    case "endless-chance":
      return EndlessChanceOptionSchema.parse(gameOption);
    case "variables":
      return VariablesOptionSchema.parse(gameOption);
    case "aql":
      const aqlOption = AqlOptionSchema.parse(gameOption);
      return aqlOption;
    default:
      return null;
  }
};
