import { describe, expect, it } from "vitest";

import {
  applyReversiFlip,
  computeAttack25Board,
  countPanels,
  getAdjacentEmptyPanels,
  getClaimablePanels,
  getFlippablePanels,
  FIRST_PANEL_INDEX,
  isAttackChanceActive,
  PANEL_COUNT,
} from "@/utils/attack25";
import attack25 from "@/utils/computeScore/attack25";

import type { Attack25Board } from "@/utils/attack25";
import type { AllGameProps, LogDBProps } from "@/utils/types";

/** 全マス空きの盤面を生成する */
const emptyBoard = (): Attack25Board => Array.from({ length: PANEL_COUNT }, () => null);

/** 正解ログを生成する */
const correctLog = (
  id: string,
  playerId: string,
  panel: number,
  removedPanel?: number
): LogDBProps => ({
  id,
  game_id: "test-game",
  player_id: playerId,
  variant: "correct",
  system: 0,
  timestamp: id,
  available: 1,
  detail: {
    type: "attack25",
    panel,
    ...(removedPanel === undefined ? {} : { removed_panel: removedPanel }),
  },
});

describe("applyReversiFlip", () => {
  it("横方向で挟んだ相手パネルを反転する", () => {
    let board = emptyBoard();
    board[0] = "A";
    board[1] = "B";
    board = applyReversiFlip(board, 2, "A");
    expect(board[0]).toBe("A");
    expect(board[1]).toBe("A");
    expect(board[2]).toBe("A");
  });

  it("挟んでいなければ反転しない", () => {
    let board = emptyBoard();
    board[1] = "B";
    board = applyReversiFlip(board, 2, "A");
    expect(board[1]).toBe("B");
    expect(board[2]).toBe("A");
  });

  it("空きマスがあると連鎖が途切れる", () => {
    let board = emptyBoard();
    // index0 に配置 → 右に B,B,空き と続くため反転しない
    board[1] = "B";
    board[2] = "B";
    board = applyReversiFlip(board, 0, "A");
    expect(board[1]).toBe("B");
    expect(board[2]).toBe("B");
  });

  it("斜め方向でも反転する", () => {
    let board = emptyBoard();
    board[0] = "A"; // (0,0)
    board[6] = "B"; // (1,1)
    board = applyReversiFlip(board, 12, "A"); // (2,2)
    expect(board[6]).toBe("A");
  });
});

describe("computeAttack25Board", () => {
  it("正解ログを畳み込んで盤面を再構築する", () => {
    const logs = [correctLog("1", "A", 0), correctLog("2", "B", 1), correctLog("3", "A", 2)];
    const { board } = computeAttack25Board(logs, true);
    expect(board[0]).toBe("A");
    expect(board[1]).toBe("A"); // BがAに挟まれて反転
    expect(board[2]).toBe("A");
  });

  it("removed_panel を持つログでパネルが空きに戻る", () => {
    const logs = [
      correctLog("1", "A", 0),
      correctLog("2", "B", 5, 0), // 自分はpanel5を獲得し、panel0を消去
    ];
    const { board } = computeAttack25Board(logs, true);
    expect(board[0]).toBeNull();
    expect(board[5]).toBe("B");
  });

  it("panel を持たないログは盤面に影響しない", () => {
    const logs: LogDBProps[] = [
      { ...correctLog("1", "A", 0) },
      {
        id: "2",
        game_id: "test-game",
        player_id: "B",
        variant: "wrong",
        system: 0,
        timestamp: "2",
        available: 1,
      },
    ];
    const { board } = computeAttack25Board(logs, true);
    expect(countPanels(board)).toEqual({ A: 1 });
  });

  it("残り5枚での正解でアタックチャンスが消費される", () => {
    // panel0-19 を埋め、空きは20-24の5枚
    const logs = Array.from({ length: 20 }, (_, i) => correctLog(`${i}`, "A", i));
    const before = computeAttack25Board(logs, true);
    expect(before.attackChanceUsed).toBe(false);
    // 21枚目の正解（空き5枚の状態での正解）がアタックチャンス
    logs.push(correctLog("20", "A", 20));
    const after = computeAttack25Board(logs, true);
    expect(after.attackChanceUsed).toBe(true);
  });

  it("オプション無効ならアタックチャンスは消費されない", () => {
    const logs = Array.from({ length: 21 }, (_, i) => correctLog(`${i}`, "A", i));
    const { attackChanceUsed } = computeAttack25Board(logs, false);
    expect(attackChanceUsed).toBe(false);
  });

  it("panel が範囲外のログは盤面に影響しない", () => {
    const logs = [
      correctLog("1", "A", 0),
      correctLog("2", "B", -1),
      correctLog("3", "B", PANEL_COUNT),
      correctLog("4", "B", 1.5),
    ];
    const { board } = computeAttack25Board(logs, true);
    expect(countPanels(board)).toEqual({ A: 1 });
  });

  it("既に埋まっているマスへの正解ログは無視される", () => {
    const logs = [
      correctLog("1", "A", 0),
      correctLog("2", "B", 0), // 既にAが埋めているので無視
    ];
    const { board } = computeAttack25Board(logs, true);
    expect(board[0]).toBe("A");
    expect(countPanels(board)).toEqual({ A: 1 });
  });

  it("removed_panel が範囲外または空きの場合は消去を行わない", () => {
    const logs = [
      correctLog("1", "A", 0),
      correctLog("2", "B", 5, PANEL_COUNT), // 範囲外
      correctLog("3", "B", 6, 10), // 空きマスを指定
    ];
    const { board } = computeAttack25Board(logs, true);
    expect(board[0]).toBe("A");
    expect(board[5]).toBe("B");
    expect(board[6]).toBe("B");
    expect(board[10]).toBeNull();
  });
});

describe("isAttackChanceActive", () => {
  it("空き5枚・未使用・有効なら true", () => {
    const board = emptyBoard();
    for (let i = 0; i < 20; i++) board[i] = "A";
    expect(isAttackChanceActive(board, false, true)).toBe(true);
  });

  it("空きが6枚なら false", () => {
    const board = emptyBoard();
    for (let i = 0; i < 19; i++) board[i] = "A";
    expect(isAttackChanceActive(board, false, true)).toBe(false);
  });

  it("既に使用済みなら false", () => {
    const board = emptyBoard();
    for (let i = 0; i < 20; i++) board[i] = "A";
    expect(isAttackChanceActive(board, true, true)).toBe(false);
  });

  it("オプション無効なら false", () => {
    const board = emptyBoard();
    for (let i = 0; i < 20; i++) board[i] = "A";
    expect(isAttackChanceActive(board, false, false)).toBe(false);
  });
});

describe("獲得可能マスの判定", () => {
  it("getFlippablePanels は反転が起きる空きマスを返す", () => {
    const board = emptyBoard();
    board[0] = "A";
    board[1] = "B";
    const flippable = getFlippablePanels(board, "A");
    // index2 に A を置くと index1 の B が反転する
    expect(flippable).toContain(2);
  });

  it("getAdjacentEmptyPanels は点灯済みパネルに隣接する空きマスを返す", () => {
    const board = emptyBoard();
    board[0] = "A";
    const adjacent = getAdjacentEmptyPanels(board);
    // (0,0)の隣接 = index1,5,6
    expect(adjacent.sort((x, y) => x - y)).toEqual([1, 5, 6]);
  });

  it("getClaimablePanels: はさめるマスがあればそのマスのみ返す", () => {
    const board = emptyBoard();
    board[0] = "A";
    board[1] = "B";
    expect(getClaimablePanels(board, "A")).toEqual([2]);
  });

  it("getClaimablePanels: はさめない場合は隣接する空きマスを返す", () => {
    const board = emptyBoard();
    board[0] = "A";
    const claimable = getClaimablePanels(board, "A");
    expect(claimable.sort((x, y) => x - y)).toEqual([1, 5, 6]);
  });

  it("getClaimablePanels: 盤面が空（初手）なら中央パネル（13番）のみ返す", () => {
    expect(getClaimablePanels(emptyBoard(), "A")).toEqual([FIRST_PANEL_INDEX]);
  });
});

describe("attack25形式のスコア計算", () => {
  const mockGame: AllGameProps["attack25"] = {
    id: "test-game",
    name: "テストゲーム",
    rule: "attack25",
    players: ["A", "B", "C", "D"].map((id) => ({
      id,
      name: `プレイヤー${id}`,
      initial_correct: 0,
      initial_wrong: 0,
      base_correct_point: 0,
      base_wrong_point: 0,
    })),
    correct_me: 1,
    wrong_me: -1,
    discord_webhook_url: "",
    options: { attack_chance: true },
    editable: false,
    last_open: "2025-01-01T00:00:00.000Z",
  };

  it("保持パネル数がスコアになる", async () => {
    const logs = [
      correctLog("1", "A", 0),
      correctLog("2", "B", 1),
      correctLog("3", "A", 2), // panel1のBがAに反転
    ];
    const result = await attack25(mockGame, logs);
    const a = result.scores.find((s) => s.player_id === "A");
    const b = result.scores.find((s) => s.player_id === "B");
    expect(a?.score).toBe(3);
    expect(a?.correct).toBe(2);
    expect(b?.score).toBe(0);
    expect(a?.state).toBe("playing");
  });

  it("全パネルが埋まると最多保持者が勝利する", async () => {
    const logs = Array.from({ length: PANEL_COUNT }, (_, i) => correctLog(`${i}`, "A", i));
    const result = await attack25(mockGame, logs);
    const a = result.scores.find((s) => s.player_id === "A");
    expect(a?.score).toBe(25);
    expect(a?.state).toBe("win");
    expect(result.scores.filter((s) => s.state === "lose")).toHaveLength(3);
    expect(result.winPlayers).toHaveLength(1);
    expect(result.winPlayers[0].player_id).toBe("A");
  });

  it("ログが無い初期状態では全員0枚", async () => {
    const result = await attack25(mockGame, []);
    expect(result.scores).toHaveLength(4);
    expect(result.scores.every((s) => s.score === 0 && s.state === "playing")).toBe(true);
    expect(result.winPlayers).toEqual([]);
  });
});
