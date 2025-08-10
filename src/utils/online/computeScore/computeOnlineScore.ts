// 各ゲーム形式のコンピュータをインポート
import computeAql from "./aql";
import computeAttackSurvival from "./attacksurvival";
import computeBackstream from "./backstream";
import computeDivide from "./divide";
import computeEndlessChance from "./endless-chance";
import computeFreezex from "./freezex";
import computeNbyn from "./nbyn";
import computeNomr from "./nomr";
import computeNomx from "./nomx";
import computeNomxAd from "./nomx-ad";
import computeNormal from "./normal";
import computeNupdown from "./nupdown";
import computeNy from "./ny";
import computeSquarex from "./squarex";
import computeSwedish10 from "./swedish10";
import computeVariables from "./variables";
import computeZ from "./z";

import { getInitialPlayersStateForOnline } from "./index";

import type {
  OnlineGameCore,
  OnlineSettings,
  OnlineGameWithSettings,
} from "./index";
import type {
  GameDBPlayerProps,
  LogDBProps,
  WinPlayerProps,
} from "@/utils/types";

/**
 * オンライン版のスコア計算（全形式対応）
 * ローカル版と同じく17種類のゲーム形式に対応
 */
export const computeOnlineScore = (
  game: OnlineGameCore,
  players: GameDBPlayerProps[],
  logs: LogDBProps[],
  settings?: OnlineSettings
) => {
  const gameWithSettings: OnlineGameWithSettings = {
    ...game,
    ...settings,
  };

  const initialState = getInitialPlayersStateForOnline(
    gameWithSettings,
    players
  );

  switch (game.ruleType) {
    case "normal":
      return computeNormal(gameWithSettings, initialState, logs);
    case "nomx":
      return computeNomx(gameWithSettings, initialState, logs);
    case "nomx-ad":
      return computeNomxAd(gameWithSettings, initialState, logs);
    case "ny":
      return computeNy(gameWithSettings, initialState, logs);
    case "nomr":
      return computeNomr(gameWithSettings, initialState, logs);
    case "nbyn":
      return computeNbyn(gameWithSettings, initialState, logs);
    case "nupdown":
      return computeNupdown(gameWithSettings, initialState, logs);
    case "divide":
      return computeDivide(gameWithSettings, initialState, logs);
    case "swedish10":
      return computeSwedish10(gameWithSettings, initialState, logs);
    case "backstream":
      return computeBackstream(gameWithSettings, initialState, logs);
    case "attacksurvival":
      return computeAttackSurvival(gameWithSettings, initialState, logs);
    case "squarex":
      return computeSquarex(gameWithSettings, initialState, logs);
    case "z":
      return computeZ(gameWithSettings, initialState, logs);
    case "freezex":
      return computeFreezex(gameWithSettings, initialState, logs);
    case "endless-chance":
      return computeEndlessChance(gameWithSettings, initialState, logs);
    case "variables":
      return computeVariables(gameWithSettings, initialState, logs);
    case "aql":
      return computeAql(gameWithSettings, initialState, logs);
    default:
      // 未対応形式の場合は初期状態を返す
      const scores = initialState.map((score, index) => ({
        ...score,
        order: index,
        text: String(score.score),
      }));
      return { scores, winPlayers: [] as WinPlayerProps[] } as const;
  }
};

export default computeOnlineScore;
