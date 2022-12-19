import db, { ComputedScoreDBProps } from "./db";

type ComputeScoreProps = {
  game_id: number;
  player_id: number;
};

const computeScore = async ({ game_id }: ComputeScoreProps) => {
  const game = await db.games.get(game_id);
  if (!game) return;
  const playerList = await db.players.where({ game_id: game_id }).toArray();
  const gameLogList = await db.logs.where({ game_id: game_id }).toArray();
  let insertDataList: ComputedScoreDBProps[] = playerList.map((player) => {
    return {
      id: `${game_id}_${player.id}`,
      game_id,
      player_id: Number(player.id),
      end: false,
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
        if (log.variant === "correct") {
          return {
            ...playerState,
            correct: playerState.correct + 1,
            last_correct: quiz_position, // 0-indexed
            score: playerState.score + game.correct_me, // TODO: 関数化する
          };
        } else if (log.variant === "wrong") {
          return {
            ...playerState,
            wrong: playerState.wrong + 1,
            last_wrong: quiz_position, // 0-indexed
            score: playerState.score + game.wrong_me, // TODO: 関数化する
          };
        } else {
          return playerState;
        }
      } else {
        return playerState;
      }
    });
  });
  db.computed_scores.bulkPut(insertDataList);
};

export default computeScore;
