import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "#/utils/computeScore";
import { detectPlayerState, numberSign } from "#/utils/functions";
import { GameDBProps, LogDBProps, WinPlayerProps } from "#/utils/types";

const squarex = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
  const winPlayers: WinPlayerProps[] = [];
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        let newOddScore = playerState.odd_score;
        let newEvenScore = playerState.even_score;
        switch (log.variant) {
          case "correct":
            if (qn % 2 === 0) {
              newOddScore++;
            } else {
              newEvenScore++;
            }
            if (newOddScore * newEvenScore >= game.win_point!) {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newOddScore * newEvenScore,
                odd_score: newOddScore,
                even_score: newEvenScore,
                last_correct: qn,
                state: "win",
              };
            } else {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newOddScore * newEvenScore,
                odd_score: newOddScore,
                even_score: newEvenScore,
                last_correct: qn,
              };
            }
          case "wrong":
            return {
              ...playerState,
              wrong: playerState.wrong + 1,
              last_wrong: qn,
            };
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

export default squarex;
