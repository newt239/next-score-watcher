import { describe, expect, it } from "vitest";

import {
  generateScoreText,
  getInitialPlayersStateForOnline,
  getSortedPlayerOrderListForOnline,
} from "../index";
import computeNomxAd from "../nomx-ad";

import type {
  ComputedScoreProps,
  GamePlayerProps,
  GetGameDetailResponseType,
} from "@/models/game";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

type NomxAdGame = Extract<GetGameDetailResponseType, { ruleType: "nomx-ad" }>;

/**
 * nomx-ad形式のゲームデータを生成する。
 */
const createNomxAdGame = (
  players: GamePlayerProps[],
  logs: SeriarizedGameLog[],
  winPoint = 4,
  losePoint = 2
): NomxAdGame => ({
  id: "game-nomx-ad",
  name: "nomx-ad",
  ruleType: "nomx-ad" as const,
  option: {
    win_point: winPoint,
    lose_point: losePoint,
    streak_over3: true,
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
const createScoreState = (
  override: Partial<ComputedScoreProps>
): ComputedScoreProps => ({
  game_id: "game-nomx-ad",
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

describe("online nomx-ad形式", () => {
  it("初期状態で全員stage=1かつscoreはinitialScoreに一致する", () => {
    const players = [
      createPlayer("player-1", 2, 0),
      createPlayer("player-2", null, 1),
    ];
    const game = createNomxAdGame(players, []);

    const initialStates = getInitialPlayersStateForOnline(game);

    expect(initialStates[0]).toMatchObject({
      player_id: "player-1",
      score: 2,
      stage: 1,
      state: "playing",
      reach_state: "playing",
    });
    expect(initialStates[1]).toMatchObject({
      player_id: "player-2",
      score: 0,
      stage: 1,
      state: "playing",
    });
  });

  it("ソートは勝者の次にアドバンテージ保持者とスコアが高いプレイヤーを優先する", () => {
    const sorted = getSortedPlayerOrderListForOnline([
      createScoreState({
        player_id: "winner",
        state: "win",
        score: 5,
        last_correct: 1,
      }),
      createScoreState({
        player_id: "ad-player",
        stage: 2,
        score: 4,
        correct: 4,
      }),
      createScoreState({
        player_id: "higher-score",
        score: 6,
        correct: 5,
      }),
      createScoreState({
        player_id: "lower-score",
        score: 3,
        correct: 3,
      }),
    ]);

    expect(sorted).toEqual([
      "winner",
      "ad-player",
      "higher-score",
      "lower-score",
    ]);
  });

  it("同一プレイヤーの連答でアドバンテージが付与され他者の正解で解除される", () => {
    const players = [
      createPlayer("player-1", 0, 0),
      createPlayer("player-2", 0, 1),
    ];
    const logs: SeriarizedGameLog[] = [
      {
        id: "log-1",
        gameId: "game-nomx-ad",
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
        gameId: "game-nomx-ad",
        playerId: "player-1",
        questionNumber: 1,
        actionType: "correct",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:02.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
      {
        id: "log-3",
        gameId: "game-nomx-ad",
        playerId: "player-2",
        questionNumber: 2,
        actionType: "correct",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:03.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
    ];

    const game = createNomxAdGame(players, logs, 7, 3);
    const initialStates = getInitialPlayersStateForOnline(game);
    const result = computeNomxAd(game, initialStates, logs);

    const player1 = result.scores.find((s) => s.player_id === "player-1");
    const player2 = result.scores.find((s) => s.player_id === "player-2");

    expect(player1).toMatchObject({
      score: 2,
      stage: 1,
      correct: 2,
    });
    expect(player2).toMatchObject({
      score: 1,
      stage: 1,
      correct: 1,
    });
  });

  it("連続正解で勝ち抜け条件を満たすと順位テキストが付与される", () => {
    const players = [createPlayer("player-1", 0, 0)];
    const logs: SeriarizedGameLog[] = [
      {
        id: "log-1",
        gameId: "game-nomx-ad",
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
        gameId: "game-nomx-ad",
        playerId: "player-1",
        questionNumber: 1,
        actionType: "correct",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:02.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
      {
        id: "log-3",
        gameId: "game-nomx-ad",
        playerId: "player-1",
        questionNumber: 2,
        actionType: "correct",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:03.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
      {
        id: "log-4",
        gameId: "game-nomx-ad",
        playerId: "player-1",
        questionNumber: 3,
        actionType: "correct",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:04.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
    ];

    const game = createNomxAdGame(players, logs, 4, 2);
    const initialStates = getInitialPlayersStateForOnline(game);
    const result = computeNomxAd(game, initialStates, logs);

    expect(result.scores[0]).toMatchObject({
      player_id: "player-1",
      score: 4,
      correct: 4,
      stage: 2,
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

  it("誤答を重ねるとアドバンテージが解除され失格状態になる", () => {
    const players = [createPlayer("player-1", 0, 0)];
    const logs: SeriarizedGameLog[] = [
      {
        id: "log-1",
        gameId: "game-nomx-ad",
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
        gameId: "game-nomx-ad",
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
        gameId: "game-nomx-ad",
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

    const game = createNomxAdGame(players, logs, 5, 2);
    const initialStates = getInitialPlayersStateForOnline(game);
    const result = computeNomxAd(game, initialStates, logs);

    expect(result.scores[0]).toMatchObject({
      player_id: "player-1",
      score: 1,
      wrong: 2,
      stage: 1,
      state: "lose",
      text: "LOSE",
    });
    expect(generateScoreText(result.scores[0], result.scores[0].order)).toBe(
      "LOSE"
    );
  });
});
