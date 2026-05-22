import { describe, expect, it } from "vitest";

import swedish10 from "@/utils/computeScore/swedish10";

import type { AllGameProps, LogDBProps } from "@/utils/types";

describe("swedish10形式のスコア計算", () => {
  const mockGame: AllGameProps["swedish10"] = {
    id: "test-game",
    name: "テストゲーム",
    rule: "swedish10" as const,
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
    win_point: 10,
    lose_point: 10,
    win_through: 1,
    discord_webhook_url: "",
    options: undefined,
    editable: true,
    last_open: "2025-01-01T00:00:00.000Z",
  };

  it("初期状態で正しくスコアが計算される", async () => {
    const logs: LogDBProps[] = [];
    const result = await swedish10(mockGame, logs);

    expect(result.scores[0]).toEqual({
      game_id: "test-game",
      player_id: "player1",
      score: 0,
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

  it("正解時に正解数が正しく加算される", async () => {
    const logs: LogDBProps[] = [
      {
        id: "log1",
        game_id: "test-game",
        player_id: "player1",
        variant: "correct",
        system: 0 as const,
        timestamp: "1000",
        available: 1 as const,
      },
    ];
    const result = await swedish10(mockGame, logs);

    expect(result.scores[0].correct).toBe(1);
    expect(result.scores[0].wrong).toBe(0);
    expect(result.scores[0].text).toBe("1pt");
    expect(result.scores[0].state).toBe("playing");
  });

  it("0問正解時の誤答は1失点", async () => {
    const logs: LogDBProps[] = [
      {
        id: "log1",
        game_id: "test-game",
        player_id: "player1",
        variant: "wrong",
        system: 0 as const,
        timestamp: "1000",
        available: 1 as const,
      },
    ];
    const result = await swedish10(mockGame, logs);

    expect(result.scores[0].correct).toBe(0);
    expect(result.scores[0].wrong).toBe(1);
    expect(result.scores[0].text).toBe("0pt");
  });

  it("3-5問正解時の誤答は3失点", async () => {
    const logs: LogDBProps[] = [
      // 3問正解
      ...Array.from({ length: 3 }, (_, i) => ({
        id: `log${i + 1}`,
        game_id: "test-game",
        player_id: "player1",
        variant: "correct" as const,
        system: 0 as const,
        timestamp: `${1000 + i}`,
        available: 1 as const,
      })),
      // 1問誤答（2失点）
      {
        id: "log4",
        game_id: "test-game",
        player_id: "player1",
        variant: "wrong",
        system: 0 as const,
        timestamp: "1003",
        available: 1,
      },
    ];
    const result = await swedish10(mockGame, logs);

    expect(result.scores[0].correct).toBe(3);
    expect(result.scores[0].wrong).toBe(3); // 正解3問時の誤答ペナルティは3
    expect(result.scores[0].text).toBe("3pt");
  });

  it("6問以上正解時の誤答は4失点", async () => {
    const logs: LogDBProps[] = [
      // 6問正解
      ...Array.from({ length: 6 }, (_, i) => ({
        id: `log${i + 1}`,
        game_id: "test-game",
        player_id: "player1",
        variant: "correct" as const,
        system: 0 as const,
        timestamp: `${1000 + i}`,
        available: 1 as const,
      })),
      // 1問誤答（3失点）
      {
        id: "log7",
        game_id: "test-game",
        player_id: "player1",
        variant: "wrong",
        system: 0 as const,
        timestamp: "1006",
        available: 1 as const,
      },
    ];
    const result = await swedish10(mockGame, logs);

    expect(result.scores[0].correct).toBe(6);
    expect(result.scores[0].wrong).toBe(4); // 正解6問以上時の誤答ペナルティは4
    expect(result.scores[0].text).toBe("6pt");
  });

  it("10問正解で勝ち抜け", async () => {
    const logs: LogDBProps[] = Array.from({ length: 10 }, (_, i) => ({
      id: `log${i + 1}`,
      game_id: "test-game",
      player_id: "player1",
      variant: "correct" as const,
      system: 0 as const,
      timestamp: `${1000 + i}`,
      available: 1 as const,
    }));
    const result = await swedish10(mockGame, logs);

    expect(result.scores[0].correct).toBe(10);
    expect(result.scores[0].state).toBe("win");
    expect(result.winPlayers.map((w) => w.player_id)).toContain("player1");
  });

  it("10失点で失格", async () => {
    const logs: LogDBProps[] = [
      // 3問正解して誤答のペナルティを2にする
      ...Array.from({ length: 3 }, (_, i) => ({
        id: `log${i + 1}`,
        game_id: "test-game",
        player_id: "player1",
        variant: "correct" as const,
        system: 0 as const,
        timestamp: `${1000 + i * 2}`,
        available: 1 as const,
      })),
      // 5回誤答して10失点
      ...Array.from({ length: 5 }, (_, i) => ({
        id: `log${4 + i * 2}`,
        game_id: "test-game",
        player_id: "player1",
        variant: "wrong" as const,
        system: 0 as const,
        timestamp: `${1000 + (3 + i) * 2 + 1}`,
        available: 1 as const,
      })),
    ];
    const result = await swedish10(mockGame, logs);

    expect(result.scores[0].correct).toBe(3);
    // 正解3問なので誤答ペナルティは3。4回目で12失点に達しlose、5回目は無視される
    expect(result.scores[0].wrong).toBe(12);
    expect(result.scores[0].state).toBe("lose");
  });
});
