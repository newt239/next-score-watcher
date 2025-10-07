import { describe, expect, it } from "vitest";

import {
  generateScoreText,
  getInitialPlayersStateForOnline,
  getSortedPlayerOrderListForOnline,
} from "../index";
import computeNomx from "../nomx";

import type {
  ComputedScoreProps,
  GamePlayerProps,
  GetGameDetailResponseType,
} from "@/models/game";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

type NomxGame = Extract<GetGameDetailResponseType, { ruleType: "nomx" }>;

/**
 * nomx形式のゲームデータを生成する。
 * @param players ゲームに参加するプレイヤー一覧
 * @param logs 適用するゲームログ
 * @param winPoint 勝ち抜けに必要な正解数
 * @param losePoint 失格となる誤答数
 * @returns nomx形式のゲーム設定
 */
const createNomxGame = (
  players: GamePlayerProps[],
  logs: SeriarizedGameLog[],
  winPoint = 3,
  losePoint = 2
): NomxGame => ({
  id: "game-nomx",
  name: "nomx",
  ruleType: "nomx" as const,
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
  game_id: "game-nomx",
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

describe("online nomx形式", () => {
  it("初期状態で正解数と誤答数がinitialScoreで初期化される", () => {
    const players = [
      createPlayer("player-1", 2, 0),
      createPlayer("player-2", null, 1),
    ];
    const game = createNomxGame(players, []);

    const initialStates = getInitialPlayersStateForOnline(game);

    expect(initialStates).toHaveLength(2);
    expect(initialStates[0]).toMatchObject({
      player_id: "player-1",
      score: 0,
      correct: 2,
      wrong: 2,
      state: "playing",
      reach_state: "playing",
    });
    expect(initialStates[1]).toMatchObject({
      player_id: "player-2",
      score: 0,
      correct: 0,
      wrong: 0,
    });
  });

  it("順位ソートは勝者・最終正解・正解数・誤答数の順で優先される", () => {
    const sorted = getSortedPlayerOrderListForOnline([
      createScoreState({
        player_id: "winner-early",
        state: "win",
        last_correct: 2,
        correct: 3,
      }),
      createScoreState({
        player_id: "winner-late",
        state: "win",
        last_correct: 5,
        correct: 4,
      }),
      createScoreState({
        player_id: "higher-correct",
        score: 0,
        correct: 5,
        wrong: 1,
      }),
      createScoreState({
        player_id: "lower-wrong",
        score: 0,
        correct: 5,
        wrong: 0,
      }),
      createScoreState({
        player_id: "less-correct",
        score: 0,
        correct: 4,
        wrong: 0,
      }),
    ]);

    expect(sorted).toEqual([
      "winner-early",
      "winner-late",
      "lower-wrong",
      "higher-correct",
      "less-correct",
    ]);
  });

  it("正解と誤答ログに応じて状態とテキストが更新される", () => {
    const players = [
      createPlayer("player-1", 0, 0),
      createPlayer("player-2", 0, 1),
    ];
    const logs: SeriarizedGameLog[] = [
      {
        id: "log-1",
        gameId: "game-nomx",
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
        gameId: "game-nomx",
        playerId: "player-2",
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
        gameId: "game-nomx",
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
        gameId: "game-nomx",
        playerId: "player-2",
        questionNumber: 3,
        actionType: "wrong",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:04.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
    ];

    const game = createNomxGame(players, logs, 2, 2);
    const initialStates = getInitialPlayersStateForOnline(game);
    const result = computeNomx(game, initialStates, logs);

    const player1 = result.scores.find((s) => s.player_id === "player-1");
    const player2 = result.scores.find((s) => s.player_id === "player-2");

    expect(player1).toMatchObject({
      correct: 2,
      wrong: 0,
      state: "win",
      reach_state: "win",
      text: "1st",
    });
    expect(player2).toMatchObject({
      correct: 0,
      wrong: 2,
      state: "lose",
      text: "LOSE",
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
    if (player2) {
      expect(generateScoreText(player2, player2.order)).toBe("LOSE");
    }
  });
});
