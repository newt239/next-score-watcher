import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "@/utils/computeScore";
import { detectPlayerState, numberSign } from "@/utils/functions";
import { AllGameProps, LogDBProps, WinPlayerProps } from "@/utils/types";

// scoreをwrong ptとして利用
const swedish10 = async (
  game: AllGameProps["swedish10"],
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
            if (newCorrect >= game.win_point!) {
              return {
                ...playerState,
                correct: newCorrect,
                last_correct: qn,
                state: "win",
              };
            } else {
              return {
                ...playerState,
                correct: newCorrect,
                last_correct: qn,
              };
            }
          case "wrong":
            let newWrong = playerState.wrong;
            if (playerState.correct <= 0) {
              newWrong += 1;
            } else if (playerState.correct <= 2) {
              newWrong += 2;
            } else if (playerState.correct <= 5) {
              newWrong += 3;
            } else {
              newWrong += 4;
            }
            if (newWrong >= game.lose_point!) {
              return {
                ...playerState,
                wrong: newWrong,
                score: newWrong,
                last_wrong: qn,
                state: "lose",
              };
            } else {
              return {
                ...playerState,
                wrong: newWrong,
                score: newWrong,
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

export default swedish10;
