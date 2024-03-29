import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "~/utils/computeScore";
import { detectPlayerState, numberSign } from "~/utils/functions";
import { AllGameProps, LogDBProps, WinPlayerProps } from "~/utils/types";

const endlessChance = async (
  game: AllGameProps["endless-chance"],
  gameLogList: LogDBProps[]
) => {
  const winPlayers: WinPlayerProps[] = [];
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (log.player_id.includes(playerState.player_id)) {
        switch (log.variant) {
          case "correct":
            const newCorrect = playerState.correct + 1;
            if (newCorrect >= game.win_point!) {
              return {
                ...playerState,
                correct: newCorrect,
                last_correct: qn,
                state: "win",
              };
            } else if (newCorrect + 1 === game.win_point!) {
              return {
                ...playerState,
                correct: newCorrect,
                last_correct: qn,
                reach_state: "win",
              };
            } else {
              return {
                ...playerState,
                correct: newCorrect,
                last_correct: qn,
              };
            }
          case "multiple_wrong":
            const newWrong = playerState.wrong + 1;
            if (game.options.use_r) {
              return {
                ...playerState,
                wrong: newWrong,
                last_wrong: qn,
                is_incapacity: true,
              };
            } else {
              if (newWrong >= game.lose_point!) {
                return {
                  ...playerState,
                  wrong: newWrong,
                  last_wrong: qn,
                  state: "lose",
                };
              } else if (
                newWrong + 1 === game.lose_point! &&
                playerState.correct + 1 !== game.win_point!
              ) {
                return {
                  ...playerState,
                  wrong: newWrong,
                  last_wrong: qn,
                  reach_state: "lose",
                };
              } else {
                return {
                  ...playerState,
                  wrong: newWrong,
                  last_wrong: qn,
                };
              }
            }
          default:
            return playerState;
        }
      } else {
        if (game.options.use_r) {
          if (
            playerState.is_incapacity &&
            game.lose_point! <
              gameLogList.filter((log) =>
                [
                  "correct",
                  "wrong",
                  "through",
                  "multiple_correct",
                  "multiple_wrong",
                ].includes(log.variant)
              ).length -
                playerState.last_wrong
          ) {
            return {
              ...playerState,
              state: "playing",
              is_incapacity: false,
            };
          }
        }
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
      gameLogList.length // TODO: logの長さチェックについて確認
    );
    const text =
      state === "win"
        ? indicator(order)
        : playerState.is_incapacity
        ? `${
            game.lose_point! - gameLogList.length + playerState.last_wrong + 1
          }休`
        : playerState.state === "lose"
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

export default endlessChance;
