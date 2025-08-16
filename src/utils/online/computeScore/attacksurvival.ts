import { generateScoreText, getSortedPlayerOrderListForOnline } from "./index";

import type {
  ComputedScoreProps,
  GetGameDetailResponseType,
} from "@/models/game";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

/**
 * AttackSurvival形式のスコア計算
 * 正解で他のプレイヤーのポイントを減らし、誤答で自分のポイントが減る
 */
const computeAttackSurvival = (
  game: Extract<GetGameDetailResponseType, { ruleType: "attacksurvival" }>,
  playersState: ComputedScoreProps[],
  logs: SeriarizedGameLog[]
) => {
  const correctMe = game.option.correct_me; // 正解時の自分への影響
  const wrongMe = game.option.wrong_me; // 誤答時の自分への影響
  const correctOther = game.option.correct_other; // 正解時の他プレイヤーへの影響
  const wrongOther = game.option.wrong_other; // 誤答時の他プレイヤーへの影響
  const winThrough = game.option.win_through; // 勝ち抜け人数

  const byId = new Map<string, ComputedScoreProps>(
    playersState.map((s) => [s.player_id, { ...s }])
  );

  let winCount = 0;

  logs.forEach((log, qn) => {
    const s = byId.get(log.playerId || "");
    if (!s) return;

    if (log.actionType === "correct") {
      // 正解者自身の処理
      const newScore = s.score + correctMe;
      s.correct += 1;
      s.score = newScore;
      s.last_correct = qn;

      // 他のプレイヤーのポイントを減らす
      for (const [otherId, otherState] of byId) {
        if (otherId !== log.playerId && otherState.state === "playing") {
          const otherNewScore = otherState.score + correctOther;
          otherState.score = otherNewScore;

          if (otherNewScore <= 0) {
            otherState.state = "lose";
          } else if (otherNewScore + wrongMe <= 0) {
            otherState.reach_state = "lose";
          }
        }
      }

      // 正解者の状態確認
      if (newScore + wrongMe <= 0) {
        s.reach_state = "lose";
      }

      // 勝ち抜け判定: 上位3名が決まったら勝ち抜け
      const currentLose = [...byId.values()].filter(
        (p) => p.state === "lose"
      ).length;
      const totalPlayers = byId.size;

      if (totalPlayers - currentLose <= winThrough && winCount < winThrough) {
        // スコア順で勝ち抜けを決める
        const remainingPlayers = [...byId.values()]
          .filter((p) => p.state === "playing")
          .sort((a, b) => b.score - a.score);

        for (
          let i = 0;
          i < Math.min(winThrough - winCount, remainingPlayers.length);
          i++
        ) {
          remainingPlayers[i].state = "win";
          winCount++;
        }
      }
    } else if (log.actionType === "wrong") {
      // 誤答者自身の処理
      const newScore = s.score + wrongMe;
      s.wrong += 1;
      s.score = newScore;
      s.last_wrong = qn;

      if (newScore <= 0) {
        s.state = "lose";
      } else if (newScore + wrongMe <= 0) {
        s.reach_state = "lose";
      }

      // 他のプレイヤーへの影響
      for (const [otherId, otherState] of byId) {
        if (otherId !== log.playerId && otherState.state === "playing") {
          const otherNewScore = otherState.score + wrongOther;
          otherState.score = otherNewScore;

          if (otherNewScore <= 0) {
            otherState.state = "lose";
          } else if (otherNewScore + wrongMe <= 0) {
            otherState.reach_state = "lose";
          }
        }
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

export default computeAttackSurvival;
