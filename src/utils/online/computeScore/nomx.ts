import { generateScoreText, getSortedPlayerOrderListForOnline } from "./index";

import type {
  ComputedScoreProps,
  GetGameDetailResponseType,
} from "@/models/games";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

/**
 * NoMx形式のスコア計算
 * N回正解で勝ち抜け、M回誤答で失格
 */
const computeNomx = (
  game: Extract<GetGameDetailResponseType, { ruleType: "nomx" }>,
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
      s.last_correct = qn;
      if (s.correct >= winPoint) {
        s.state = "win";
      } else if (s.correct === winPoint - 1) {
        s.reach_state = "win";
      }
    } else if (log.actionType === "wrong") {
      s.wrong += 1;
      s.last_wrong = qn;
      if (s.wrong >= losePoint) {
        s.state = "lose";
      } else if (s.wrong === losePoint - 1 && s.correct !== winPoint - 1) {
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

export default computeNomx;
