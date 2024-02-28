import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "#/utils/computeScore";
import { detectPlayerState, numberSign } from "#/utils/functions";
import {
  GameDBPropsUnion,
  GameLogDBProps,
  GamePlayerDBProps,
  WinPlayerProps,
} from "#/utils/types";

const nbyn = async (
  game: GameDBPropsUnion["nbyn"],
  game_players: GamePlayerDBProps[],
  gameLogList: GameLogDBProps[]
) => {
  const winPlayers: WinPlayerProps[] = [];
  let playersState = getInitialPlayersState(game, game_players);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        switch (log.variant) {
          case "correct":
            const newCorrect = playerState.correct + 1;
            const newScoreInCorrectCase =
              newCorrect * (game.win_point! - playerState.wrong);
            if (newScoreInCorrectCase >= game.win_point! ** 2) {
              return {
                ...playerState,
                correct: newCorrect,
                last_correct: qn,
                score: newScoreInCorrectCase,
                state: "win",
              };
            } else {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                last_correct: qn,
                score: newScoreInCorrectCase,
              };
            }
          case "wrong":
            const newWrong = playerState.wrong + 1;
            const newScoreInWrongCase =
              playerState.correct * (game.win_point! - newWrong);
            if (newWrong >= game.lose_point!) {
              return {
                ...playerState,
                last_wrong: qn,
                score: newScoreInWrongCase,
                state: "lose",
                wrong: newWrong,
              };
            } else {
              return {
                ...playerState,
                last_wrong: qn,
                score: newScoreInWrongCase,
                wrong: newWrong,
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

export default nbyn;
