import { numberSign } from "#/utils/commonFunctions";
import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "#/utils/computeScore";
import { GameDBProps, LogDBProps } from "#/utils/db";

const ny = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
  let winThroughPlayer: { player_id: string; text: string } = {
    player_id: "",
    text: "",
  };
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        switch (log.variant) {
          case "through":
            return playerState;
          case "correct":
            const newCorrect = playerState.correct + 1;
            const newScore = playerState.score + 1;
            if (newScore >= game.win_point!) {
              return {
                ...playerState,
                score: newScore,
                correct: newCorrect,
                last_correct: qn,
                state: "win",
              };
            } else if (newScore === game.win_point!) {
              return {
                ...playerState,
                score: newScore,
                correct: newCorrect,
                last_correct: qn,
                reachState: "win",
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
                score: playerState.score - 1,
                wrong: newWrong,
                last_wrong: qn,
                state: "lose",
              };
            } else if (
              newWrong + 1 === game.lose_point! &&
              playerState.correct + 1 !== game.win_point!
            ) {
              return {
                ...playerState,
                score: playerState.score - 1,
                wrong: newWrong,
                last_wrong: qn,
                reachState: "lose",
              };
            } else {
              return {
                ...playerState,
                score: playerState.score - 1,
                wrong: newWrong,
                last_wrong: qn,
              };
            }
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
        : numberSign("pt", playerState.score);
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

export default ny;
