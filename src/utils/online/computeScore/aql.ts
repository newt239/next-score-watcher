import { generateScoreText, getSortedPlayerOrderListForOnline } from "./index";

import type { OnlineGameWithSettings } from "./index";
import type { ComputedScoreProps, LogDBProps } from "@/models/games";

/**
 * AQL形式のスコア計算
 * 正解数がスコア、誤答で休み
 */
const computeAql = (
  game: OnlineGameWithSettings,
  playersState: ComputedScoreProps[],
  logs: LogDBProps[]
) => {
  const byId = new Map<string, ComputedScoreProps>(
    playersState.map((s) => [s.player_id, { ...s }])
  );

  logs.forEach((log, qn) => {
    const s = byId.get(log.player_id);
    if (!s) return;

    if (log.variant === "correct") {
      s.correct += 1;
      s.score = s.correct; // AQLではスコア=正解数
      s.last_correct = qn;
      s.is_incapacity = false; // 正解で復活
    } else if (log.variant === "wrong") {
      s.wrong += 1;
      s.last_wrong = qn;
      s.is_incapacity = true; // 誤答で休み
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

  // AQLは通常勝ち抜けがない形式
  return { scores: finalScores, winPlayers: [] } as const;
};

export default computeAql;
