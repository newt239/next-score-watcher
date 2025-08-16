import { generateScoreText, getSortedPlayerOrderListForOnline } from "./index";

import type {
  ComputedScoreProps,
  GetGameDetailResponseType,
} from "@/models/game";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

/**
 * Z形式のスコア計算
 * 5つのステージをクリアしていく形式
 */
const computeZ = (
  game: Extract<GetGameDetailResponseType, { ruleType: "z" }>,
  playersState: ComputedScoreProps[],
  logs: SeriarizedGameLog[]
) => {
  const byId = new Map<string, ComputedScoreProps>(
    playersState.map((s) => [s.player_id, { ...s, stage: 1 }])
  );

  logs.forEach((log, qn) => {
    const s = byId.get(log.playerId || "");
    if (!s || s.state !== "playing") return;

    const currentStage = s.stage;

    if (log.actionType === "correct") {
      s.correct += 1;
      s.last_correct = qn;

      // 各ステージのクリア条件をチェック
      let shouldClearStage = false;
      switch (currentStage) {
        case 1:
          shouldClearStage = s.correct >= 1;
          break;
        case 2:
          shouldClearStage = s.correct >= 2;
          break;
        case 3:
          shouldClearStage = s.correct >= 3;
          break;
        case 4:
          shouldClearStage = s.correct >= 4;
          break;
        default:
          shouldClearStage = false;
      }

      if (shouldClearStage) {
        if (currentStage === 4) {
          // ステージ5に到達で勝ち抜け
          s.state = "win";
          s.stage = 5;
        } else {
          // 次のステージへ
          s.stage = currentStage + 1;
        }

        // ステージクリア時に全員の状態をリセット
        for (const [otherId, otherState] of byId) {
          if (otherId !== log.playerId) {
            otherState.correct = 0;
            otherState.wrong = 0;
            otherState.state = "playing";
            otherState.reach_state = "playing";
            otherState.is_incapacity = false;
          }
        }

        // ステージクリア者の状態もリセット
        s.correct = 0;
        s.wrong = 0;
        s.is_incapacity = false;
      }
    } else if (log.actionType === "wrong") {
      s.wrong += 1;
      s.last_wrong = qn;

      // 各ステージの失格条件をチェック
      let shouldLose = false;
      switch (currentStage) {
        case 1:
          // ステージ1: 誤答で1問休み
          s.is_incapacity = true;
          break;
        case 2:
          shouldLose = s.wrong >= 1;
          break;
        case 3:
          shouldLose = s.wrong >= 2;
          break;
        case 4:
          shouldLose = s.wrong >= 3;
          break;
      }

      if (shouldLose) {
        s.state = "lose";
      }
    }

    // スコアはステージ番号とする
    s.score = s.stage;
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

export default computeZ;
