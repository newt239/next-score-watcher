import { generateScoreText, getSortedPlayerOrderListForOnline } from "./index";

import type {
  ComputedScoreProps,
  GetGameDetailResponseType,
} from "@/models/game";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

/**
 * Backstream形式のスコア計算
 * 正答で+1、n回目の誤答で-n、目標ポイントで勝ち抜け
 */
const computeBackstream = (
  game: Extract<GetGameDetailResponseType, { ruleType: "backstream" }>,
  playersState: ComputedScoreProps[],
  logs: SeriarizedGameLog[]
) => {
  const winPoint = game.option.win_point;
  const losePoint = game.option.lose_point;

  const byId = new Map<string, ComputedScoreProps>(
    playersState.map((s) => [s.player_id, { ...s }])
  );

  logs.forEach((log, qn) => {
    const s = byId.get(log.playerId || "");
    if (!s) return;

    if (log.actionType === "correct") {
      s.correct += 1;
      s.score += 1;
      s.last_correct = qn;

      if (s.score >= winPoint) {
        s.state = "win";
      } else if (s.score === winPoint - 1) {
        s.reach_state = "win";
      }
    } else if (log.actionType === "wrong") {
      const newWrong = s.wrong + 1;
      const newScore = s.score - newWrong;

      s.wrong = newWrong;
      s.score = newScore;
      s.last_wrong = qn;

      if (newScore <= losePoint) {
        s.state = "lose";
      } else if (newScore === losePoint + 1) {
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

export default computeBackstream;
