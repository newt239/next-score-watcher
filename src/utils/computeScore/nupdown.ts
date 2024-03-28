import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "~/utils/computeScore";
import { detectPlayerState, numberSign } from "~/utils/functions";
import { AllGameProps, LogDBProps, WinPlayerProps } from "~/utils/types";

const nupdown = async (
  game: AllGameProps["nupdown"],
  gameLogList: LogDBProps[]
) => {
  const winPlayers: WinPlayerProps[] = [];
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        switch (log.variant) {
          case "correct":
            const newScore = playerState.score + 1;
            const newCorrect = playerState.correct + 1;
            if (newScore >= game.win_point!) {
              return {
                ...playerState,
                score: newScore,
                correct: newCorrect,
                last_correct: qn,
                state: "win",
              };
            } else if (newScore + 1 === game.win_point!) {
              return {
                ...playerState,
                score: newScore,
                correct: newCorrect,
                last_correct: qn,
                reach_state: "win",
              };
            } else {
              return {
                ...playerState,
                score: newScore,
                correct: newCorrect,
                last_correct: qn,
              };
            }
          case "wrong":
            const newWrong = playerState.wrong + 1;
            if (newWrong >= game.lose_point!) {
              return {
                ...playerState,
                score: 0,
                wrong: newWrong,
                last_wrong: qn,
                state: "lose",
              };
            } else if (
              newWrong + 1 === game.lose_point! &&
              playerState.score + 1 !== game.win_point!
            ) {
              return {
                ...playerState,
                score: 0,
                wrong: newWrong,
                last_wrong: qn,
                reach_state: "lose",
              };
            } else {
              return {
                ...playerState,
                score: 0,
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

export default nupdown;
