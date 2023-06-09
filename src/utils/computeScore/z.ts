import { GameDBProps, LogDBProps, WinPlayerProps } from "../types";

import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "#/utils/computeScore";

const z = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
  const winPlayers: WinPlayerProps[] = [];
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    const lastCorrectPlayer = playersState.find(
      (playerState) => playerState.player_id === log.player_id
    );
    const isResetTiming =
      log.variant === "correct" &&
      lastCorrectPlayer &&
      lastCorrectPlayer.stage === lastCorrectPlayer.correct + 1;
    playersState = playersState.map((playerState) => {
      const stage = playerState.stage;
      if (playerState.player_id === log.player_id) {
        switch (log.variant) {
          case "through":
            return playerState;
          case "correct":
            const newCorrect = playerState.correct + 1;
            if (stage === 4 && newCorrect === 4) {
              return {
                ...playerState,
                correct: newCorrect,
                last_correct: qn,
                state: "win",
                is_incapacity: false,
              };
            } else if (stage === newCorrect) {
              return {
                ...playerState,
                correct: 0,
                wrong: 0,
                stage: playerState.stage + 1,
                is_incapacity: false,
              };
            } else {
              return {
                ...playerState,
                correct: newCorrect,
                is_incapacity: false,
              };
            }
          case "wrong":
            const newWrong = playerState.wrong + 1;
            if (stage === 1 && newWrong === 1) {
              return { ...playerState, wrong: 0, last_wrong: qn };
            } else if (stage === newWrong + 1) {
              return {
                ...playerState,
                is_incapacity: true,
                last_wrong: qn,
                state: "lose",
              };
            } else {
              return { ...playerState, wrong: newWrong, last_wrong: qn };
            }
        }
      } else {
        if (isResetTiming && playerState.state !== "win") {
          return {
            ...playerState,
            correct: 0,
            wrong: 0,
            is_incapacity: false,
            state: "playing",
          };
        } else {
          return playerState;
        }
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
        : playerState.is_incapacity ||
          (gameLogList.length === playerState.last_wrong + 1 &&
            playerState.stage === 1)
        ? "LOCKED"
        : `Stage${playerState.stage}`;
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

export default z;
