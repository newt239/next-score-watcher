import type { LogDBProps } from "@/utils/types";

/** 盤面の一辺のパネル数 */
export const BOARD_SIZE = 5;
/** 盤面全体のパネル数 */
export const PANEL_COUNT = BOARD_SIZE * BOARD_SIZE;
/** アタックチャンスが発火する残りパネル数のしきい値 */
export const ATTACK_CHANCE_THRESHOLD = 5;

/** 1マスの状態。プレイヤーIDが入っていれば点灯済み、null なら空き */
export type Attack25Cell = string | null;
/** 5×5＝25マスの盤面 */
export type Attack25Board = Attack25Cell[];

/** オセロ反転を判定する8方向 */
const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const;

/**
 * 指定したパネルにプレイヤーのパネルを配置し、オセロ形式で挟んだ相手パネルを反転した新しい盤面を返す。
 * @param board 現在の盤面
 * @param index 配置するパネル番号 (0 から PANEL_COUNT - 1)
 * @param playerId 配置するプレイヤーのID
 * @returns 配置と反転を適用した新しい盤面
 */
export const applyReversiFlip = (
  board: Attack25Board,
  index: number,
  playerId: string
): Attack25Board => {
  const newBoard = [...board];
  newBoard[index] = playerId;
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;
  for (const [dr, dc] of DIRECTIONS) {
    const flipTargets: number[] = [];
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
      const targetIndex = r * BOARD_SIZE + c;
      const cell = newBoard[targetIndex];
      // 空きマスや盤端で連鎖が途切れる
      if (cell === null) break;
      // 自分のパネルで挟めたので、間の相手パネルをすべて反転する
      if (cell === playerId) {
        for (const target of flipTargets) {
          newBoard[target] = playerId;
        }
        break;
      }
      flipTargets.push(targetIndex);
      r += dr;
      c += dc;
    }
  }
  return newBoard;
};

/**
 * プレイヤーが指定マスに置いたとき、オセロ反転で裏返るパネル数を数える。
 * @param board 現在の盤面
 * @param index 配置するパネル番号
 * @param playerId 配置するプレイヤーのID
 * @returns 裏返るパネル数（空きでないマスや反転無しなら0）
 */
const countFlips = (board: Attack25Board, index: number, playerId: string): number => {
  if (board[index] !== null) return 0;
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;
  let total = 0;
  for (const [dr, dc] of DIRECTIONS) {
    let r = row + dr;
    let c = col + dc;
    let line = 0;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
      const cell = board[r * BOARD_SIZE + c];
      if (cell === null) break;
      if (cell === playerId) {
        total += line;
        break;
      }
      line += 1;
      r += dr;
      c += dc;
    }
  }
  return total;
};

/**
 * プレイヤーが置くと相手パネルを挟んで反転できる空きマスの一覧を返す。
 * @param board 現在の盤面
 * @param playerId 配置するプレイヤーのID
 * @returns 反転が発生する空きマスのパネル番号一覧
 */
export const getFlippablePanels = (board: Attack25Board, playerId: string): number[] => {
  const result: number[] = [];
  for (let i = 0; i < PANEL_COUNT; i += 1) {
    if (board[i] === null && countFlips(board, i, playerId) > 0) result.push(i);
  }
  return result;
};

/**
 * 点灯済みパネルに隣接（8方向）する空きマスの一覧を返す。
 * @param board 現在の盤面
 * @returns 点灯済みパネルに隣接する空きマスのパネル番号一覧
 */
export const getAdjacentEmptyPanels = (board: Attack25Board): number[] => {
  const result: number[] = [];
  for (let i = 0; i < PANEL_COUNT; i += 1) {
    if (board[i] !== null) continue;
    const row = Math.floor(i / BOARD_SIZE);
    const col = i % BOARD_SIZE;
    const hasLitNeighbor = DIRECTIONS.some(([dr, dc]) => {
      const r = row + dr;
      const c = col + dc;
      return (
        r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r * BOARD_SIZE + c] !== null
      );
    });
    if (hasLitNeighbor) result.push(i);
  }
  return result;
};

/**
 * プレイヤーが獲得できるマスの一覧を返す。
 * 反転できるマスがあれば必ずそのマスのみ。無ければ点灯済みパネルに隣接する空きマス。
 * 盤面が空（初手）ならすべての空きマス。
 * @param board 現在の盤面
 * @param playerId 配置するプレイヤーのID
 * @returns 獲得可能なパネル番号一覧
 */
export const getClaimablePanels = (board: Attack25Board, playerId: string): number[] => {
  const flippable = getFlippablePanels(board, playerId);
  if (flippable.length > 0) return flippable;
  const adjacent = getAdjacentEmptyPanels(board);
  if (adjacent.length > 0) return adjacent;
  return board.flatMap((cell, i) => (cell === null ? [i] : []));
};

/**
 * 盤面から各プレイヤーの保持パネル数を集計する。
 * @param board 現在の盤面
 * @returns プレイヤーIDをキー、保持パネル数を値とするレコード
 */
export const countPanels = (board: Attack25Board): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const cell of board) {
    if (cell !== null) {
      counts[cell] = (counts[cell] ?? 0) + 1;
    }
  }
  return counts;
};

/**
 * ゲームログを時系列に畳み込み、アタック25の盤面とアタックチャンスの使用状況を計算する。
 * @param logs 時系列順のゲームログ
 * @param attackChanceEnabled アタックチャンスを有効にするかどうか
 * @returns 盤面とアタックチャンス使用済みフラグ
 */
/**
 * パネル番号が盤面の範囲内にある整数か判定する。
 * @param index 検証するパネル番号
 * @returns 0 以上 PANEL_COUNT 未満の整数なら true
 */
const isValidPanelIndex = (index: number): boolean =>
  Number.isInteger(index) && index >= 0 && index < PANEL_COUNT;

export const computeAttack25Board = (logs: LogDBProps[], attackChanceEnabled: boolean) => {
  let board: Attack25Board = Array.from({ length: PANEL_COUNT }, () => null);
  let attackChanceUsed = false;
  for (const log of logs) {
    if (log.variant !== "correct" || log.detail?.type !== "attack25") continue;
    const { panel, removed_panel } = log.detail;
    // 範囲外や既に埋まっているパネルは破損ログとみなし、ログ畳み込みを止めずに無視する
    if (!isValidPanelIndex(panel)) continue;
    if (board[panel] !== null) continue;
    const emptyBefore = board.filter((cell) => cell === null).length;
    // この正解より前に空きが ATTACK_CHANCE_THRESHOLD 枚以下なら、これがアタックチャンスのターン
    const isAttackChanceTurn =
      attackChanceEnabled && !attackChanceUsed && emptyBefore <= ATTACK_CHANCE_THRESHOLD;
    board = applyReversiFlip(board, panel, log.player_id);
    if (removed_panel !== undefined) {
      // 消去対象も範囲内かつ点灯済みのときだけ反映する
      if (isValidPanelIndex(removed_panel) && board[removed_panel] !== null) {
        board[removed_panel] = null;
      }
    }
    if (isAttackChanceTurn) attackChanceUsed = true;
  }
  return { board, attackChanceUsed } as const;
};

/**
 * 次の正解がアタックチャンスの対象かどうかを判定する。
 * @param board 現在の盤面
 * @param attackChanceUsed アタックチャンスが既に使用されたか
 * @param attackChanceEnabled アタックチャンスが有効か
 * @returns 次の正解がアタックチャンス対象なら true
 */
export const isAttackChanceActive = (
  board: Attack25Board,
  attackChanceUsed: boolean,
  attackChanceEnabled: boolean
): boolean => {
  const emptyCount = board.filter((cell) => cell === null).length;
  return (
    attackChanceEnabled &&
    !attackChanceUsed &&
    emptyCount > 0 &&
    emptyCount <= ATTACK_CHANCE_THRESHOLD
  );
};
