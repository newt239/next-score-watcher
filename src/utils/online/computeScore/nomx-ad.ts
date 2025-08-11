import { generateScoreText, getSortedPlayerOrderListForOnline } from "./index";

import type { OnlineGameWithSettings } from "./index";
import type { ComputedScoreProps, LogDBProps } from "@/models/games";

/**
 * NomxAd形式のスコア計算
 * N回正解で勝ち抜け、M回誤答で失格、連答でアドバンテージ
 * stageの値が2のときアドバンテージ状態を表す
 */
const computeNomxAd = (
  game: OnlineGameWithSettings,
  playersState: ComputedScoreProps[],
  logs: LogDBProps[]
) => {
  const winPoint = game.winPoint ?? 7;
  const losePoint = game.losePoint ?? 3;
  const streakOver3 = true; // オプション: 3連答以上でアドバンテージ

  const byId = new Map<string, ComputedScoreProps>(
    playersState.map((s) => [s.player_id, { ...s }])
  );

  let lastCorrectPlayer: string = "";

  logs.forEach((log, qn) => {
    const s = byId.get(log.player_id);
    if (!s) return;

    if (log.variant === "correct") {
      const isAd = s.stage === 2;
      const newScore = s.score + (isAd ? 2 : 1);
      const nextAd =
        (!streakOver3 && s.stage === 1) ||
        (streakOver3 && lastCorrectPlayer === s.player_id);

      s.correct += 1;
      s.score = newScore;
      s.last_correct = qn;
      s.stage = nextAd ? 2 : 1;
      lastCorrectPlayer = s.player_id;

      if (newScore >= winPoint) {
        s.state = "win";
      } else if (newScore === winPoint - 1) {
        s.reach_state = "win";
      }
    } else if (log.variant === "wrong") {
      s.wrong += 1;
      s.last_wrong = qn;
      s.stage = 1; // 誤答でアドバンテージ解除

      if (lastCorrectPlayer === s.player_id) {
        lastCorrectPlayer = "";
      }

      if (s.wrong >= losePoint) {
        s.state = "lose";
      } else if (s.wrong === losePoint - 1) {
        s.reach_state = "lose";
      }
    }

    // 他のプレイヤーのアドバンテージ解除
    if (log.variant === "correct") {
      for (const [otherId, otherState] of byId) {
        if (otherId !== log.player_id && otherState.stage === 2) {
          otherState.stage = 1;
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

export default computeNomxAd;
