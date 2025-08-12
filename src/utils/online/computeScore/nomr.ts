import { generateScoreText, getSortedPlayerOrderListForOnline } from "./index";

import type {
  ComputedScoreProps,
  GetGameDetailResponseType,
} from "@/models/games";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

/**
 * NoMr形式のスコア計算
 * N回正解で勝ち抜け、誤答でM問休み
 */
const computeNomr = (
  game: Extract<GetGameDetailResponseType, { ruleType: "nomr" }>,
  playersState: ComputedScoreProps[],
  logs: SeriarizedGameLog[]
) => {
  const winPoint = game.option.winPoint ?? 7;
  const rest = game.option.restCount ?? 3;

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
      s.is_incapacity = true;
    }
  });

  // incapacity解除判定。最後の問題番号からの経過を確認
  const lastIndex = logs.length;
  for (const s of byId.values()) {
    if (s.is_incapacity && rest < lastIndex - s.last_wrong) {
      s.is_incapacity = false;
    }
  }

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

export default computeNomr;
