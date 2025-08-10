import { generateScoreText, getSortedPlayerOrderListForOnline } from "./index";

import type { OnlineGameWithSettings } from "./index";
import type { ComputedScoreProps, LogDBProps } from "@/utils/types";

/**
 * NewYork形式のスコア計算
 * 正答で+1、誤答で-1、目標ポイントに到達で勝ち抜け
 */
const computeNy = (
  game: OnlineGameWithSettings,
  playersState: ComputedScoreProps[],
  logs: LogDBProps[]
) => {
  const target = game.targetPoint ?? 10;
  const losePoint = game.losePoint;

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
      if (s.score >= target) {
        s.state = "win";
      } else if (s.score === target - 1) {
        s.reach_state = "win";
      }
    } else if (log.variant === "wrong") {
      s.wrong += 1;
      s.score -= 1;
      s.last_wrong = qn;
      if (losePoint && s.wrong >= losePoint) {
        s.state = "lose";
      } else if (losePoint && s.wrong === losePoint - 1) {
        s.reach_state = "lose";
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

export default computeNy;
