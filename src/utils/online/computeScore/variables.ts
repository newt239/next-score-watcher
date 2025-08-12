import { generateScoreText, getSortedPlayerOrderListForOnline } from "./index";

import type {
  ComputedScoreProps,
  GetGameDetailResponseType,
} from "@/models/games";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

/**
 * Variables形式のスコア計算
 * 各プレイヤーが変動値Nを設定、正解で+N、誤答で-N×(N-2)
 */
const computeVariables = (
  game: Extract<GetGameDetailResponseType, { ruleType: "variables" }>,
  playersState: ComputedScoreProps[],
  logs: SeriarizedGameLog[]
) => {
  const winPoint = game.option.win_point;

  const byId = new Map<string, ComputedScoreProps>(
    playersState.map((s) => [
      s.player_id,
      {
        ...s,
        correct: 0,
        score: 0,
        // Variablesの変動値Nは初期値で設定される想定
        // ここでは簡略化して固定値を使用
        stage: 3, // 変動値Nをstageで管理
      },
    ])
  );

  logs.forEach((log, qn) => {
    const s = byId.get(log.playerId || "");
    if (!s) return;

    const variableN = s.stage; // 各プレイヤーの変動値

    if (log.actionType === "correct") {
      s.correct += 1;
      s.score += variableN; // 正解で+N
      s.last_correct = qn;

      if (s.score >= winPoint) {
        s.state = "win";
      } else if (s.score >= winPoint - variableN) {
        s.reach_state = "win";
      }
    } else if (log.actionType === "wrong") {
      s.wrong += 1;
      const penalty = variableN * (variableN - 2); // -N×(N-2)
      s.score -= penalty;
      s.last_wrong = qn;

      // Variablesでは通常誤答による失格はないが、
      // スコアがマイナスになった場合の処理
      if (s.score < 0) {
        s.score = 0; // マイナススコアを防ぐ
      }
    }
  });

  const scores = [...byId.values()];
  const playerOrderList = getSortedPlayerOrderListForOnline(scores);

  const finalScores = scores.map((score) => {
    const order = playerOrderList.findIndex((id) => id === score.player_id);
    return {
      ...score,
      order,
      text: generateScoreText(score, order),
    };
  });

  const winPlayers = finalScores
    .filter((s) => s.state === "win")
    .filter(() => logs.length > 0)
    .filter((s) => s.last_correct === logs.length - 1)
    .map((s) => ({ player_id: s.player_id, text: s.text }));

  return { scores: finalScores, winPlayers } as const;
};

export default computeVariables;
