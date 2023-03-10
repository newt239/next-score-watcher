import { numberSign } from "#/utils/commonFunctions";
import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "#/utils/computeScore";
import { GameDBProps, LogDBProps } from "#/utils/db";

// scoreをwrong ptとして利用
const swedish10 = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
  let winThroughPlayer: { player_id: string; text: string } = {
    player_id: "",
    text: "",
  };
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        if (log.variant === "correct") {
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
        } else if (log.variant === "wrong") {
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
        } else {
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
    const text =
      playerState.state === "win"
        ? indicator(order)
        : playerState.state === "lose"
        ? "LOSE"
        : `${playerState.correct}${numberSign("pt")}`;
    if (
      playerState.state === "win" &&
      playerState.last_correct + 1 === gameLogList.length
    ) {
      winThroughPlayer = { player_id: playerState.player_id, text };
    }
    return { ...playerState, order, text };
  });
  return { scoreList: playersState, winThroughPlayer };
};

export default swedish10;
