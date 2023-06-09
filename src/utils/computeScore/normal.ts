import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
} from "#/utils/computeScore";
import { GameDBProps, LogDBProps } from "#/utils/types";

const normal = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        const newScore =
          playerState.score +
          (log.variant === "correct" ? game.correct_me : game.wrong_me);
        switch (log.variant) {
          case "through":
            return playerState;
          case "correct":
            if (newScore >= game.win_point!) {
              return {
                ...playerState,
                correct: playerState.correct + 1,
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
          case "wrong":
            const newWrong = playerState.wrong + 1;
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
    return { ...playerState, order };
  });

  return {
    scores: playersState,
    winPlayers: [],
  };
};

export default normal;
