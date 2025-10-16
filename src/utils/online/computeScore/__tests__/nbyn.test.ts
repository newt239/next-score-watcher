import { describe, expect, it } from "vitest";

import {
  generateScoreText,
  getInitialPlayersStateForOnline,
  getSortedPlayerOrderListForOnline,
} from "../index";
import computeNbyn from "../nbyn";

import type {
  ComputedScoreProps,
  GamePlayerProps,
  GetGameDetailResponseType,
} from "@/models/game";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

type NbynGame = Extract<GetGameDetailResponseType, { ruleType: "nbyn" }>;

/**
 * nbyn形式のゲームデータを生成する。
 */
const createNbynGame = (
  players: GamePlayerProps[],
  logs: SeriarizedGameLog[],
  winPoint = 5
): NbynGame => ({
  id: "game-nbyn",
  name: "nbyn",
  ruleType: "nbyn" as const,
  option: {
    win_point: winPoint,
    lose_point: winPoint,
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
  game_id: "game-nbyn",
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

describe("online nbyn形式", () => {
  it("初期状態は全員score=0でstageやreach_stateがplaying", () => {
    const players = [
      createPlayer("player-1", 2, 0),
      createPlayer("player-2", null, 1),
    ];
    const game = createNbynGame(players, []);

    const initialStates = getInitialPlayersStateForOnline(game);

    expect(initialStates).toHaveLength(2);
    initialStates.forEach((state) => {
      expect(state).toMatchObject({
        score: 0,
        reach_state: "playing",
        state: "playing",
        stage: 1,
        is_incapacity: false,
        odd_score: 0,
        even_score: 0,
      });
    });
  });

  it("ソートは勝者優先、その後スコア・正解数・誤答数で整列する", () => {
    const sorted = getSortedPlayerOrderListForOnline([
      createScoreState({
        player_id: "winner-fast",
        state: "win",
        score: 25,
        last_correct: 2,
      }),
      createScoreState({
        player_id: "winner-slow",
        state: "win",
        score: 25,
        last_correct: 5,
      }),
      createScoreState({
        player_id: "score-high",
        score: 16,
        correct: 4,
        wrong: 1,
      }),
      createScoreState({
        player_id: "score-mid",
        score: 12,
        correct: 4,
        wrong: 2,
      }),
      createScoreState({
        player_id: "score-equal-correct",
        score: 12,
        correct: 5,
        wrong: 3,
      }),
      createScoreState({
        player_id: "score-equal-wrong",
        score: 12,
        correct: 5,
        wrong: 1,
      }),
    ]);

    expect(sorted).toEqual([
      "winner-fast",
      "winner-slow",
      "score-high",
      "score-equal-wrong",
      "score-equal-correct",
      "score-mid",
    ]);
  });

  it("正答・誤答ログに応じて積スコアを再計算し勝利者を抽出する", () => {
    const players = [createPlayer("player-1", 0, 0)];
    const logs: SeriarizedGameLog[] = [
      {
        id: "log-1",
        gameId: "game-nbyn",
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
        gameId: "game-nbyn",
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
        gameId: "game-nbyn",
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
        gameId: "game-nbyn",
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

    const game = createNbynGame(players, logs, 3);
    const initialStates = getInitialPlayersStateForOnline(game);
    const result = computeNbyn(game, initialStates, logs);

    expect(result.scores[0]).toMatchObject({
      player_id: "player-1",
      correct: 3,
      wrong: 4,
      score: 12,
      state: "win",
      last_correct: 3,
    });
    expect(result.winPlayers).toEqual([
      {
        player_id: "player-1",
        text: generateScoreText(result.scores[0], result.scores[0].order),
      },
    ]);
  });
});
