import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
  indicator,
} from "#/utils/computeScore";
import { detectPlayerState } from "#/utils/functions";
import {
  GameDBPropsUnion,
  GameLogDBProps,
  GamePlayerDBProps,
  WinPlayerProps,
} from "#/utils/types";

const variables = async (
  game: GameDBPropsUnion["variables"],
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
            const correct_point = game_players.find(
              (gamePlayer) => gamePlayer.id === playerState.player_id
            )?.options?.base_correct_point;
            const newScore =
              playerState.score +
              (typeof correct_point === "number" ? correct_point : 0);
            if (newScore >= game.win_point!) {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newScore,
                last_correct: qn,
                state: "win",
              };
            } else if (
              newScore +
                (typeof correct_point === "number" ? correct_point : 0) >=
              game.win_point!
            ) {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newScore,
                last_correct: qn,
                reach_state: "win",
              };
            } else {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newScore,
              };
            }
          case "wrong":
            const wrong_point = game_players.find(
              (gamePlayer) => gamePlayer.id === playerState.player_id
            )?.options?.base_wrong_point!;
            return {
              ...playerState,
              wrong: playerState.wrong + 1,
              score:
                playerState.score +
                (typeof wrong_point === "number" ? wrong_point : 0),
              last_wrong: qn,
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
      state === "win"
        ? indicator(order)
        : state === "lose"
          ? "LOSE"
          : `${playerState.score}pt`;
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

export default variables;
