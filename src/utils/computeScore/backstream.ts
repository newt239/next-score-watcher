import type { AllGameProps, LogDBProps, WinPlayerProps } from "@/utils/types";

import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "@/utils/computeScore";
import { detectPlayerState, numberSign } from "@/utils/functions";

const backstream = async (
  game: AllGameProps["backstream"],
  gameLogList: LogDBProps[]
) => {
  const winPlayers: WinPlayerProps[] = [];
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        switch (log.variant) {
          case "correct":
            const newCorrect = playerState.correct + 1;
            const newScoreInCorrectCase = playerState.score + 1;
            if (newScoreInCorrectCase >= game.win_point!) {
              return {
                ...playerState,
                correct: newCorrect,
                score: newScoreInCorrectCase,
                last_correct: qn,
                state: "win",
              };
            } else {
              return {
                ...playerState,
                correct: newCorrect,
                score: newScoreInCorrectCase,
                last_correct: qn,
              };
            }
          case "wrong":
            const newWrong = playerState.wrong + 1;
            const newScoreInWrongCase = playerState.score - newWrong;
            if (newScoreInWrongCase <= game.lose_point!) {
              return {
                ...playerState,
                wrong: newWrong,
                score: newScoreInWrongCase,
                last_wrong: qn,
                state: "lose",
              };
            } else {
              return {
                ...playerState,
                wrong: newWrong,
                score: newScoreInWrongCase,
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
        : playerState.state === "lose"
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

export default backstream;
