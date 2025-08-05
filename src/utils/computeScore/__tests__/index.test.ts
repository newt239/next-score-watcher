import { describe, expect, it } from "vitest";

import type { AllGameProps, GameDBPlayerProps } from "@/utils/types";

import {
  clipNumber,
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "@/utils/computeScore";

describe("computeScore ユーティリティ関数", () => {
  const mockPlayers: GameDBPlayerProps[] = [
    {
      id: "player1",
      name: "プレイヤー1",
      initial_correct: 0,
      initial_wrong: 0,
      base_correct_point: 10,
      base_wrong_point: -10,
    },
    {
      id: "player2",
      name: "プレイヤー2",
      initial_correct: 2,
      initial_wrong: 1,
      base_correct_point: 10,
      base_wrong_point: -10,
    },
  ];

  describe("getInitialPlayersState", () => {
    it("初期状態のプレイヤー状態を正しく生成する", () => {
      const mockGame = {
        players: mockPlayers,
        rule: "normal" as const,
      } as AllGameProps["normal"];

      const result = getInitialPlayersState(mockGame);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        game_id: undefined,
        player_id: "player1",
        score: 0,
        correct: 0,
        wrong: 0,
        last_correct: -10,
        last_wrong: -10,
        state: "playing",
        reach_state: "playing",
        odd_score: 0,
        even_score: 0,
        stage: 1,
        is_incapacity: false,
        order: 0,
        text: "",
      });
      expect(result[1]).toEqual({
        game_id: undefined,
        player_id: "player2",
        score: 2,
        correct: 2,
        wrong: 1,
        last_correct: -10,
        last_wrong: -10,
        state: "playing",
        reach_state: "playing",
        odd_score: 0,
        even_score: 0,
        stage: 1,
        is_incapacity: false,
        order: 0,
        text: "",
      });
    });
  });

  describe("getSortedPlayerOrderList", () => {
    it("スコア順でプレイヤーを正しくソートする", () => {
      const scores = [
        {
          game_id: "test-game",
          player_id: "player1",
          score: 10,
          correct: 1,
          wrong: 0,
          last_correct: 0,
          last_wrong: -1,
          state: "playing" as const,
          reach_state: "playing" as const,
          odd_score: 0,
          even_score: 0,
          stage: 1,
          is_incapacity: false,
          order: 0,
          text: "10",
        },
        {
          game_id: "test-game",
          player_id: "player2",
          score: 20,
          correct: 2,
          wrong: 0,
          last_correct: 1,
          last_wrong: -1,
          state: "playing" as const,
          reach_state: "playing" as const,
          odd_score: 0,
          even_score: 0,
          stage: 1,
          is_incapacity: false,
          order: 0,
          text: "20",
        },
        {
          game_id: "test-game",
          player_id: "player3",
          score: 5,
          correct: 0,
          wrong: 1,
          last_correct: -1,
          last_wrong: 0,
          state: "playing" as const,
          reach_state: "playing" as const,
          odd_score: 0,
          even_score: 0,
          stage: 1,
          is_incapacity: false,
          order: 0,
          text: "5",
        },
      ];

      const result = getSortedPlayerOrderList(scores);

      expect(result).toEqual(["player2", "player1", "player3"]);
    });

    it("同じスコアの場合は正解数で判定する", () => {
      const scores = [
        {
          game_id: "test-game",
          player_id: "player1",
          score: 10,
          correct: 1,
          wrong: 0,
          last_correct: 0,
          last_wrong: -1,
          state: "playing" as const,
          reach_state: "playing" as const,
          odd_score: 0,
          even_score: 0,
          stage: 1,
          is_incapacity: false,
          order: 0,
          text: "10",
        },
        {
          game_id: "test-game",
          player_id: "player2",
          score: 10,
          correct: 2,
          wrong: 1,
          last_correct: 1,
          last_wrong: 0,
          state: "playing" as const,
          reach_state: "playing" as const,
          odd_score: 0,
          even_score: 0,
          stage: 1,
          is_incapacity: false,
          order: 0,
          text: "10",
        },
      ];

      const result = getSortedPlayerOrderList(scores);

      expect(result).toEqual(["player2", "player1"]);
    });
  });

  describe("indicator", () => {
    it("数値に応じて正しい順位表示を返す", () => {
      expect(indicator(0)).toBe("1st");
      expect(indicator(1)).toBe("2nd");
      expect(indicator(2)).toBe("3rd");
      expect(indicator(3)).toBe("4th");
      expect(indicator(10)).toBe("11st");
      expect(indicator(20)).toBe("21st");
      expect(indicator(21)).toBe("22nd");
      expect(indicator(22)).toBe("23rd");
    });
  });

  describe("clipNumber", () => {
    it("範囲内の数値はそのまま返す", () => {
      expect(clipNumber(5, 0, 10)).toBe(5);
      expect(clipNumber(0, 0, 10)).toBe(0);
      expect(clipNumber(10, 0, 10)).toBe(10);
    });

    it("最小値未満の場合は最小値を返す", () => {
      expect(clipNumber(-5, 0, 10)).toBe(0);
    });

    it("最大値超過の場合は最大値を返す", () => {
      expect(clipNumber(15, 0, 10)).toBe(10);
    });

    it("無限大の場合も範囲内にクリップされる", () => {
      expect(clipNumber(Infinity, 0, 10)).toBe(10);
      expect(clipNumber(-Infinity, 0, 10)).toBe(0);
    });
  });
});
