import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "@/utils/computeScore";
import { detectPlayerState, numberSign } from "@/utils/functions";
import { AllGameProps, LogDBProps, WinPlayerProps } from "@/utils/types";

const aql = async (game: AllGameProps["aql"], gameLogList: LogDBProps[]) => {
  const winPlayers: WinPlayerProps[] = [];
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        switch (log.variant) {
          case "correct":
            return {
              ...playerState,
              correct: playerState.correct + 1,
              score: playerState.score + 1,
              last_correct: qn,
            };
          case "wrong":
            const newWrong = playerState.wrong + 1;
            if (newWrong === 1) {
              return {
                ...playerState,
                wrong: newWrong,
                score: 1,
                last_wrong: qn,
                reach_state: "lose",
              };
            } else {
              return {
                ...playerState,
                wrong: newWrong,
                score: 1,
                last_wrong: qn,
                state: "lose",
                is_incapacity: true,
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
        : playerState.is_incapacity
        ? `${
            game.lose_point! - gameLogList.length + playerState.last_wrong + 1
          }休`
        : numberSign("pt", playerState.correct);
    if (
      state === "win" &&
      playerState.last_correct + 1 === gameLogList.length
    ) {
      winPlayers.push({ player_id: playerState.player_id, text });
    }
    return { ...playerState, order, state, text };
  });
  return {
    scores: playersState,
    winPlayers,
  };
};

export default aql;
