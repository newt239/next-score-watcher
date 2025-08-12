import { generateScoreText, getSortedPlayerOrderListForOnline } from "./index";

import type {
  ComputedScoreProps,
  GetGameDetailResponseType,
} from "@/models/games";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

/**
 * Divide形式のスコア計算
 * 正解で+10pt、誤答回数に応じて割る数が増加
 */
const computeDivide = (
  game: Extract<GetGameDetailResponseType, { ruleType: "divide" }>,
  playersState: ComputedScoreProps[],
  logs: SeriarizedGameLog[]
) => {
  const winPoint = game.option.targetPoint ?? 100;
  const correctPoints = game.option.targetPoint ?? 10;

  const byId = new Map<string, ComputedScoreProps>(
    playersState.map((s) => [s.player_id, { ...s }])
  );

  logs.forEach((log, qn) => {
    const s = byId.get(log.playerId || "");
    if (!s) return;

    if (log.actionType === "correct") {
      s.correct += 1;

      // 正解時のポイント計算: 基本ポイント / (誤答回数 + 1)
      const basePoints = s.correct * correctPoints;
      const divisor = s.wrong === 0 ? 1 : s.wrong;
      s.score = Math.floor(basePoints / divisor);
      s.last_correct = qn;

      if (s.score >= winPoint) {
        s.state = "win";
      } else if (s.score >= winPoint - correctPoints) {
        s.reach_state = "win";
      }
    } else if (log.actionType === "wrong") {
      s.wrong += 1;

      // 誤答時のポイント再計算
      const basePoints = s.correct * correctPoints;
      const divisor = s.wrong;
      s.score =
        basePoints > 0 && divisor > 0 ? Math.floor(basePoints / divisor) : 0;
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

  const winPlayers = finalScores
    .filter((s) => s.state === "win")
    .filter(() => logs.length > 0)
    .filter((s) => s.last_correct === logs.length - 1)
    .map((s) => ({ player_id: s.player_id, text: s.text }));

  return { scores: finalScores, winPlayers } as const;
};

export default computeDivide;
