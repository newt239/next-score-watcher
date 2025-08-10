import { generateScoreText, getSortedPlayerOrderListForOnline } from "./index";

import type { OnlineGameWithSettings } from "./index";
import type { ComputedScoreProps, LogDBProps } from "@/utils/types";

/**
 * SquareX形式のスコア計算
 * 奇数問目と偶数問目の正解数をかけた数がX以上で勝ち抜け
 */
const computeSquarex = (
  game: OnlineGameWithSettings,
  playersState: ComputedScoreProps[],
  logs: LogDBProps[]
) => {
  const winPoint = game.winPoint ?? 16;

  const byId = new Map<string, ComputedScoreProps>(
    playersState.map((s) => [s.player_id, { ...s, correct: 0 }])
  );

  logs.forEach((log, qn) => {
    const s = byId.get(log.player_id);
    if (!s) return;

    if (log.variant === "correct") {
      s.correct += 1;

      // 奇数問目か偶数問目かを判定（問題番号は0から始まるので+1して判定）
      if ((qn + 1) % 2 === 1) {
        // 奇数問目
        s.odd_score += 1;
      } else {
        // 偶数問目
        s.even_score += 1;
      }

      s.score = s.odd_score * s.even_score;
      s.last_correct = qn;

      if (s.score >= winPoint) {
        s.state = "win";
      } else {
        // 次の正解で勝ち抜けるかどうかをチェック
        const nextQuestionIsOdd = (qn + 2) % 2 === 1;
        const nextOdd = s.odd_score + (nextQuestionIsOdd ? 1 : 0);
        const nextEven = s.even_score + (nextQuestionIsOdd ? 0 : 1);
        if (nextOdd * nextEven >= winPoint) {
          s.reach_state = "win";
        }
      }
    } else if (log.variant === "wrong") {
      s.wrong += 1;
      s.last_wrong = qn;
      // SquareXでは誤答による失格はない
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

export default computeSquarex;
