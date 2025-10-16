import { describe, expect, it } from "vitest";

import computeBackstream from "../backstream";
import {
  getInitialPlayersStateForOnline,
  getSortedPlayerOrderListForOnline,
} from "../index";

import type {
  ComputedScoreProps,
  GamePlayerProps,
  GetGameDetailResponseType,
} from "@/models/game";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

type BackstreamGame = Extract<
  GetGameDetailResponseType,
  { ruleType: "backstream" }
>;

/**
 * backstream形式のゲームデータを生成する。
 */
const createBackstreamGame = (
  players: GamePlayerProps[],
  logs: SeriarizedGameLog[]
): BackstreamGame => ({
  id: "game-backstream",
  name: "backstream",
  ruleType: "backstream" as const,
  option: {
    win_point: 10,
    lose_point: -10,
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
  initialScore: number,
  order: number
): GamePlayerProps => ({
  id,
  name: id,
  description: "",
  affiliation: "",
  displayOrder: order,
  initialScore,
  initialCorrectCount: initialScore,
  initialWrongCount: initialScore,
});

/**
 * 計算済みスコアを生成する。
 */
const createScoreState = (
  override: Partial<ComputedScoreProps>
): ComputedScoreProps => ({
  game_id: "game-backstream",
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

describe("online backstream形式", () => {
  it("初期化時に三角数ベースで誤答とスコアを設定する", () => {
    const initialScores = [0, 1, 2, 3, 4, 5, 6];
    const expectedWrongs = [0, 1, 3, 6, 10, 10, 10];
    const players = initialScores.map((value, index) =>
      createPlayer(`player-${index}`, value, index)
    );
    const game = createBackstreamGame(players, []);

    const initialStates = getInitialPlayersStateForOnline(game);

    expect(initialStates).toHaveLength(initialScores.length);
    initialStates.forEach((state, index) => {
      const expectedWrong = expectedWrongs[index];
      const expectedScore = initialScores[index] - expectedWrong;

      expect(state.player_id).toBe(`player-${index}`);
      expect(state.correct).toBe(initialScores[index]);
      expect(state.wrong).toBe(expectedWrong);
      expect(state.score).toBe(expectedScore);
    });
  });

  it("同点なら誤答数が少ないプレイヤーが上位になる", () => {
    const sorted = getSortedPlayerOrderListForOnline([
      createScoreState({
        player_id: "few-wrong",
        score: 5,
        wrong: 1,
        correct: 6,
      }),
      createScoreState({
        player_id: "many-wrong",
        score: 5,
        wrong: 3,
        correct: 6,
      }),
      createScoreState({
        player_id: "win-player",
        state: "win",
        score: 10,
        last_correct: 4,
      }),
    ]);

    expect(sorted).toEqual(["win-player", "few-wrong", "many-wrong"]);
  });

  it("正解と誤答ログに応じてスコアと状態が更新される", () => {
    const players = [createPlayer("player-1", 0, 0)];
    const logs: SeriarizedGameLog[] = [
      {
        id: "log-1",
        gameId: "game-backstream",
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
        gameId: "game-backstream",
        playerId: "player-1",
        questionNumber: 1,
        actionType: "wrong",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:02.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
      {
        id: "log-3",
        gameId: "game-backstream",
        playerId: "player-1",
        questionNumber: 2,
        actionType: "wrong",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:03.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
    ];

    const game = createBackstreamGame(players, logs);
    const initialStates = getInitialPlayersStateForOnline(game);
    const { scores } = computeBackstream(game, initialStates, logs);

    expect(scores[0]).toMatchObject({
      player_id: "player-1",
      score: -2,
      correct: 1,
      wrong: 2,
      last_correct: 0,
      last_wrong: 2,
      state: "playing",
    });
  });
});
