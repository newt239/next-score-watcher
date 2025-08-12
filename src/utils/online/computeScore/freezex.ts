import { generateScoreText, getSortedPlayerOrderListForOnline } from "./index";

import type {
  ComputedScoreProps,
  GetGameDetailResponseType,
} from "@/models/games";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

/**
 * FreezeX形式のスコア計算
 * X回正解で勝ち抜け、N回目の誤答でN回休み
 */
const computeFreezex = (
  game: Extract<GetGameDetailResponseType, { ruleType: "freezex" }>,
  playersState: ComputedScoreProps[],
  logs: SeriarizedGameLog[]
) => {
  const winPoint = game.option.win_point;

  const byId = new Map<string, ComputedScoreProps>(
    playersState.map((s) => [s.player_id, { ...s }])
  );

  logs.forEach((log, qn) => {
    const s = byId.get(log.playerId || "");
    if (!s) return;

    if (log.actionType === "correct") {
      s.correct += 1;
      s.score = s.correct;
      s.last_correct = qn;
      s.is_incapacity = false; // 正解で休み解除

      if (s.score >= winPoint) {
        s.state = "win";
      } else if (s.score === winPoint - 1) {
        s.reach_state = "win";
      }
    } else if (log.actionType === "wrong") {
      s.wrong += 1;
      s.last_wrong = qn;
      s.is_incapacity = true;

      // N回目の誤答でN回休みの管理は、
      // 実際の実装では問題番号と最後の誤答番号の差で管理
      // ここでは簡略化して誤答後は休み状態とする
    }
  });

  // 休み解除判定の簡略化版（実際はもっと複雑）
  const lastIndex = logs.length;
  for (const s of byId.values()) {
    if (s.is_incapacity && s.wrong > 0) {
      const restCount = s.wrong; // N回目の誤答でN回休み
      if (restCount < lastIndex - s.last_wrong) {
        s.is_incapacity = false;
      }
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

export default computeFreezex;
