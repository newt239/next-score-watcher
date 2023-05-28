import { GameDBProps, LogDBProps, WinPlayerProps } from "../types";

import { numberSign } from "#/utils/commonFunctions";
import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "#/utils/computeScore";

const attacksurvival = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
  const winPlayers: WinPlayerProps[] = [];
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        const newScore =
          playerState.score +
          (log.variant === "wrong" ? game.wrong_me : game.correct_me);
        switch (log.variant) {
          case "through":
            return playerState;
          case "correct":
            if (newScore + game.wrong_me <= 0) {
              return {
                ...playerState,
                score: newScore,
                correct: playerState.correct + 1,
                last_wrong: qn,
                reachState: "lose",
              };
            } else {
              return {
                ...playerState,
                score: newScore,
                correct: playerState.correct + 1,
                last_wrong: qn,
              };
            }
          case "wrong":
            const newWrong = playerState.wrong + 1;
            if (newScore <= 0) {
              return {
                ...playerState,
                score: newScore,
                wrong: newWrong,
                last_wrong: qn,
                state: "lose",
              };
            } else if (newScore + game.wrong_me <= 0) {
              return {
                ...playerState,
                score: newScore,
                wrong: newWrong,
                last_wrong: qn,
                reachState: "lose",
              };
            } else {
              return {
                ...playerState,
                score: newScore,
                wrong: newWrong,
                last_wrong: qn,
              };
            }
        }
      } else {
        const newScore =
          playerState.score +
          (log.variant === "correct"
            ? game.correct_other!
            : log.variant === "wrong"
            ? game.wrong_other!
            : 0);
        if (newScore <= 0) {
          return {
            ...playerState,
            score: 0,
            state: "lose",
          };
        } else if (
          newScore + game.correct_other! <= 0 ||
          newScore + game.wrong_me <= 0
        ) {
          return {
            ...playerState,
            score: newScore,
            reachState: "lose",
          };
        } else {
          return {
            ...playerState,
            score: newScore,
          };
        }
      }
    });
  });
  const playerOrderList = getSortedPlayerOrderList(playersState);
  playersState = playersState.map((playerState) => {
    const order = playerOrderList.findIndex(
      (score) => score === playerState.player_id
    );
    const text =
      playerState.state === "win"
        ? indicator(order)
        : playerState.state === "lose"
        ? "LOSE"
        : numberSign("pt", playerState.score);
    if (
      playerState.state === "win" &&
      playerState.last_correct + 1 === gameLogList.length
    ) {
      winPlayers.push({ player_id: playerState.player_id, text });
    }
    return { ...playerState, order, text };
  });
  return { scores: playersState, winPlayers };
};

export default attacksurvival;
