import { describe, expect, it } from "vitest";

import computeAttackSurvival from "../attacksurvival";
import {
  generateScoreText,
  getInitialPlayersStateForOnline,
  getSortedPlayerOrderListForOnline,
} from "../index";

import type { ComputedScoreProps, GamePlayerProps, GetGameDetailResponseType } from "@/models/game";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

type AttackSurvivalGame = Extract<GetGameDetailResponseType, { ruleType: "attacksurvival" }>;

/**
 * attacksurvival形式のゲームデータを生成する。
 * @param players ゲームに参加するプレイヤー一覧
 * @param logs 適用するゲームログ
 * @param option オプション設定
 * @returns attacksurvival形式のゲーム設定
 */
const createAttackSurvivalGame = (
  players: GamePlayerProps[],
  logs: SeriarizedGameLog[],
  option: AttackSurvivalGame["option"]
): AttackSurvivalGame => ({
  id: "game-attacksurvival",
  name: "attacksurvival",
  ruleType: "attacksurvival" as const,
  option,
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
  game_id: "game-attacksurvival",
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

describe("online attacksurvival形式", () => {
  const baseOption: AttackSurvivalGame["option"] = {
    win_point: 15,
    win_through: 1,
    correct_me: 2,
    wrong_me: -2,
    correct_other: -3,
    wrong_other: 1,
    limit: undefined,
  };

  it("初期状態でスコアがwin_throughとinitialScoreの合算になる", () => {
    const players = [createPlayer("player-1", 3, 0), createPlayer("player-2", 1, 1)];
    const game = createAttackSurvivalGame(players, [], baseOption);

    const initialStates = getInitialPlayersStateForOnline(game);

    expect(initialStates).toMatchObject([
      {
        player_id: "player-1",
        score: 4,
        correct: 0,
        wrong: 0,
      },
      {
        player_id: "player-2",
        score: 2,
        correct: 0,
        wrong: 0,
      },
    ]);
    expect(generateScoreText(initialStates[0], 0)).toBe("4");
    expect(generateScoreText(initialStates[1], 1)).toBe("2");
  });

  it("スコアと勝敗状態を優先して並び替える", () => {
    const sorted = getSortedPlayerOrderListForOnline([
      createScoreState({
        player_id: "winner",
        state: "win",
        score: 10,
        last_correct: 2,
      }),
      createScoreState({
        player_id: "higher-score",
        score: 8,
        correct: 3,
      }),
      createScoreState({
        player_id: "lower-score",
        score: 5,
        correct: 4,
        wrong: 1,
      }),
      createScoreState({
        player_id: "more-wrong",
        score: 5,
        correct: 4,
        wrong: 2,
      }),
    ]);

    expect(sorted).toEqual(["winner", "higher-score", "lower-score", "more-wrong"]);
  });

  it("正解が他プレイヤーのスコアに影響し勝者を決定する", () => {
    const players = [createPlayer("player-1", 3, 0), createPlayer("player-2", 2, 1)];
    const logs: SeriarizedGameLog[] = [
      {
        id: "log-1",
        gameId: "game-attacksurvival",
        playerId: "player-1",
        questionNumber: 0,
        actionType: "correct",
        scoreChange: 0,
        timestamp: "2024-01-01T00:00:01.000Z",
        isSystemAction: false,
        deletedAt: null,
        userId: "user-1",
      },
    ];

    const game = createAttackSurvivalGame(players, logs, baseOption);
    const initialStates = getInitialPlayersStateForOnline(game);
    const result = computeAttackSurvival(game, initialStates, logs);

    const player1 = result.scores.find((s) => s.player_id === "player-1");
    const player2 = result.scores.find((s) => s.player_id === "player-2");

    expect(player1).toMatchObject({
      score: 6,
      state: "win",
      correct: 1,
      text: "1st",
    });
    expect(player2).toMatchObject({
      score: -1,
      state: "lose",
      text: "LOSE",
    });
    expect(result.winPlayers).toEqual([
      {
        player_id: "player-1",
        text: "1st",
      },
    ]);
  });
});
