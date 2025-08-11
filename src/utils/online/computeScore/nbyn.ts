import { generateScoreText, getSortedPlayerOrderListForOnline } from "./index";

import type { OnlineGameWithSettings } from "./index";
import type { ComputedScoreProps, LogDBProps } from "@/models/games";

/**
 * NbyN形式のスコア計算
 * 正答数と誤答数の積を競う形式
 * 積がNの2乗に達したら勝ち抜け
 */
const computeNbyn = (
  game: OnlineGameWithSettings,
  playersState: ComputedScoreProps[],
  logs: LogDBProps[]
) => {
  const winPoint = game.winPoint ?? 5;
  const targetProduct = winPoint * winPoint; // Nの2乗

  const byId = new Map<string, ComputedScoreProps>(
    playersState.map((s) => {
      // NbyNの初期値: 正答数=0, 誤答数=N
      return [
        s.player_id,
        {
          ...s,
          correct: 0,
          wrong: winPoint,
          score: 0 * winPoint, // 積をスコアとする
        },
      ];
    })
  );

  logs.forEach((log, qn) => {
    const s = byId.get(log.player_id);
    if (!s) return;

    if (log.variant === "correct") {
      s.correct += 1;
      s.score = s.correct * s.wrong; // 積を再計算
      s.last_correct = qn;

      if (s.score >= targetProduct) {
        s.state = "win";
      } else if (s.score === targetProduct - 1) {
        s.reach_state = "win";
      }
    } else if (log.variant === "wrong") {
      s.wrong += 1;
      s.score = s.correct * s.wrong; // 積を再計算
      s.last_wrong = qn;

      if (s.score >= targetProduct) {
        s.state = "win";
      } else if (s.score === targetProduct - 1) {
        s.reach_state = "win";
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
    .filter(
      (s) =>
        s.last_correct === logs.length - 1 || s.last_wrong === logs.length - 1
    )
    .map((s) => ({ player_id: s.player_id, text: s.text }));

  return { scores: finalScores, winPlayers } as const;
};

export default computeNbyn;
