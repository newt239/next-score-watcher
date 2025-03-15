import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "@/utils/computeScore";
import { detectPlayerState, numberSign } from "@/utils/functions";
import { AllGameProps, LogDBProps, WinPlayerProps } from "@/utils/types";

/*
stageの値が2のときアドバンテージ状態を表す
*/

const nomxAd = async (
  game: AllGameProps["nomx-ad"],
  gameLogList: LogDBProps[]
) => {
  const winPlayers: WinPlayerProps[] = [];
  let playersState = getInitialPlayersState(game);
  let last_correct_player: string = "";
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        const is_ad = playerState.stage === 2;
        switch (log.variant) {
          case "correct":
            const newScore = playerState.score + (is_ad ? 2 : 1);
            const next_ad =
              (!game.options.streak_over3 && playerState.stage === 1) ||
              game.options.streak_over3;
            last_correct_player = playerState.player_id;
            if (newScore >= game.win_point!) {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newScore,
                last_correct: qn,
                state: "win",
                stage: next_ad ? 2 : 1,
              };
            } else {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newScore,
                last_correct: qn,
                stage: next_ad ? 2 : 1,
              };
            }
          case "wrong":
            const newWrong = playerState.wrong + 1;
            if (last_correct_player === playerState.player_id) {
              last_correct_player = "";
            }
            return {
              ...playerState,
              wrong: newWrong,
              last_wrong: qn,
              state: newWrong >= game.lose_point! ? "lose" : "playing",
              stage: 1,
            };
          default:
            return playerState;
        }
      } else {
        if (log.variant === "correct" && playerState.stage === 2) {
          return {
            ...playerState,
            stage: 1,
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

export default nomxAd;
