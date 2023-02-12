import { numberSign } from "#/utils/commonFunctions";
import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "#/utils/computeScore";
import { GameDBProps, LogDBProps } from "#/utils/db";

const nbyn = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
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
          const newScore = newCorrect * (game.win_point! - playerState.wrong);
          if (newScore >= game.win_point! ** 2) {
            return {
              ...playerState,
              correct: newCorrect,
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
        } else if (log.variant === "wrong") {
          const newWrong = playerState.wrong + 1;
          const newScore = playerState.correct * (game.win_point! - newWrong);
          if (newWrong >= game.lose_point!) {
            return {
              ...playerState,
              wrong: newWrong,
              score: newScore,
              last_wrong: qn,
              state: "lose",
            };
          } else {
            return {
              ...playerState,
              wrong: newWrong,
              score: newScore,
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
        : `${playerState.score}${numberSign("pt")}`;
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

export default nbyn;
