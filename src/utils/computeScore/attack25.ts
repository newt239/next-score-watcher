import { computeAttack25Board, countPanels } from "@/utils/attack25";
import { getInitialPlayersState, getSortedPlayerOrderList, indicator } from "@/utils/computeScore";

import type { AllGameProps, LogDBProps, WinPlayerProps } from "@/utils/types";

/**
 * アタック25形式のスコアを計算する。盤面の保持パネル数をスコアとし、全パネルが埋まったら順位を確定する。
 * @param game アタック25のゲーム情報
 * @param gameLogList 時系列順のゲームログ
 * @returns 各プレイヤーのスコアと勝者情報
 */
const attack25 = async (game: AllGameProps["attack25"], gameLogList: LogDBProps[]) => {
  const winPlayers: WinPlayerProps[] = [];
  const attackChanceEnabled = game.options.attack_chance;
  const { board } = computeAttack25Board(gameLogList, attackChanceEnabled);
  const counts = countPanels(board);
  const boardFull = board.every((cell) => cell !== null);

  // 末尾のログを除いた盤面と比較し、このログでちょうど満杯になったかを判定する
  const prevBoardFull =
    gameLogList.length > 0 &&
    computeAttack25Board(gameLogList.slice(0, -1), attackChanceEnabled).board.every(
      (cell) => cell !== null
    );
  const filledThisLog = boardFull && !prevBoardFull;

  let playersState = getInitialPlayersState(game);
  playersState = playersState.map((playerState) => {
    const playerLogs = gameLogList.filter((log) => log.player_id === playerState.player_id);
    return {
      ...playerState,
      score: counts[playerState.player_id] ?? 0,
      correct: playerLogs.filter((log) => log.variant === "correct").length,
      wrong: playerLogs.filter((log) => log.variant === "wrong").length,
    };
  });

  const playerOrderList = getSortedPlayerOrderList(playersState);
  playersState = playersState.map((playerState) => {
    const order = playerOrderList.findIndex((id) => id === playerState.player_id);
    const state = boardFull ? (order === 0 ? "win" : "lose") : "playing";
    const text = state === "win" ? indicator(order) : `${playerState.score}枚`;
    if (state === "win" && filledThisLog) {
      winPlayers.push({ player_id: playerState.player_id, text });
    }
    return { ...playerState, order, state, text };
  });

  return {
    scores: playersState,
    winPlayers,
  };
};

export default attack25;
