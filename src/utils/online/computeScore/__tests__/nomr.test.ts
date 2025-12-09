import { describe, expect, it } from "vitest";

import {
  generateScoreText,
  getInitialPlayersStateForOnline,
  getSortedPlayerOrderListForOnline,
} from "../index";
import computeNomr from "../nomr";

import type { ComputedScoreProps, GamePlayerProps, GetGameDetailResponseType } from "@/models/game";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

type NomrGame = Extract<GetGameDetailResponseType, { ruleType: "nomr" }>;

/**
 * nomr形式のゲームデータを生成する。
 */
const createNomrGame = (
  players: GamePlayerProps[],
  logs: SeriarizedGameLog[],
  winPoint = 3,
  restCount = 2
): NomrGame => ({
  id: "game-nomr",
  name: "nomr",
  ruleType: "nomr" as const,
  option: {
    win_point: winPoint,
    lose_point: 0,
    rest_count: restCount,
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
  game_id: "game-nomr",
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

describe("online nomr形式", () => {
  it("初期状態で全員が休み状態ではなくscoreはinitialScoreに一致する", () => {
    const players = [createPlayer("player-1", 2, 0), createPlayer("player-2", null, 1)];
    const game = createNomrGame(players, []);

    const initialStates = getInitialPlayersStateForOnline(game);

    expect(initialStates[0]).toMatchObject({
      player_id: "player-1",
      score: 2,
      correct: 2,
      wrong: 2,
      is_incapacity: false,
      state: "playing",
      reach_state: "playing",
      stage: 1,
    });
    expect(initialStates[1]).toMatchObject({
      player_id: "player-2",
      score: 0,
      correct: 0,
      wrong: 0,
      is_incapacity: false,
      state: "playing",
    });
  });

  it("順位は勝者優先、正解数や誤答数で整列する", () => {
    const sorted = getSortedPlayerOrderListForOnline([
      createScoreState({
        player_id: "winner-fast",
        state: "win",
        last_correct: 1,
        correct: 3,
      }),
      createScoreState({
        player_id: "winner-slow",
        state: "win",
        last_correct: 4,
        correct: 4,
      }),
      createScoreState({
        player_id: "higher-correct",
        correct: 5,
        wrong: 2,
      }),
      createScoreState({
        player_id: "lower-wrong",
        correct: 5,
        wrong: 1,
      }),
      createScoreState({
        player_id: "less-correct",
        correct: 4,
        wrong: 1,
      }),
    ]);

    expect(sorted).toEqual([
      "winner-fast",
      "winner-slow",
      "lower-wrong",
      "higher-correct",
      "less-correct",
    ]);
  });

  it("誤答後に規定休み数を経過すると解答権が回復する", () => {
    const players = [createPlayer("player-1", 0, 0), createPlayer("player-2", 0, 1)];
    const logs: SeriarizedGameLog[] = [
      {
        id: "log-1",
        gameId: "game-nomr",
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
        gameId: "game-nomr",
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
        gameId: "game-nomr",
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

    const game = createNomrGame(players, logs, 3, 2);
    const initialStates = getInitialPlayersStateForOnline(game);
    const result = computeNomr(game, initialStates, logs);

    const player1 = result.scores.find((s) => s.player_id === "player-1");

    expect(player1).toMatchObject({
      wrong: 1,
      is_incapacity: false,
      last_wrong: 0,
    });
  });

  it("勝ち抜け条件を満たすと順位テキストが付与される", () => {
    const players = [createPlayer("player-1", 0, 0)];
    const logs: SeriarizedGameLog[] = [
      {
        id: "log-1",
        gameId: "game-nomr",
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
        gameId: "game-nomr",
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
        gameId: "game-nomr",
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

    const game = createNomrGame(players, logs, 3, 2);
    const initialStates = getInitialPlayersStateForOnline(game);
    const result = computeNomr(game, initialStates, logs);

    expect(result.scores[0]).toMatchObject({
      player_id: "player-1",
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
});
