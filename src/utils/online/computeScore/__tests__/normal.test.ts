import { describe, expect, it } from "vitest";

import {
  generateScoreText,
  getInitialPlayersStateForOnline,
  getSortedPlayerOrderListForOnline,
  indicator,
} from "../index";
import computeNormal from "../normal";

import type {
  ComputedScoreProps,
  GamePlayerProps,
  GetGameDetailResponseType,
} from "@/models/game";
import type { SeriarizedGameLog } from "@/utils/drizzle/types";

type NormalGame = Extract<GetGameDetailResponseType, { ruleType: "normal" }>;

/**
 * normal形式のゲームデータを生成する。
 */
const createNormalGame = (
  players: GamePlayerProps[],
  logs: SeriarizedGameLog[]
): NormalGame => ({
  id: "game-normal",
  name: "normal",
  ruleType: "normal" as const,
  option: {},
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
 * 計算済みスコアのひな型を生成する。
 */
const createScoreState = (
  override: Partial<ComputedScoreProps>
): ComputedScoreProps => ({
  game_id: "game-normal",
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

describe("online normal形式", () => {
  it("初期状態をinitialScoreに応じて生成する", () => {
    const players = [
      createPlayer("player-1", 3, 0),
      createPlayer("player-2", null, 1),
    ];
    const game = createNormalGame(players, []);

    const initialStates = getInitialPlayersStateForOnline(game);

    expect(initialStates).toHaveLength(2);
    expect(initialStates[0]).toMatchObject({
      player_id: "player-1",
      score: 0,
      correct: 3,
      wrong: 3,
      state: "playing",
      reach_state: "playing",
      is_incapacity: false,
      stage: 1,
      odd_score: 0,
      even_score: 0,
      last_correct: -10,
      last_wrong: -10,
      text: "",
    });
    expect(initialStates[1]).toMatchObject({
      player_id: "player-2",
      score: 0,
      correct: 0,
      wrong: 0,
      state: "playing",
      reach_state: "playing",
      is_incapacity: false,
      stage: 1,
    });
  });

  it("順位ソートは勝利状態・ステージ・スコア・正解数・誤答数を優先する", () => {
    const baseStates = [
      createScoreState({
        player_id: "win-fast",
        state: "win",
        last_correct: 2,
        score: 5,
      }),
      createScoreState({
        player_id: "win-slow",
        state: "win",
        last_correct: 5,
        score: 6,
      }),
      createScoreState({
        player_id: "stage-high",
        stage: 3,
        score: 4,
        correct: 4,
      }),
      createScoreState({
        player_id: "score-high",
        score: 10,
        correct: 6,
      }),
      createScoreState({
        player_id: "correct-high",
        score: 10,
        correct: 8,
        wrong: 2,
      }),
      createScoreState({
        player_id: "wrong-low",
        score: 10,
        correct: 8,
        wrong: 1,
      }),
      createScoreState({
        player_id: "score-low",
        score: 3,
        correct: 5,
        wrong: 0,
      }),
    ];

    const sorted = getSortedPlayerOrderListForOnline([...baseStates]);

    expect(sorted).toEqual([
      "win-fast",
      "win-slow",
      "stage-high",
      "wrong-low",
      "correct-high",
      "score-high",
      "score-low",
    ]);
  });

  it("generateScoreTextとindicatorが状態ごとの表示を返す", () => {
    const winner = createScoreState({ player_id: "winner", state: "win" });
    const loser = createScoreState({ player_id: "loser", state: "lose" });
    const runner = createScoreState({
      player_id: "runner",
      state: "playing",
      score: 7,
    });

    const winnerText = generateScoreText(winner, 0);
    const loserText = generateScoreText(loser, 1);
    const runnerText = generateScoreText(runner, 2);

    expect(winnerText).toBe("1st");
    expect(loserText).toBe("LOSE");
    expect(runnerText).toBe("7");
    expect(indicator(0)).toBe("1st");
    expect(indicator(1)).toBe("2nd");
    expect(indicator(2)).toBe("3rd");
    expect(indicator(10)).toBe("11th");
  });

  it("ログを適用した結果も順位テキストを設定する", () => {
    const players = [createPlayer("player-1", 0, 0)];
    const logs: SeriarizedGameLog[] = [
      {
        id: "log-1",
        gameId: "game-normal",
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

    const game = createNormalGame(players, logs);
    const initialStates = getInitialPlayersStateForOnline(game);
    const result = computeNormal(game, initialStates, logs);

    expect(result.scores[0]).toMatchObject({
      player_id: "player-1",
      score: 1,
      correct: 1,
      text: "1",
    });
  });
});
