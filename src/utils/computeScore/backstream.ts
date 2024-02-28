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

const backstream = async (
  game: GameDBPropsUnion["backstream"],
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
            const newScoreInCorrectCase = playerState.score + 1;
            if (newScoreInCorrectCase >= game.win_point!) {
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
                correct: newCorrect,
                last_correct: qn,
                score: newScoreInCorrectCase,
              };
            }
          case "wrong":
            const newWrong = playerState.wrong + 1;
            const newScoreInWrongCase = playerState.score - newWrong;
            if (newScoreInWrongCase <= game.lose_point!) {
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

export default backstream;
