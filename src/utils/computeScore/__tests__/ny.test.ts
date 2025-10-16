import { describe, expect, it } from "vitest";

import type { AllGameProps, LogDBProps } from "@/utils/types";

import ny from "@/utils/computeScore/ny";

describe("ny形式のスコア計算", () => {
  const mockGame: AllGameProps["ny"] = {
    id: "test-game",
    name: "テストゲーム",
    rule: "ny" as const,
    players: [
      {
        id: "player1",
        name: "プレイヤー1",
        initial_correct: 0,
        initial_wrong: 0,
        base_correct_point: 1,
        base_wrong_point: -1,
      },
      {
        id: "player2",
        name: "プレイヤー2",
        initial_correct: 0,
        initial_wrong: 0,
        base_correct_point: 1,
        base_wrong_point: -1,
      },
    ],
    quiz: { set_name: "テストセット", offset: 0 },
    win_point: 10,
    correct_me: 1,
    wrong_me: -1,
    discord_webhook_url: "",
    editable: true,
    last_open: "2024-01-01T00:00:00Z",
    options: undefined,
  };

  it("初期状態で正しくスコアが計算される", async () => {
    const logs: LogDBProps[] = [];
    const result = await ny(mockGame, logs);

    expect(result.scores).toHaveLength(2);
    expect(result.scores[0]).toMatchObject({
      player_id: "player1",
      score: 0,
      correct: 0,
      wrong: 0,
      last_correct: -10,
      last_wrong: -10,
      state: "playing",
      reach_state: "playing",
      text: "0pt",
    });
    expect(result.winPlayers).toEqual([]);
  });

  it("正解時にスコアが1点加算される", async () => {
    const logs: LogDBProps[] = [
      {
        id: "log1",
        game_id: "test-game",
        player_id: "player1",
        variant: "correct",
        system: 0 as const,
        timestamp: "2024-01-01T00:00:00Z",
        available: 1 as const,
      },
    ];
    const result = await ny(mockGame, logs);

    expect(result.scores[0].score).toBe(1);
    expect(result.scores[0].correct).toBe(1);
    expect(result.scores[0].wrong).toBe(0);
    expect(result.scores[0].last_correct).toBe(0);
    expect(result.scores[0].text).toBe("1pt");
    expect(result.scores[0].state).toBe("playing");
  });

  it("誤答時にスコアが1点減算される", async () => {
    const logs: LogDBProps[] = [
      {
        id: "log1",
        game_id: "test-game",
        player_id: "player1",
        variant: "wrong",
        system: 0 as const,
        timestamp: "2024-01-01T00:00:00Z",
        available: 1 as const,
      },
    ];
    const result = await ny(mockGame, logs);

    expect(result.scores[0].score).toBe(-1);
    expect(result.scores[0].correct).toBe(0);
    expect(result.scores[0].wrong).toBe(1);
    expect(result.scores[0].last_wrong).toBe(0);
    expect(result.scores[0].text).toBe("-1pt");
    expect(result.scores[0].state).toBe("playing");
  });

  it("勝ち抜けポイントに達すると勝利状態になる", async () => {
    const logs: LogDBProps[] = Array.from({ length: 10 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: "test-game",
      player_id: "player1",
      variant: "correct" as const,
      system: 0,
      timestamp: `2024-01-01T00:0${i}:00Z`,
      available: 1,
    }));
    const result = await ny(mockGame, logs);

    expect(result.scores[0].score).toBe(10);
    expect(result.scores[0].correct).toBe(10);
    expect(result.scores[0].state).toBe("win");
    expect(result.scores[0].text).toBe("1st");
    expect(result.winPlayers).toEqual([{ player_id: "player1", text: "1st" }]);
  });

  it("勝ち抜けリーチ状態が正しく判定される", async () => {
    const logs: LogDBProps[] = Array.from({ length: 9 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: "test-game",
      player_id: "player1",
      variant: "correct" as const,
      system: 0,
      timestamp: `2024-01-01T00:0${i}:00Z`,
      available: 1,
    }));
    const result = await ny(mockGame, logs);

    expect(result.scores[0].score).toBe(9);
    expect(result.scores[0].correct).toBe(9);
    expect(result.scores[0].reach_state).toBe("win");
    expect(result.scores[0].state).toBe("playing");
    expect(result.scores[0].text).toBe("9pt");
  });

  it("敗退ポイントが設定されている場合、敗退状態になる", async () => {
    const gameWithLosePoint: AllGameProps["ny"] = {
      ...mockGame,
      lose_point: 3,
    };

    const logs: LogDBProps[] = Array.from({ length: 3 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: "test-game",
      player_id: "player1",
      variant: "wrong" as const,
      system: 0,
      timestamp: `2024-01-01T00:0${i}:00Z`,
      available: 1,
    }));
    const result = await ny(gameWithLosePoint, logs);

    expect(result.scores[0].score).toBe(-3);
    expect(result.scores[0].wrong).toBe(3);
    expect(result.scores[0].state).toBe("lose");
    expect(result.scores[0].text).toBe("LOSE");
  });

  it("敗退リーチ状態が正しく判定される", async () => {
    const gameWithLosePoint: AllGameProps["ny"] = {
      ...mockGame,
      lose_point: 3,
    };

    const logs: LogDBProps[] = Array.from({ length: 2 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: "test-game",
      player_id: "player1",
      variant: "wrong" as const,
      system: 0,
      timestamp: `2024-01-01T00:0${i}:00Z`,
      available: 1,
    }));
    const result = await ny(gameWithLosePoint, logs);

    expect(result.scores[0].score).toBe(-2);
    expect(result.scores[0].wrong).toBe(2);
    expect(result.scores[0].reach_state).toBe("lose");
    expect(result.scores[0].state).toBe("playing");
    expect(result.scores[0].text).toBe("-2pt");
  });

  it("正解と誤答が混在した場合に正しく計算される", async () => {
    const logs: LogDBProps[] = [
      {
        id: "log1",
        game_id: "test-game",
        player_id: "player1",
        variant: "correct",
        system: 0 as const,
        timestamp: "2024-01-01T00:00:00Z",
        available: 1 as const,
      },
      {
        id: "log2",
        game_id: "test-game",
        player_id: "player1",
        variant: "correct",
        system: 0 as const,
        timestamp: "2024-01-01T00:01:00Z",
        available: 1 as const,
      },
      {
        id: "log3",
        game_id: "test-game",
        player_id: "player1",
        variant: "wrong",
        system: 0 as const,
        timestamp: "2024-01-01T00:02:00Z",
        available: 1 as const,
      },
      {
        id: "log4",
        game_id: "test-game",
        player_id: "player1",
        variant: "correct",
        system: 0 as const,
        timestamp: "2024-01-01T00:03:00Z",
        available: 1 as const,
      },
      {
        id: "log5",
        game_id: "test-game",
        player_id: "player1",
        variant: "wrong",
        system: 0 as const,
        timestamp: "2024-01-01T00:04:00Z",
        available: 1 as const,
      },
    ];
    const result = await ny(mockGame, logs);

    expect(result.scores[0].score).toBe(1); // +1+1-1+1-1 = 1
    expect(result.scores[0].correct).toBe(3);
    expect(result.scores[0].wrong).toBe(2);
    expect(result.scores[0].last_correct).toBe(3);
    expect(result.scores[0].last_wrong).toBe(4);
    expect(result.scores[0].text).toBe("1pt");
    expect(result.scores[0].state).toBe("playing");
  });

  it("複数プレイヤーの場合に正しく計算される", async () => {
    const logs: LogDBProps[] = [
      {
        id: "log1",
        game_id: "test-game",
        player_id: "player1",
        variant: "correct",
        system: 0 as const,
        timestamp: "2024-01-01T00:00:00Z",
        available: 1 as const,
      },
      {
        id: "log2",
        game_id: "test-game",
        player_id: "player2",
        variant: "wrong",
        system: 0 as const,
        timestamp: "2024-01-01T00:01:00Z",
        available: 1 as const,
      },
      {
        id: "log3",
        game_id: "test-game",
        player_id: "player1",
        variant: "correct",
        system: 0 as const,
        timestamp: "2024-01-01T00:02:00Z",
        available: 1 as const,
      },
    ];
    const result = await ny(mockGame, logs);

    expect(result.scores[0].score).toBe(2);
    expect(result.scores[0].correct).toBe(2);
    expect(result.scores[0].wrong).toBe(0);
    expect(result.scores[0].state).toBe("playing");

    expect(result.scores[1].score).toBe(-1);
    expect(result.scores[1].correct).toBe(0);
    expect(result.scores[1].wrong).toBe(1);
    expect(result.scores[1].state).toBe("playing");
  });

  it("勝ち抜け後の操作は無視される", async () => {
    const logs: LogDBProps[] = [
      // 10回正解で勝ち抜け
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `log${i + 1}`,
        game_id: "test-game",
        player_id: "player1",
        variant: "correct" as const,
        system: 0 as const,
        timestamp: `2024-01-01T00:0${i}:00Z`,
        available: 1 as const,
      })),
      // 勝ち抜け後の誤答
      {
        id: "log11",
        game_id: "test-game",
        player_id: "player1",
        variant: "wrong",
        system: 0 as const,
        timestamp: "2024-01-01T00:10:00Z",
        available: 1 as const,
      },
    ];
    const result = await ny(mockGame, logs);

    expect(result.scores[0].score).toBe(10);
    expect(result.scores[0].correct).toBe(10);
    expect(result.scores[0].wrong).toBe(0);
    expect(result.scores[0].state).toBe("win");
    expect(result.scores[0].text).toBe("1st");
  });

  it("敗退後の操作は無視される", async () => {
    const gameWithLosePoint: AllGameProps["ny"] = {
      ...mockGame,
      lose_point: 2,
    };

    const logs: LogDBProps[] = [
      // 2回誤答で敗退
      {
        id: "log1",
        game_id: "test-game",
        player_id: "player1",
        variant: "wrong",
        system: 0 as const,
        timestamp: "2024-01-01T00:00:00Z",
        available: 1 as const,
      },
      {
        id: "log2",
        game_id: "test-game",
        player_id: "player1",
        variant: "wrong",
        system: 0 as const,
        timestamp: "2024-01-01T00:01:00Z",
        available: 1 as const,
      },
      // 敗退後の正解
      {
        id: "log3",
        game_id: "test-game",
        player_id: "player1",
        variant: "correct",
        system: 0 as const,
        timestamp: "2024-01-01T00:02:00Z",
        available: 1 as const,
      },
    ];
    const result = await ny(gameWithLosePoint, logs);

    expect(result.scores[0].score).toBe(-2);
    expect(result.scores[0].correct).toBe(0);
    expect(result.scores[0].wrong).toBe(2);
    expect(result.scores[0].state).toBe("lose");
    expect(result.scores[0].text).toBe("LOSE");
  });

  it("マイナススコアでも正常に動作する", async () => {
    const logs: LogDBProps[] = Array.from({ length: 5 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: "test-game",
      player_id: "player1",
      variant: "wrong" as const,
      system: 0,
      timestamp: `2024-01-01T00:0${i}:00Z`,
      available: 1,
    }));
    const result = await ny(mockGame, logs);

    expect(result.scores[0].score).toBe(-5);
    expect(result.scores[0].correct).toBe(0);
    expect(result.scores[0].wrong).toBe(5);
    expect(result.scores[0].text).toBe("-5pt");
    expect(result.scores[0].state).toBe("playing");
  });

  it("同時勝ち抜けの場合、順位が正しく設定される", async () => {
    const logs: LogDBProps[] = [
      // player1が先に10点到達
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `log${i + 1}`,
        game_id: "test-game",
        player_id: "player1",
        variant: "correct" as const,
        system: 0 as const,
        timestamp: `2024-01-01T00:0${i}:00Z`,
        available: 1 as const,
      })),
      // player2も10点到達
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `log${i + 11}`,
        game_id: "test-game",
        player_id: "player2",
        variant: "correct" as const,
        system: 0 as const,
        timestamp: `2024-01-01T00:${i + 10}:00Z`,
        available: 1 as const,
      })),
    ];
    const result = await ny(mockGame, logs);

    const player1Result = result.scores.find((s) => s.player_id === "player1");
    const player2Result = result.scores.find((s) => s.player_id === "player2");

    expect(player1Result?.state).toBe("win");
    expect(player1Result?.text).toBe("1st");
    expect(player2Result?.state).toBe("win");
    expect(player2Result?.text).toBe("2nd");

    expect(result.winPlayers).toHaveLength(2);
    expect(result.winPlayers[0]).toEqual({ player_id: "player1", text: "1st" });
    expect(result.winPlayers[1]).toEqual({ player_id: "player2", text: "2nd" });
  });
});
