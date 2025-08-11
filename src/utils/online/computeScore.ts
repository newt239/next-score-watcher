// このファイルは新しい分割実装への互換性のために残されています
// 実際の実装はcomputeOnlineScore.tsにあります

export { computeOnlineScore as computeOnlineScore } from "./computeScore/computeOnlineScore";
export type {
  OnlineGameCore,
  OnlineSettings,
  OnlineGameWithSettings,
} from "./computeScore/index";
export type { States } from "@/models/games";
