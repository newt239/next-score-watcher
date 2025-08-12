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
  try {
    // オプションがnullや未定義の場合は空のオブジェクトを使用
    const gameOption = game.option || {};

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
        const attacksurvivalOption =
          AttacksurvivalOptionSchema.parse(gameOption);
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
  } catch (error) {
    console.error("parseGameOption error:", error);
    console.error("Game data:", game);
    return null;
  }
};
