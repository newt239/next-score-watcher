import { describe, expect, it } from "vitest";

import {
  generateScoreText,
  getInitialPlayersStateForOnline,
  getSortedPlayerOrderListForOnline,
} from "../index";
import computeNy from "../ny";

import type { ComputedScoreProps, GamePlayerProps, GetGameDetailResponseType } from "@/models/game";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

type NyGame = Extract<GetGameDetailResponseType, { ruleType: "ny" }>;

/**
 * ny形式のゲームデータを生成する。
 */
const createNyGame = (
  players: GamePlayerProps[],
  logs: SeriarizedGameLog[],
  targetPoint = 3,
  losePoint = 0
): NyGame => ({
  id: "game-ny",
  name: "ny",
  ruleType: "ny" as const,
  option: {
    win_point: targetPoint,
    lose_point: losePoint,
    target_point: targetPoint,
  },
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  deletedAt: null,
  discordWebhookUrl: null,
  isPublic: false,
  userId: "user-1",
  players,
  logs,
});

/**
 * ゲーム参加者を生成する。
 */
const createPlayer = (
  id: string,
  initialScore: number | null,
  displayOrder: number
): GamePlayerProps => ({
  id,
  name: id,
  description: "",
  affiliation: "",
  displayOrder,
  initialScore,
  initialCorrectCount: initialScore,
  initialWrongCount: initialScore,
});

/**
 * 計算済みスコアを生成する。
 */
const createScoreState = (override: Partial<ComputedScoreProps>): ComputedScoreProps => ({
  game_id: "game-ny",
  player_id: "player-base",
  state: "playing",
  reach_state: "playing",
  score: 0,
  correct: 0,
  wrong: 0,
  last_correct: -10,
  last_wrong: -10,
  odd_score: 0,
  even_score: 0,
  stage: 1,
  is_incapacity: false,
  order: 0,
  text: "",
  ...override,
});

describe("online ny形式", () => {
  it("初期化時はスコア0で正解数・誤答数のみinitialScoreを踏襲する", () => {
    const players = [createPlayer("player-1", 2, 0), createPlayer("player-2", null, 1)];
    const game = createNyGame(players, []);

    const initialStates = getInitialPlayersStateForOnline(game);

    expect(initialStates).toHaveLength(2);
    expect(initialStates[0]).toMatchObject({
      player_id: "player-1",
      score: 0,
      correct: 2,
      wrong: 2,
      reach_state: "playing",
      state: "playing",
    });
    expect(initialStates[1]).toMatchObject({
      player_id: "player-2",
      score: 0,
      correct: 0,
      wrong: 0,
      reach_state: "playing",
      state: "playing",
    });
  });

  it("勝敗未確定時は正解数優先で並び替える", () => {
    const sorted = getSortedPlayerOrderListForOnline([
      createScoreState({
        player_id: "score-high",
        score: 3,
        correct: 3,
      }),
      createScoreState({
        player_id: "score-low",
        score: 1,
        correct: 1,
      }),
      createScoreState({
        player_id: "equal-score-correct-high",
        score: 2,
        correct: 4,
        wrong: 1,
      }),
      createScoreState({
        player_id: "equal-score-correct-low",
        score: 2,
        correct: 2,
        wrong: 0,
      }),
    ]);

    expect(sorted).toEqual([
      "score-high",
      "equal-score-correct-high",
      "equal-score-correct-low",
      "score-low",
    ]);
  });

  it("generateScoreTextは通常時にスコア値を返す", () => {
    const score = createScoreState({
      player_id: "player-1",
      score: 5,
    });

    expect(generateScoreText(score, 0)).toBe("5");
  });

  it("目標スコア到達で勝利し最新ログが勝者を記録する", () => {
    const players = [createPlayer("player-1", 0, 0)];
    const logs: SeriarizedGameLog[] = [
      {
        id: "log-1",
        gameId: "game-ny",
        playerId: "player-1",
        questionNumber: 0,
        actionType: "correct",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:01.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
      {
        id: "log-2",
        gameId: "game-ny",
        playerId: "player-1",
        questionNumber: 1,
        actionType: "correct",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:02.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
    ];

    const game = createNyGame(players, logs, 2, 0);
    const initialStates = getInitialPlayersStateForOnline(game);
    const result = computeNy(game, initialStates, logs);

    expect(result.scores[0]).toMatchObject({
      player_id: "player-1",
      score: 2,
      state: "win",
      text: "1st",
    });
    expect(result.winPlayers).toEqual([
      {
        player_id: "player-1",
        text: "1st",
      },
    ]);
  });

  it("敗退ポイントに達するとLOSE表示になる", () => {
    const players = [createPlayer("player-1", 0, 0)];
    const logs: SeriarizedGameLog[] = [
      {
        id: "log-1",
        gameId: "game-ny",
        playerId: "player-1",
        questionNumber: 0,
        actionType: "wrong",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:01.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
      {
        id: "log-2",
        gameId: "game-ny",
        playerId: "player-1",
        questionNumber: 1,
        actionType: "wrong",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:02.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
    ];

    const game = createNyGame(players, logs, 3, 2);
    const initialStates = getInitialPlayersStateForOnline(game);
    const result = computeNy(game, initialStates, logs);

    expect(result.scores[0]).toMatchObject({
      player_id: "player-1",
      score: -2,
      wrong: 2,
      state: "lose",
      text: "LOSE",
    });
  });
});
