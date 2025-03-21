import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "@/utils/computeScore";
import { detectPlayerState, numberSign } from "@/utils/functions";
import { AllGameProps, LogDBProps, WinPlayerProps } from "@/utils/types";

const attacksurvival = async (
  game: AllGameProps["attacksurvival"],
  gameLogList: LogDBProps[]
) => {
  const winPlayers: WinPlayerProps[] = [];
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        const newScore =
          playerState.score +
          (log.variant === "wrong" ? game.wrong_me : game.correct_me);
        /*
        個人初期値が0以下の場合1問目の回答前からstateがLOSEになるが、
        この組み方はおかしいので表示はそのままにする
        */
        switch (log.variant) {
          case "correct":
            if (newScore + game.wrong_me <= 0) {
              return {
                ...playerState,
                score: newScore,
                correct: playerState.correct + 1,
                last_wrong: qn,
                reach_state: "lose",
              };
            } else {
              return {
                ...playerState,
                score: newScore,
                correct: playerState.correct + 1,
                last_wrong: qn,
              };
            }
          case "wrong":
            const newWrong = playerState.wrong + 1;
            if (newScore <= 0) {
              return {
                ...playerState,
                score: newScore,
                wrong: newWrong,
                last_wrong: qn,
                state: "lose",
              };
            } else if (newScore + game.wrong_me <= 0) {
              return {
                ...playerState,
                score: newScore,
                wrong: newWrong,
                last_wrong: qn,
                reach_state: "lose",
              };
            } else {
              return {
                ...playerState,
                score: newScore,
                wrong: newWrong,
                last_wrong: qn,
              };
            }
          default:
            return playerState;
        }
      } else {
        const newScore =
          playerState.score +
          (log.variant === "correct"
            ? game.correct_other!
            : log.variant === "wrong"
              ? game.wrong_other!
              : 0);
        if (newScore <= 0) {
          return {
            ...playerState,
            score: 0,
            state: "lose",
          };
        } else if (
          newScore + game.correct_other! <= 0 ||
          newScore + game.wrong_me <= 0
        ) {
          return {
            ...playerState,
            score: newScore,
            reach_state: "lose",
          };
        } else {
          return {
            ...playerState,
            score: newScore,
          };
        }
      }
    });
  });
  const playerOrderList = getSortedPlayerOrderList(playersState);
  const playingPlayers = playersState.filter((p) => p.state === "playing");
  playersState = playersState.map((playerState) => {
    const order = playerOrderList.findIndex(
      (score) => score === playerState.player_id
    );
    // 現在生き残っているプレイヤー数が勝ち抜け人数より少ない場合は、生き残っているプレイヤーを勝ち抜けとする
    const currentState =
      game.win_through &&
      game.win_through >= playingPlayers.length &&
      playerState.state === "playing"
        ? "win"
        : playerState.state;
    const state = detectPlayerState(
      game,
      currentState,
      order,
      gameLogList.length
    );
    const text =
      state === "win"
        ? indicator(order)
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

export default attacksurvival;
