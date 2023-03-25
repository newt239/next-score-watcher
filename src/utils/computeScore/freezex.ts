import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "#/utils/computeScore";
import { GameDBProps, LogDBProps } from "#/utils/db";

const freezex = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
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
            if (newCorrect === game.win_point) {
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
              };
            }
          case "wrong":
            return {
              ...playerState,
              wrong: playerState.wrong + 1,
              last_wrong: qn,
            };
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
    const remainIncapacity =
      playerState.wrong - (gameLogList.length - playerState.last_wrong - 1);
    const text =
      playerState.state === "win"
        ? indicator(order)
        : remainIncapacity > 0
        ? `~${remainIncapacity}~`
        : `${playerState.correct}○`;
    if (
      playerState.state === "win" &&
      playerState.last_correct + 1 === gameLogList.length
    ) {
      winThroughPlayer = { player_id: playerState.player_id, text };
    }
    return { ...playerState, order, text, isIncapacity: remainIncapacity > 0 };
  });
  return { scoreList: playersState, winThroughPlayer };
};

export default freezex;
