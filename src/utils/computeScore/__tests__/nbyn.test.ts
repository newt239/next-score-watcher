import { describe, expect, it } from "vitest";

import nbyn from "@/utils/computeScore/nbyn";

import type { AllGameProps, LogDBProps } from "@/utils/types";

describe("nbyn形式のスコア計算", () => {
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
    win_point: 5, // 5 by 5 形式（25点で勝ち抜け）
    lose_point: 6, // 誤答6回で失格
    win_through: 1,
    options: undefined,
    correct_me: 1,
    wrong_me: 1,
    discord_webhook_url: "",
    editable: true,
    last_open: "2024-01-01T00:00:00Z",
  };

  it("初期状態で正しくスコアが計算される", async () => {
    const logs: LogDBProps[] = [];
    const result = await nbyn(mockGame, logs);

    expect(result.scores[0]).toEqual({
      game_id: "test-game",
      player_id: "player1",
      score: 0, // 0 * (5 - 0) = 0
      correct: 0,
      wrong: 0,
      last_correct: -10,
      last_wrong: -10,
      odd_score: 0,
      even_score: 0,
      stage: 1,
      state: "playing",
      reach_state: "playing",
      is_incapacity: false,
      order: 0,
      text: "0pt",
    });
  });

  it("正解時にスコアが正しく計算される（正解数 × (N - 誤答数)）", async () => {
    const logs: LogDBProps[] = [
      {
        id: "log1",
        game_id: "test-game",
        player_id: "player1",
        variant: "correct",
        system: 0,
        timestamp: "2024-01-01T00:00:00Z",
        available: 1,
      },
    ];
    const result = await nbyn(mockGame, logs);

    expect(result.scores[0].score).toBe(5); // 1 * (5 - 0) = 5
    expect(result.scores[0].correct).toBe(1);
    expect(result.scores[0].wrong).toBe(0);
  });

  it("誤答時にスコアが正しく減少する", async () => {
    const logs: LogDBProps[] = [
      {
        id: "log1",
        game_id: "test-game",
        player_id: "player1",
        variant: "correct",
        system: 0,
        timestamp: "2024-01-01T00:00:00Z",
        available: 1,
      },
      {
        id: "log2",
        game_id: "test-game",
        player_id: "player1",
        variant: "wrong",
        system: 0,
        timestamp: "2024-01-01T00:00:00Z",
        available: 1,
      },
    ];
    const result = await nbyn(mockGame, logs);

    expect(result.scores[0].score).toBe(4); // 1 * (5 - 1) = 4
    expect(result.scores[0].correct).toBe(1);
    expect(result.scores[0].wrong).toBe(1);
  });

  it("N²に達すると勝利状態になる", async () => {
    const logs: LogDBProps[] = Array.from({ length: 5 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: "test-game",
      player_id: "player1",
      variant: "correct" as const,
      system: 0,
      timestamp: "2024-01-01T00:00:00Z",
      available: 1,
    }));
    const result = await nbyn(mockGame, logs);

    expect(result.scores[0].score).toBe(25); // 5 * (5 - 0) = 25 = 5²
    expect(result.scores[0].correct).toBe(5);
    expect(result.scores[0].state).toBe("win");
    expect(result.winPlayers.map((w) => w.player_id)).toContain("player1");
  });

  it("スコアが0以下になると失格状態になる", async () => {
    const logs: LogDBProps[] = Array.from({ length: 6 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: "test-game",
      player_id: "player1",
      variant: "wrong" as const,
      system: 0,
      timestamp: "2024-01-01T00:00:00Z",
      available: 1,
    }));
    const result = await nbyn(mockGame, logs);

    expect(result.scores[0].score === 0).toBe(true); // 0 * (5 - 6) = -0
    expect(result.scores[0].wrong).toBe(6);
    expect(result.scores[0].state).toBe("lose");
  });

  it("正解と誤答が混在した場合に正しく計算される", async () => {
    const logs: LogDBProps[] = [
      {
        id: "log1",
        game_id: "test-game",
        player_id: "player1",
        variant: "correct",
        system: 0,
        timestamp: "2024-01-01T00:00:00Z",
        available: 1,
      },
      {
        id: "log2",
        game_id: "test-game",
        player_id: "player1",
        variant: "correct",
        system: 0,
        timestamp: "2024-01-01T00:00:00Z",
        available: 1,
      },
      {
        id: "log3",
        game_id: "test-game",
        player_id: "player1",
        variant: "wrong",
        system: 0,
        timestamp: "2024-01-01T00:00:00Z",
        available: 1,
      },
      {
        id: "log4",
        game_id: "test-game",
        player_id: "player1",
        variant: "correct",
        system: 0,
        timestamp: "2024-01-01T00:00:00Z",
        available: 1,
      },
    ];
    const result = await nbyn(mockGame, logs);

    expect(result.scores[0].score).toBe(12); // 3 * (5 - 1) = 12
    expect(result.scores[0].correct).toBe(3);
    expect(result.scores[0].wrong).toBe(1);
    expect(result.scores[0].state).toBe("playing");
  });
});
