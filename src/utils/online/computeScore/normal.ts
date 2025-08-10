import { generateScoreText, getSortedPlayerOrderListForOnline } from "./index";

import type { OnlineGameWithSettings } from "./index";
import type { ComputedScoreProps, LogDBProps } from "@/utils/types";

/**
 * Normal形式のスコア計算
 * 正答で+1、誤答で-1
 */
const computeNormal = (
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
      s.score += 1;
      s.last_correct = qn;
    } else if (log.variant === "wrong") {
      s.wrong += 1;
      s.score -= 1;
      s.last_wrong = qn;
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

  return { scores: finalScores, winPlayers: [] } as const;
};

export default computeNormal;
