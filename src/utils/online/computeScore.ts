import type {
  ComputedScoreProps,
  GameDBPlayerProps,
  LogDBProps,
  RuleNames,
  States,
} from "@/utils/types";

export type OnlineGameCore = {
  id: string;
  name: string;
  ruleType: RuleNames;
};

export type OnlineSettings = {
  winPoint?: number;
  losePoint?: number;
  targetPoint?: number;
  restCount?: number;
};

/**
 * オンライン版のスコア計算（独立実装）
 * - 対応: nomx, ny, nomr, normal（最低限）
 * - 未対応形式はスコア0のまま返す
 */
export const computeOnlineScore = (
  game: OnlineGameCore,
  players: GameDBPlayerProps[],
  logs: LogDBProps[],
  settings?: OnlineSettings
) => {
  const initial: ComputedScoreProps[] = players.map((p) => ({
    game_id: game.id,
    player_id: p.id,
    score: p.initial_correct - p.initial_wrong,
    correct: p.initial_correct,
    wrong: p.initial_wrong,
    last_correct: -10,
    last_wrong: -10,
    state: "playing",
    reach_state: "playing",
    odd_score: 0,
    even_score: 0,
    stage: 1,
    is_incapacity: false,
    order: 0,
    text: "",
  }));

  const byId = new Map<string, ComputedScoreProps>(
    initial.map((s) => [s.player_id, { ...s }])
  );

  const pushOrderAndText = (scores: ComputedScoreProps[]) => {
    const sorted = [...scores].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.correct !== a.correct) return b.correct - a.correct;
      return a.wrong - b.wrong;
    });
    const orderIds = sorted.map((s) => s.player_id);
    return scores.map((s) => ({
      ...s,
      order: orderIds.findIndex((id) => id === s.player_id),
      text:
        s.state === "win"
          ? ordinal(orderIds.findIndex((id) => id === s.player_id))
          : s.state === "lose"
            ? "LOSE"
            : String(s.score),
    }));
  };

  switch (game.ruleType) {
    case "nomx": {
      const winPoint = settings?.winPoint ?? 7;
      const losePoint = settings?.losePoint ?? 3;
      logs.forEach((log, qn) => {
        const s = byId.get(log.player_id);
        if (!s) return;
        if (log.variant === "correct") {
          s.correct += 1;
          s.last_correct = qn;
          if (s.correct >= winPoint) s.state = "win";
          if (s.correct + 1 === winPoint) s.reach_state = "win";
        } else if (log.variant === "wrong") {
          s.wrong += 1;
          s.last_wrong = qn;
          if (s.wrong >= losePoint) s.state = "lose";
          if (s.wrong + 1 === losePoint && s.correct + 1 !== winPoint)
            s.reach_state = "lose";
        }
      });
      const scores = pushOrderAndText([...byId.values()]);
      const winPlayers = scores
        .filter((s) => s.state === "win")
        .filter(() => logs.length > 0)
        .filter((s) => s.last_correct === logs.length - 1)
        .map((s) => ({ player_id: s.player_id, text: s.text }));
      return { scores, winPlayers } as const;
    }
    case "ny": {
      const target = settings?.targetPoint ?? 10;
      const losePoint = settings?.losePoint; // 省略可
      logs.forEach((log, qn) => {
        const s = byId.get(log.player_id);
        if (!s) return;
        if (log.variant === "correct") {
          s.correct += 1;
          s.score += 1;
          s.last_correct = qn;
          if (s.score >= target) s.state = "win";
          if (s.score === target - 1) s.reach_state = "win";
        } else if (log.variant === "wrong") {
          s.wrong += 1;
          s.score -= 1;
          s.last_wrong = qn;
          if (losePoint && s.wrong >= losePoint) s.state = "lose";
          if (losePoint && s.wrong === losePoint - 1) s.reach_state = "lose";
        }
      });
      const scores = pushOrderAndText([...byId.values()]);
      const winPlayers = scores
        .filter((s) => s.state === "win")
        .filter(() => logs.length > 0)
        .filter((s) => s.last_correct === logs.length - 1)
        .map((s) => ({ player_id: s.player_id, text: s.text }));
      return { scores, winPlayers } as const;
    }
    case "nomr": {
      const winPoint = settings?.winPoint ?? 7;
      const rest = settings?.restCount ?? 3;
      logs.forEach((log, qn) => {
        const s = byId.get(log.player_id);
        if (!s) return;
        if (log.variant === "correct") {
          s.correct += 1;
          s.last_correct = qn;
          if (s.correct >= winPoint) s.state = "win";
          if (s.correct + 1 === winPoint) s.reach_state = "win";
        } else if (log.variant === "wrong") {
          s.wrong += 1;
          s.last_wrong = qn;
          s.is_incapacity = true;
        }
      });
      // incapacity解除判定（最後の問題番号からの経過）
      const lastIndex = logs.length;
      for (const s of byId.values()) {
        if (s.is_incapacity && rest < lastIndex - s.last_wrong) {
          s.is_incapacity = false;
        }
      }
      const scores = pushOrderAndText([...byId.values()]);
      const winPlayers = scores
        .filter((s) => s.state === "win")
        .filter(() => logs.length > 0)
        .filter((s) => s.last_correct === logs.length - 1)
        .map((s) => ({ player_id: s.player_id, text: s.text }));
      return { scores, winPlayers } as const;
    }
    case "aql": {
      // AQL形式: スコア = 正解数、誤答で休み
      logs.forEach((log, qn) => {
        const s = byId.get(log.player_id);
        if (!s) return;
        if (log.variant === "correct") {
          s.correct += 1;
          s.score = s.correct; // AQLではスコア=正解数
          s.last_correct = qn;
          s.is_incapacity = false; // 正解で復活
        } else if (log.variant === "wrong") {
          s.wrong += 1;
          s.last_wrong = qn;
          s.is_incapacity = true; // 誤答で休み
        }
      });
      const scores = pushOrderAndText([...byId.values()]);
      return { scores, winPlayers: [] } as const;
    }
    case "normal": {
      // 最低限: correct=+1, wrong=-1 で加算
      logs.forEach((log, qn) => {
        const s = byId.get(log.player_id);
        if (!s) return;
        if (log.variant === "correct") {
          s.correct += 1;
          s.score += 1;
          s.last_correct = qn;
        } else if (log.variant === "wrong") {
          s.wrong += 1;
          s.score -= 1;
          s.last_wrong = qn;
        }
      });
      const scores = pushOrderAndText([...byId.values()]);
      return { scores, winPlayers: [] } as const;
    }
    default:
      const scores = pushOrderAndText([...byId.values()]);
      return { scores, winPlayers: [] } as const;
  }
};

const ordinal = (idx: number): string => {
  const n = idx + 1;
  const mod10 = n % 10;
  if (mod10 === 1) return `${n}st`;
  if (mod10 === 2) return `${n}nd`;
  if (mod10 === 3) return `${n}rd`;
  return `${n}th`;
};

export type { States };
