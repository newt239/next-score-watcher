import { describe, expect, it } from "vitest";

import {
  generateScoreText,
  getInitialPlayersStateForOnline,
  getSortedPlayerOrderListForOnline,
} from "../index";
import computeSquarex from "../squarex";

import type { ComputedScoreProps, GamePlayerProps, GetGameDetailResponseType } from "@/models/game";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

type SquarexGame = Extract<GetGameDetailResponseType, { ruleType: "squarex" }>;

/**
 * squarex形式のゲームデータを生成する。
 * @param players ゲームに参加するプレイヤー一覧
 * @param logs 適用するゲームログ
 * @param winPoint 勝ち抜け条件となるターゲット値
 * @returns squarex形式のゲーム設定
 */
const createSquarexGame = (
  players: GamePlayerProps[],
  logs: SeriarizedGameLog[],
  winPoint = 4
): SquarexGame => ({
  id: "game-squarex",
  name: "squarex",
  ruleType: "squarex" as const,
  option: {
    win_point: winPoint,
    limit: undefined,
    win_through: 1,
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
 * @param id プレイヤーID
 * @param initialScore 初期スコア
 * @param displayOrder 表示順
 * @returns プレイヤー設定
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
 * @param override 上書きするスコア情報
 * @returns 計算済みスコア
 */
const createScoreState = (override: Partial<ComputedScoreProps>): ComputedScoreProps => ({
  game_id: "game-squarex",
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

describe("online squarex形式", () => {
  it("初期状態で奇数・偶数スコアがinitialScoreで初期化され積が総合スコアになる", () => {
    const players = [createPlayer("player-1", 3, 0), createPlayer("player-2", null, 1)];
    const game = createSquarexGame(players, []);

    const initialStates = getInitialPlayersStateForOnline(game);

    expect(initialStates[0]).toMatchObject({
      player_id: "player-1",
      odd_score: 3,
      even_score: 3,
      score: 9,
    });
    expect(initialStates[1]).toMatchObject({
      player_id: "player-2",
      odd_score: 0,
      even_score: 0,
      score: 0,
    });
    initialStates.forEach((state) => {
      expect(state.score).toBe(state.odd_score * state.even_score);
    });
  });

  it("ソートは勝者の次にスコア・正解数・誤答数を優先する", () => {
    const sorted = getSortedPlayerOrderListForOnline([
      createScoreState({
        player_id: "winner",
        state: "win",
        last_correct: 3,
        score: 16,
      }),
      createScoreState({
        player_id: "higher-score",
        score: 9,
        correct: 6,
        wrong: 1,
      }),
      createScoreState({
        player_id: "equal-score-high-correct",
        score: 4,
        correct: 5,
        wrong: 1,
      }),
      createScoreState({
        player_id: "equal-score-low-correct",
        score: 4,
        correct: 4,
        wrong: 0,
      }),
    ]);

    expect(sorted).toEqual([
      "winner",
      "higher-score",
      "equal-score-high-correct",
      "equal-score-low-correct",
    ]);
  });

  it("奇数・偶数問の正解が積スコアと勝敗に反映される", () => {
    const players = [createPlayer("player-1", 0, 0)];
    const logs: SeriarizedGameLog[] = [
      {
        id: "log-1",
        gameId: "game-squarex",
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
        gameId: "game-squarex",
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
        gameId: "game-squarex",
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
        gameId: "game-squarex",
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

    const game = createSquarexGame(players, logs, 4);
    const initialStates = getInitialPlayersStateForOnline(game);
    const result = computeSquarex(game, initialStates, logs);

    expect(result.scores[0]).toMatchObject({
      player_id: "player-1",
      odd_score: 2,
      even_score: 2,
      score: 4,
      state: "win",
      text: "1st",
    });
    expect(result.winPlayers).toEqual([
      {
        player_id: "player-1",
        text: "1st",
      },
    ]);
    expect(generateScoreText(result.scores[0], result.scores[0].order)).toBe("1st");
  });
});
