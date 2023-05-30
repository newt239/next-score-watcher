import { detectPlayerState } from "../functions";
import { GameDBProps, LogDBProps, WinPlayerProps } from "../types";

import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "#/utils/computeScore";

const freezex = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
  const winPlayers: WinPlayerProps[] = [];
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
    const state = detectPlayerState(
      game,
      playerState.state,
      order,
      gameLogList.length
    );
    const remainIncapacity =
      playerState.wrong - (gameLogList.length - playerState.last_wrong - 1);
    const text =
      state === "win"
        ? indicator(order)
        : remainIncapacity > 0
        ? `~${remainIncapacity}~`
        : `${playerState.correct}○`;
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

export default freezex;
