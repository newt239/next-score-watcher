import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "#/utils/computeScore";
import { GameDBProps, LogDBProps } from "#/utils/db";

const z = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
  let winThroughPlayer: { player_id: string; text: string } = {
    player_id: "",
    text: "",
  };
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
                isIncapacity: false,
              };
            } else if (stage === newCorrect) {
              return {
                ...playerState,
                correct: 0,
                wrong: 0,
                stage: playerState.stage + 1,
                isIncapacity: false,
              };
            } else {
              return {
                ...playerState,
                correct: newCorrect,
                isIncapacity: false,
              };
            }
          case "wrong":
            const newWrong = playerState.wrong + 1;
            if (stage === 1 && newWrong === 1) {
              return { ...playerState, wrong: 0, last_wrong: qn };
            } else if (stage === newWrong + 1) {
              return {
                ...playerState,
                isIncapacity: true,
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
            isIncapacity: false,
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
        : playerState.isIncapacity ||
          (gameLogList.length === playerState.last_wrong + 1 &&
            playerState.stage === 1)
        ? "LOCKED"
        : `Stage${playerState.stage}`;
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

export default z;
