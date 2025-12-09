import { describe, expect, it } from "vitest";

import computeFreezex from "../freezex";
import {
  generateScoreText,
  getInitialPlayersStateForOnline,
  getSortedPlayerOrderListForOnline,
} from "../index";

import type { ComputedScoreProps, GamePlayerProps, GetGameDetailResponseType } from "@/models/game";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

type FreezexGame = Extract<GetGameDetailResponseType, { ruleType: "freezex" }>;

/**
 * freezex形式のゲームデータを生成する。
 * @param players ゲームに参加するプレイヤー一覧
 * @param logs 適用するゲームログ
 * @param winPoint 勝ち抜けに必要な正解数
 * @returns freezex形式のゲーム設定
 */
const createFreezexGame = (
  players: GamePlayerProps[],
  logs: SeriarizedGameLog[],
  winPoint = 3
): FreezexGame => ({
  id: "game-freezex",
  name: "freezex",
  ruleType: "freezex" as const,
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
  game_id: "game-freezex",
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

describe("online freezex形式", () => {
  it("初期状態で正解数・誤答数がinitialScoreに一致し休みフラグはfalse", () => {
    const players = [createPlayer("player-1", 2, 0), createPlayer("player-2", null, 1)];
    const game = createFreezexGame(players, []);

    const initialStates = getInitialPlayersStateForOnline(game);

    expect(initialStates[0]).toMatchObject({
      player_id: "player-1",
      score: 0,
      correct: 2,
      wrong: 2,
      is_incapacity: false,
    });
    expect(initialStates[1]).toMatchObject({
      player_id: "player-2",
      is_incapacity: false,
    });
  });

  it("誤答で休みになり必要な問題数経過で復帰する", () => {
    const players = [createPlayer("player-1", 0, 0), createPlayer("player-2", 0, 1)];
    const logs: SeriarizedGameLog[] = [
      {
        id: "log-1",
        gameId: "game-freezex",
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
        gameId: "game-freezex",
        playerId: "player-2",
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
        gameId: "game-freezex",
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

    const game = createFreezexGame(players, logs, 3);
    const initialStates = getInitialPlayersStateForOnline(game);
    const result = computeFreezex(game, initialStates, logs);

    const player1 = result.scores.find((s) => s.player_id === "player-1");
    const player2 = result.scores.find((s) => s.player_id === "player-2");

    expect(player1).toMatchObject({
      wrong: 1,
      is_incapacity: false,
      last_wrong: 0,
    });
    expect(player2).toMatchObject({
      score: 2,
      correct: 2,
      is_incapacity: false,
    });
  });

  it("正解を重ねるとスコアが増加し勝者に順位テキストが付与される", () => {
    const players = [createPlayer("player-1", 0, 0)];
    const logs: SeriarizedGameLog[] = [
      {
        id: "log-1",
        gameId: "game-freezex",
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
        gameId: "game-freezex",
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
        gameId: "game-freezex",
        playerId: "player-1",
        questionNumber: 2,
        actionType: "correct",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:03.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
    ];

    const game = createFreezexGame(players, logs, 3);
    const initialStates = getInitialPlayersStateForOnline(game);
    const result = computeFreezex(game, initialStates, logs);

    expect(result.scores[0]).toMatchObject({
      player_id: "player-1",
      score: 3,
      correct: 3,
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

  it("順位ソートは勝敗とスコアを優先する", () => {
    const sorted = getSortedPlayerOrderListForOnline([
      createScoreState({
        player_id: "winner",
        state: "win",
        last_correct: 1,
        score: 5,
      }),
      createScoreState({
        player_id: "higher-score",
        score: 4,
        correct: 4,
      }),
      createScoreState({
        player_id: "lower-score",
        score: 2,
        correct: 3,
        wrong: 0,
      }),
      createScoreState({
        player_id: "more-wrong",
        score: 2,
        correct: 3,
        wrong: 1,
      }),
    ]);

    expect(sorted).toEqual(["winner", "higher-score", "lower-score", "more-wrong"]);
  });
});
