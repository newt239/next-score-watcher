import { generateScoreText, getSortedPlayerOrderListForOnline } from "./index";

import type { OnlineGameWithSettings } from "./index";
import type { ComputedScoreProps, LogDBProps } from "@/utils/types";

/**
 * EndlessChance形式のスコア計算
 * 同じ問題に対して正答が出るまで複数人が回答できる
 */
const computeEndlessChance = (
  game: OnlineGameWithSettings,
  playersState: ComputedScoreProps[],
  logs: LogDBProps[]
) => {
  const winPoint = game.winPoint ?? 7;
  const losePoint = game.losePoint ?? 3;

  const byId = new Map<string, ComputedScoreProps>(
    playersState.map((s) => [s.player_id, { ...s }])
  );

  logs.forEach((log, qn) => {
    const s = byId.get(log.player_id);
    if (!s) return;

    if (log.variant === "correct") {
      s.correct += 1;
      s.score = s.correct;
      s.last_correct = qn;

      if (s.score >= winPoint) {
        s.state = "win";
      } else if (s.score === winPoint - 1) {
        s.reach_state = "win";
      }
    } else if (log.variant === "wrong") {
      s.wrong += 1;
      s.last_wrong = qn;

      if (s.wrong >= losePoint) {
        s.state = "lose";
      } else if (s.wrong === losePoint - 1) {
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

export default computeEndlessChance;
