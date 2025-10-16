import type { AllGameProps, LogDBProps, WinPlayerProps } from "@/utils/types";

import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "@/utils/computeScore";
import { detectPlayerState, numberSign } from "@/utils/functions";

const nomr = async (game: AllGameProps["nomr"], gameLogList: LogDBProps[]) => {
  const winPlayers: WinPlayerProps[] = [];
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        switch (log.variant) {
          case "correct":
            const newCorrect = playerState.correct + 1;
            if (newCorrect >= game.win_point!) {
              return {
                ...playerState,
                correct: newCorrect,
                last_correct: qn,
                state: "win",
              };
            } else if (newCorrect + 1 === game.win_point!) {
              return {
                ...playerState,
                correct: newCorrect,
                last_correct: qn,
                reach_state: "win",
              };
            } else {
              return {
                ...playerState,
                correct: newCorrect,
                last_correct: qn,
              };
            }
          case "wrong":
            const newWrong = playerState.wrong + 1;
            return {
              ...playerState,
              wrong: newWrong,
              last_wrong: qn,
              is_incapacity: true,
            };
          default:
            return playerState;
        }
      } else {
        if (
          playerState.is_incapacity &&
          game.lose_point! < gameLogList.length - playerState.last_wrong
        ) {
          return {
            ...playerState,
            state: "playing",
            is_incapacity: false,
          };
        } else {
          return playerState;
        }
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
        : playerState.is_incapacity
          ? `${
              game.lose_point! - gameLogList.length + playerState.last_wrong + 1
            }休`
          : numberSign("pt", playerState.correct);
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

export default nomr;
