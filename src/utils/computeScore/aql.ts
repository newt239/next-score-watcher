import type { AllGameProps, LogDBProps, WinPlayerProps } from "@/utils/types";

import { getInitialPlayersState, getSortedPlayerOrderList, indicator } from "@/utils/computeScore";
import { detectPlayerState, numberSign } from "@/utils/functions";

const aql = async (game: AllGameProps["aql"], gameLogList: LogDBProps[]) => {
  const winPlayers: WinPlayerProps[] = [];
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        switch (log.variant) {
          case "correct":
            return {
              ...playerState,
              correct: playerState.correct + 1,
              score: playerState.score + 1,
              last_correct: qn,
            };
          case "wrong":
            const newWrong = playerState.wrong + 1;
            if (playerState.reach_state === "lose") {
              return {
                ...playerState,
                wrong: newWrong,
                score: 1,
                last_wrong: qn,
                state: "lose",
                reach_state: "lose",
                is_incapacity: true,
              };
            } else {
              return {
                ...playerState,
                wrong: newWrong,
                score: 1,
                last_wrong: qn,
                reach_state: "lose",
              };
            }
          default:
            return playerState;
        }
      } else {
        if (log.variant === "wrong" && playerState.is_incapacity) {
          const wrongPlayerIndex = game.players.findIndex((player) => player.id === log.player_id);
          const incapacityPlayerIndex = game.players.findIndex(
            (player) => player.id === playerState.player_id
          );
          if (
            (wrongPlayerIndex < 5 && incapacityPlayerIndex >= 5) ||
            (wrongPlayerIndex >= 5 && incapacityPlayerIndex < 5)
          ) {
            return {
              ...playerState,
              score: 1,
              state: "playing",
              reach_state: "playing",
              is_incapacity: false,
            };
          }
        }
        return playerState;
      }
    });
  });
  const playerOrderList = getSortedPlayerOrderList(playersState);
  playersState = playersState.map((playerState) => {
    const order = playerOrderList.findIndex((score) => score === playerState.player_id);
    const state = detectPlayerState(game, playerState.state, order, gameLogList.length);
    const text =
      state === "win"
        ? indicator(order)
        : playerState.is_incapacity
          ? `${game.lose_point! - gameLogList.length + playerState.last_wrong + 1}休`
          : numberSign("pt", playerState.correct);
    if (state === "win" && playerState.last_correct + 1 === gameLogList.length) {
      winPlayers.push({ player_id: playerState.player_id, text });
    }
    return { ...playerState, order, state, text };
  });
  return {
    scores: playersState,
    winPlayers,
  };
};

export default aql;
