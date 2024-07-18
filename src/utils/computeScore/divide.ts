import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "@/utils/computeScore";
import { detectPlayerState, numberSign } from "@/utils/functions";
import { AllGameProps, LogDBProps, WinPlayerProps } from "@/utils/types";

const divide = async (
  game: AllGameProps["divide"],
  gameLogList: LogDBProps[]
) => {
  const winPlayers: WinPlayerProps[] = [];
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        switch (log.variant) {
          case "correct":
            const newScoreWhenCorrect = playerState.score + game.correct_me;
            if (newScoreWhenCorrect >= game.win_point!) {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                last_correct: qn,
                score: newScoreWhenCorrect,
                state: "win",
              };
            } else if (newScoreWhenCorrect + 1 === game.win_point!) {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                last_correct: qn,
                score: newScoreWhenCorrect,
                reach_state: "win",
              };
            } else {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                last_correct: qn,
                score: newScoreWhenCorrect,
                state: "playing",
                reach_state: "playing",
              };
            }
          case "wrong":
            const newScoreWhenWrong = Math.floor(
              playerState.score / (playerState.wrong + 1)
            );
            return {
              ...playerState,
              wrong: playerState.wrong + 1,
              last_wrong: qn,
              score: newScoreWhenWrong,
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
      state === "win" ? indicator(order) : numberSign("pt", playerState.score);
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

export default divide;
