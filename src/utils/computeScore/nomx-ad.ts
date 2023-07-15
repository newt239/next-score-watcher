import { GameDBProps, LogDBProps, WinPlayerProps } from "../types";

import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "#/utils/computeScore";
import { detectPlayerState, numberSign } from "#/utils/functions";

const nomxAd = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
  const winPlayers: WinPlayerProps[] = [];
  let playersState = getInitialPlayersState(game);
  let last_correct_player: string = "";
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        switch (log.variant) {
          case "correct":
            const newScore =
              playerState.score +
              (last_correct_player === playerState.player_id ? 2 : 1);
            last_correct_player = playerState.player_id;
            if (newScore >= game.win_point!) {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newScore,
                last_correct: qn,
                state: "win",
              };
            } else {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newScore,
                last_correct: qn,
              };
            }
          case "wrong":
            const newWrong = playerState.wrong + 1;
            if (last_correct_player === playerState.player_id) {
              last_correct_player = "";
            }
            if (newWrong >= game.lose_point!) {
              return {
                ...playerState,
                wrong: newWrong,
                last_wrong: qn,
                state: "lose",
              };
            } else {
              return {
                ...playerState,
                wrong: newWrong,
                last_wrong: qn,
              };
            }
          default:
            return playerState;
        }
      } else {
        return playerState;
      }
    });
  });
  const playerOrderList = getSortedPlayerOrderList(playersState);
  playersState = playersState.map((playerState) => {
    const order = playerOrderList.findIndex(
      (score) => score === playerState.player_id
    );
    const state = detectPlayerState(
      game,
      playerState.state,
      order,
      gameLogList.length
    );
    const text =
      state === "win"
        ? indicator(order)
        : state === "lose"
        ? "LOSE"
        : numberSign("pt", playerState.score);
    if (
      state === "win" &&
      playerState.last_correct + 1 === gameLogList.length
    ) {
      winPlayers.push({ player_id: playerState.player_id, text });
    }
    return { ...playerState, order, state, text };
  });
  return { scores: playersState, winPlayers };
};

export default nomxAd;
