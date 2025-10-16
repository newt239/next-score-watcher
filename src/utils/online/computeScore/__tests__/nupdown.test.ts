import { describe, expect, it } from "vitest";

import {
  generateScoreText,
  getInitialPlayersStateForOnline,
  getSortedPlayerOrderListForOnline,
} from "../index";
import computeNupdown from "../nupdown";

import type {
  ComputedScoreProps,
  GamePlayerProps,
  GetGameDetailResponseType,
} from "@/models/game";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

type NupdownGame = Extract<GetGameDetailResponseType, { ruleType: "nupdown" }>;

/**
 * nupdown形式のゲームデータを生成する。
 * @param players ゲームに参加するプレイヤー一覧
 * @param logs 適用するゲームログ
 * @param winPoint 勝ち抜けまでの連続正解数
 * @param losePoint 失格となる誤答数
 * @returns nupdown形式のゲーム設定
 */
const createNupdownGame = (
  players: GamePlayerProps[],
  logs: SeriarizedGameLog[],
  winPoint = 3,
  losePoint = 2
): NupdownGame => ({
  id: "game-nupdown",
  name: "nupdown",
  ruleType: "nupdown" as const,
  option: {
    win_point: winPoint,
    lose_point: losePoint,
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
const createScoreState = (
  override: Partial<ComputedScoreProps>
): ComputedScoreProps => ({
  game_id: "game-nupdown",
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

describe("online nupdown形式", () => {
  it("初期状態でスコアは0、正解数と誤答数がinitialScoreに一致する", () => {
    const players = [
      createPlayer("player-1", 2, 0),
      createPlayer("player-2", null, 1),
    ];
    const game = createNupdownGame(players, []);

    const initialStates = getInitialPlayersStateForOnline(game);

    expect(initialStates[0]).toMatchObject({
      player_id: "player-1",
      score: 0,
      correct: 2,
      wrong: 2,
      state: "playing",
    });
    expect(initialStates[1]).toMatchObject({
      player_id: "player-2",
      score: 0,
      correct: 0,
      wrong: 0,
    });
  });

  it("ソートは勝者の次にスコア・正解数・誤答数で並ぶ", () => {
    const sorted = getSortedPlayerOrderListForOnline([
      createScoreState({
        player_id: "winner",
        state: "win",
        score: 3,
        last_correct: 1,
      }),
      createScoreState({
        player_id: "higher-score",
        score: 2,
        correct: 4,
      }),
      createScoreState({
        player_id: "lower-score",
        score: 1,
        correct: 3,
        wrong: 0,
      }),
      createScoreState({
        player_id: "more-wrong",
        score: 1,
        correct: 3,
        wrong: 1,
      }),
    ]);

    expect(sorted).toEqual([
      "winner",
      "higher-score",
      "lower-score",
      "more-wrong",
    ]);
  });

  it("誤答でスコアがリセットされ勝敗判定が行われる", () => {
    const players = [
      createPlayer("player-1", 0, 0),
      createPlayer("player-2", 0, 1),
    ];
    const logs: SeriarizedGameLog[] = [
      {
        id: "log-1",
        gameId: "game-nupdown",
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
        gameId: "game-nupdown",
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
        gameId: "game-nupdown",
        playerId: "player-2",
        questionNumber: 2,
        actionType: "wrong",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:03.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
      {
        id: "log-4",
        gameId: "game-nupdown",
        playerId: "player-1",
        questionNumber: 3,
        actionType: "correct",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:04.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
      {
        id: "log-5",
        gameId: "game-nupdown",
        playerId: "player-1",
        questionNumber: 4,
        actionType: "correct",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:05.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
    ];

    const game = createNupdownGame(players, logs, 4, 2);
    const initialStates = getInitialPlayersStateForOnline(game);
    const result = computeNupdown(game, initialStates, logs);

    const player1 = result.scores.find((s) => s.player_id === "player-1");
    const player2 = result.scores.find((s) => s.player_id === "player-2");

    expect(player1).toMatchObject({
      score: 4,
      correct: 4,
      state: "win",
      text: "1st",
    });
    expect(player2).toMatchObject({
      score: 0,
      wrong: 1,
      state: "playing",
      reach_state: "lose",
    });
    expect(result.winPlayers).toEqual([
      {
        player_id: "player-1",
        text: "1st",
      },
    ]);
    if (player1) {
      expect(generateScoreText(player1, player1.order)).toBe("1st");
    }
  });
});
