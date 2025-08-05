import { describe, expect, it } from "vitest";

import {
  clipNumber,
  getInitialPlayersState,
  indicator,
} from "@/utils/computeScore";
import nbyn from "@/utils/computeScore/nbyn";
import nomx from "@/utils/computeScore/nomx";
import normal from "@/utils/computeScore/normal";
import { AllGameProps, LogDBProps } from "@/utils/types";

describe("スコア計算ロジック（コア機能テスト）", () => {
  describe("ユーティリティ関数", () => {
    it("getInitialPlayersState が正しく動作する", () => {
      const mockGame = {
        id: "test",
        players: [
          {
            id: "player1",
            name: "プレイヤー1",
            initial_correct: 1,
            initial_wrong: 0,
            base_correct_point: 10,
            base_wrong_point: -10,
          },
        ],
        rule: "normal" as const,
      } as AllGameProps["normal"];

      const result = getInitialPlayersState(mockGame);

      expect(result).toHaveLength(1);
      expect(result[0].player_id).toBe("player1");
      expect(result[0].correct).toBe(1);
      expect(result[0].state).toBe("playing");
    });

    it("clipNumber が正しく動作する", () => {
      expect(clipNumber(5, 0, 10)).toBe(5);
      expect(clipNumber(-5, 0, 10)).toBe(0);
      expect(clipNumber(15, 0, 10)).toBe(10);
    });

    it("indicator が正しく動作する", () => {
      expect(indicator(0)).toBe("1st");
      expect(indicator(1)).toBe("2nd");
      expect(indicator(2)).toBe("3rd");
      expect(indicator(3)).toBe("4th");
    });
  });

  describe("normal形式", () => {
    const mockGame: AllGameProps["normal"] = {
      id: "test-game",
      name: "テストゲーム",
      rule: "normal" as const,
      players: [
        {
          id: "player1",
          name: "プレイヤー1",
          initial_correct: 0,
          initial_wrong: 0,
          base_correct_point: 10,
          base_wrong_point: -10,
        },
      ],
      quiz: { set_name: "テストセット", offset: 0 },
      correct_me: 10,
      wrong_me: -10,
      win_point: 50,
      lose_point: -30,
      win_through: 1,
      discord_webhook_url: "",
      editable: true,
      last_open: "2024-01-01T00:00:00Z",
      options: undefined,
    };

    it("正解でスコアが加算される", async () => {
      const logs: LogDBProps[] = [
        {
          id: "log1",
          game_id: "test-game",
          player_id: "player1",
          variant: "correct",
          system: 0,
          timestamp: "1000",
          available: 1,
        },
      ];
      const result = await normal(mockGame, logs);

      expect(result.scores[0].score).toBe(10);
      expect(result.scores[0].correct).toBe(1);
      expect(result.scores[0].state).toBe("playing");
    });

    it("勝利条件に達すると勝利状態になる", async () => {
      const logs: LogDBProps[] = Array.from({ length: 5 }, (_, i) => ({
        id: `log${i + 1}`,
        game_id: "test-game",
        player_id: "player1",
        variant: "correct" as const,
        system: 0,
        timestamp: (1000 + i).toString(),
        available: 1,
      }));
      const result = await normal(mockGame, logs);

      expect(result.scores[0].score).toBe(50);
      expect(result.scores[0].state).toBe("win");
    });
  });

  describe("nomx形式", () => {
    const mockGame: AllGameProps["nomx"] = {
      id: "test-game",
      name: "テストゲーム",
      rule: "nomx" as const,
      players: [
        {
          id: "player1",
          name: "プレイヤー1",
          initial_correct: 0,
          initial_wrong: 0,
          base_correct_point: 1,
          base_wrong_point: 1,
        },
      ],
      quiz: { set_name: "テストセット", offset: 0 },
      correct_me: 1,
      wrong_me: 1,
      win_point: 3,
      lose_point: 2,
      win_through: 1,
      discord_webhook_url: "",
      editable: true,
      last_open: "2024-01-01T00:00:00Z",
      options: undefined,
    };

    it("正解と誤答の数が正しく記録される", async () => {
      const logs: LogDBProps[] = [
        {
          id: "log1",
          game_id: "test-game",
          player_id: "player1",
          variant: "correct",
          system: 0,
          timestamp: "1000",
          available: 1,
        },
        {
          id: "log2",
          game_id: "test-game",
          player_id: "player1",
          variant: "wrong",
          system: 0,
          timestamp: "1001",
          available: 1,
        },
      ];
      const result = await nomx(mockGame, logs);

      expect(result.scores[0].correct).toBe(1);
      expect(result.scores[0].wrong).toBe(1);
      expect(result.scores[0].state).toBe("playing");
    });
  });

  describe("nbyn形式", () => {
    const mockGame: AllGameProps["nbyn"] = {
      id: "test-game",
      name: "テストゲーム",
      rule: "nbyn" as const,
      players: [
        {
          id: "player1",
          name: "プレイヤー1",
          initial_correct: 0,
          initial_wrong: 0,
          base_correct_point: 1,
          base_wrong_point: 1,
        },
      ],
      quiz: { set_name: "テストセット", offset: 0 },
      correct_me: 1,
      wrong_me: 1,
      win_point: 3, // 3 by 3 形式
      win_through: 1,
      discord_webhook_url: "",
      editable: true,
      last_open: "2024-01-01T00:00:00Z",
      options: undefined,
    };

    it("スコア計算式（正解数 × (N - 誤答数)）が正しく動作する", async () => {
      const logs: LogDBProps[] = [
        {
          id: "log1",
          game_id: "test-game",
          player_id: "player1",
          variant: "correct",
          system: 0,
          timestamp: "1000",
          available: 1,
        },
        {
          id: "log2",
          game_id: "test-game",
          player_id: "player1",
          variant: "correct",
          system: 0,
          timestamp: "1001",
          available: 1,
        },
      ];
      const result = await nbyn(mockGame, logs);

      expect(result.scores[0].score).toBe(6); // 2 * (3 - 0) = 6
      expect(result.scores[0].correct).toBe(2);
      expect(result.scores[0].wrong).toBe(0);
    });
  });
});
