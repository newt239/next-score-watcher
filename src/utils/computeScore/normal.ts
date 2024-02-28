import {
  getInitialPlayersState,
  getSortedPlayerOrderList,
} from "#/utils/computeScore";
import {
  GameDBPropsUnion,
  GameLogDBProps,
  GamePlayerDBProps,
} from "#/utils/types";

const normal = async (
  game: GameDBPropsUnion["normal"],
  game_players: GamePlayerDBProps[],
  gameLogList: GameLogDBProps[]
) => {
  let playersState = getInitialPlayersState(game, game_players);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        const newScore =
          playerState.score +
          (log.variant === "correct" ? game.correct_me : game.wrong_me);
        switch (log.variant) {
          case "correct":
            if (newScore >= game.win_point!) {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                last_correct: qn,
                score: newScore,
                state: "win",
              };
            } else {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                last_correct: qn,
                score: newScore,
              };
            }
          case "wrong":
            const newWrong = playerState.wrong + 1;
            if (newWrong >= game.lose_point!) {
              return {
                ...playerState,
                last_wrong: qn,
                score: newScore,
                state: "lose",
                wrong: newWrong,
              };
            } else {
              return {
                ...playerState,
                last_wrong: qn,
                score: newScore,
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
    return { ...playerState, order };
  });

  return {
    scores: playersState,
    winPlayers: [],
  };
};

export default normal;
