import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "@/utils/computeScore";
import { detectPlayerState, numberSign } from "@/utils/functions";
import { AllGameProps, LogDBProps, WinPlayerProps } from "@/utils/types";

const endlessChance = async (
  game: AllGameProps["endless-chance"],
  gameLogList: LogDBProps[]
) => {
  const winPlayers: WinPlayerProps[] = [];
  let playersState = getInitialPlayersState(game);
  const realQuizLength =
    gameLogList.filter((log) => ["correct", "through"].includes(log.variant))
      .length +
    (gameLogList.length !== 0 &&
    gameLogList[gameLogList.length - 1].variant === "multiple_wrong"
      ? 1
      : 0);
  let currentQn = 0;
  gameLogList.map((log) => {
    if (["correct", "through"].includes(log.variant)) {
      currentQn++;
    }
    playersState = playersState.map((playerState) => {
      if (log.player_id.includes(playerState.player_id)) {
        switch (log.variant) {
          case "correct":
            const newCorrect = playerState.correct + 1;
            if (newCorrect >= game.win_point!) {
              return {
                ...playerState,
                correct: newCorrect,
                last_correct: currentQn,
                state: "win",
              };
            } else if (newCorrect + 1 === game.win_point!) {
              return {
                ...playerState,
                correct: newCorrect,
                last_correct: currentQn,
                reach_state: "win",
              };
            } else {
              return {
                ...playerState,
                correct: newCorrect,
                last_correct: currentQn,
              };
            }
          case "multiple_wrong":
            const newWrong = playerState.wrong + 1;
            if (game.options.use_r) {
              return {
                ...playerState,
                wrong: newWrong,
                last_wrong: currentQn,
                is_incapacity: true,
              };
            } else {
              if (newWrong >= game.lose_point!) {
                return {
                  ...playerState,
                  wrong: newWrong,
                  last_wrong: currentQn,
                  state: "lose",
                };
              } else if (
                newWrong + 1 === game.lose_point! &&
                playerState.correct + 1 !== game.win_point!
              ) {
                return {
                  ...playerState,
                  wrong: newWrong,
                  last_wrong: currentQn,
                  reach_state: "lose",
                };
              } else {
                return {
                  ...playerState,
                  wrong: newWrong,
                  last_wrong: currentQn,
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
            /*
              本来は currentQn を使った条件分岐をしたいが複雑になりすぎるため、
              休み状態かどうかに途中過程は関わらず現在の問題においての状況をチェックすれば良いことを利用し、
              realQuizLength で判定
            */
            game.lose_point! <= realQuizLength - playerState.last_wrong - 1
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
      realQuizLength
    );
    const text =
      state === "win"
        ? indicator(order)
        : playerState.is_incapacity
        ? `${game.lose_point! - realQuizLength + playerState.last_wrong + 1}休`
        : playerState.state === "lose"
        ? "LOSE"
        : numberSign("pt", playerState.score);
    if (state === "win" && playerState.last_correct === realQuizLength) {
      winPlayers.push({ player_id: playerState.player_id, text });
    }
    return { ...playerState, order, state, text };
  });
  return { scores: playersState, winPlayers };
};

export default endlessChance;
