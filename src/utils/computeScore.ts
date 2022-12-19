import db, { ComputedScoreDBProps, GameDBProps } from "./db";

const computeScore = async (game_id: number) => {
  const game = await db.games.get(game_id);
  if (!game) return;
  const playerList = await db.players.where({ game_id: game_id }).toArray();
  const gameLogList = await db.logs.where({ game_id: game_id }).toArray();
  let insertDataList: ComputedScoreDBProps[] = playerList.map((player) => {
    return {
      id: `${game_id}_${player.id}`,
      game_id,
      player_id: Number(player.id),
      state: "playing",
      score: 0,
      correct: player.initial_correct,
      wrong: player.initial_wrong,
      last_correct: 0,
      last_wrong: 0,
      odd_score: 0,
      even_score: 0,
      order: 0,
      text: "unknown",
    };
  });
  gameLogList.map((log, quiz_position) => {
    insertDataList = insertDataList.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        const score = getScore(game, playerState, log.variant);
        if (log.variant === "correct") {
          return {
            ...playerState,
            correct: playerState.correct + 1,
            last_correct: quiz_position, // 0-indexed
            score,
          };
        } else if (log.variant === "wrong") {
          return {
            ...playerState,
            wrong: playerState.wrong + 1,
            last_wrong: quiz_position, // 0-indexed
            score,
          };
        } else {
          return playerState;
        }
      } else {
        return playerState;
      }
    });
  });
  // TODO: 最後に評価順 (order) を計算し state を算出
  db.computed_scores.bulkPut(insertDataList);
};

const getScore = (
  game: GameDBProps,
  playerState: ComputedScoreDBProps,
  variant: "correct" | "wrong" | "through"
) => {
  if (variant === "through") return playerState.score;
  switch (game.rule) {
    case "normal":
      return (
        playerState.score +
        (variant === "correct" ? game.correct_me : game.wrong_me)
      );
    case "nomx":
      return (
        playerState.score +
        (variant === "correct" ? game.correct_me : game.wrong_me)
      );
  }
};

const getState = (
  game: GameDBProps,
  playerState: ComputedScoreDBProps,
  quiz_position: number
) => {
  switch (game.rule) {
    case "normal":
      if (game.limit && quiz_position >= game.limit) {
        return "win"; // TODO: 勝ち抜け人数を設定する
      }
    case "nomx":
      if (game.limit && quiz_position >= game.limit) {
        return "win";
      }
      if (game.lose_point && playerState.wrong >= game.lose_point) {
        return "lose";
      }
      if (game.win_point && playerState.correct >= game.win_point) {
        return "win";
      }
  }

  return "playing";
};

export default computeScore;
