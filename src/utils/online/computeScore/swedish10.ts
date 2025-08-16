import { generateScoreText, getSortedPlayerOrderListForOnline } from "./index";

import type {
  ComputedScoreProps,
  GetGameDetailResponseType,
} from "@/models/games";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

/**
 * Swedish10形式のスコア計算
 * 正答数に応じて誤答時のダメージポイントが変動
 */
const computeSwedish10 = (
  game: Extract<GetGameDetailResponseType, { ruleType: "swedish10" }>,
  playersState: ComputedScoreProps[],
  logs: SeriarizedGameLog[]
) => {
  const winPoint = game.option.win_point;
  const losePoint = game.option.lose_point;

  const byId = new Map<string, ComputedScoreProps>(
    playersState.map((s) => [s.player_id, { ...s, score: 0, wrong: 0 }]) // Swedish10は誤答ダメージを管理
  );

  logs.forEach((log, qn) => {
    const s = byId.get(log.playerId || "");
    if (!s) return;

    if (log.actionType === "correct") {
      s.correct += 1;
      s.score = s.correct; // Swedish10ではスコア=正解数
      s.last_correct = qn;

      if (s.score >= winPoint) {
        s.state = "win";
      } else if (s.score === winPoint - 1) {
        s.reach_state = "win";
      }
    } else if (log.actionType === "wrong") {
      const currentCorrect = s.correct;
      let damage = 0;

      // 正答数に応じたダメージ計算
      if (currentCorrect === 0) damage = 1;
      else if (currentCorrect >= 1 && currentCorrect <= 2) damage = 2;
      else if (currentCorrect >= 3 && currentCorrect <= 5) damage = 3;
      else if (currentCorrect >= 6 && currentCorrect <= 9) damage = 4;

      const newWrongDamage = s.wrong + damage;
      s.wrong = newWrongDamage;
      s.last_wrong = qn;

      if (newWrongDamage >= losePoint) {
        s.state = "lose";
      } else if (newWrongDamage + damage >= losePoint) {
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

export default computeSwedish10;
