import { GameDBProps, LogDBProps, WinPlayerProps } from "../types";

import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "#/utils/computeScore";

const variousFluctuations = async (
  game: GameDBProps,
  gameLogList: LogDBProps[]
) => {
  const winPlayers: WinPlayerProps[] = [];
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        switch (log.variant) {
          case "through":
            return playerState;
          case "correct":
            const correct_point = game.players.find(
              (gamePlayer) => gamePlayer.id === playerState.player_id
            )?.base_correct_point!;
            const newScore = playerState.score + correct_point;
            if (newScore >= game.win_point!) {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newScore,
                last_correct: qn,
                state: "win",
              };
            } else if (newScore + correct_point >= game.win_point!) {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newScore,
                last_correct: qn,
                reachState: "win",
              };
            } else {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newScore,
              };
            }
          case "wrong":
            const wrong_point = game.players.find(
              (gamePlayer) => gamePlayer.id === playerState.player_id
            )?.base_wrong_point!;
            return {
              ...playerState,
              wrong: playerState.wrong + 1,
              score: playerState.score + wrong_point,
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
        : playerState.state === "lose"
        ? "LOSE"
        : `${playerState.score}pt`;
    if (
      playerState.state === "win" &&
      playerState.last_correct + 1 === gameLogList.length
    ) {
      winPlayers.push({ player_id: playerState.player_id, text });
    }
    return { ...playerState, order, text };
  });
  return { scores: playersState, winPlayers };
};

export default variousFluctuations;
