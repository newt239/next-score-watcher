import db, { ComputedScoreDBProps, GameDBProps, States, Variants } from "./db";

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
      score: player.initial_correct - player.initial_wrong,
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
  // 評価順 ( order ) を計算
  const playerOrderList = insertDataList
    .sort((a, b) => {
      // スコアを比較
      if (a.score > b.score) return -1;
      else if (b.score > a.score) return 1;
      // 最後に正解した問題番号で比較  TODO: 複数人が正解となるパターン＆判定勝ち
      if (b.last_correct > a.last_correct) return -1;
      else if (a.last_correct > b.last_correct) return 1;
      // 正答数を比較
      if (a.correct > b.correct) return -1;
      else if (b.correct > a.correct) return 1;
      // 誤答数を比較
      if (a.wrong > b.wrong) return -1;
      else if (b.wrong > a.wrong) return 1;
      // 必要に応じて評価基準を追加
      else return 0;
    })
    .map((score) => score.player_id);
  insertDataList = insertDataList.map((insertData) => {
    const order = playerOrderList.findIndex(
      (score) => score === insertData.player_id
    );
    return {
      ...insertData,
      order,
    };
  });
  // order をもとに state を算出
  insertDataList = insertDataList.map((insertData) => {
    const [state, text] = getState(game, insertData, gameLogList.length);
    return {
      ...insertData,
      state: state as States,
      text,
    };
  });
  db.computed_scores.bulkPut(insertDataList);
};

const getScore = (
  game: GameDBProps,
  playerState: ComputedScoreDBProps,
  variant: Variants
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
    case "nbyn":
      return playerState.correct * ((game.win_point || 5) - playerState.wrong);
    default:
      return playerState.score;
  }
};

const getState = (
  game: GameDBProps,
  playerState: ComputedScoreDBProps,
  quiz_position: number
) => {
  if (game.limit && quiz_position >= game.limit) {
    // 出題数が限定問題数を超えたとき
    if (!game.win_through || playerState.order < game.win_through) {
      // グループ内順位が勝ち抜け上限人数より小さいとき
      return ["win", indicator(playerState.order)];
    } else {
      return ["lose", "LOSE"];
    }
  }
  switch (game.rule) {
    case "nomx":
      if (playerState.wrong >= game.lose_point!) {
        // 失格誤答数より多く誤答したとき
        return ["lose", "LOSE"];
      }
      if (playerState.correct >= game.win_point!) {
        return ["win", indicator(playerState.order)];
      }
    case "nbyn":
      if (playerState.wrong >= game.win_point!) {
        // Nより多く誤答したとき
        return ["lose", "LOSE"];
      }
      if (
        playerState.correct * (game.win_point! - playerState.wrong) >=
        game.win_point! ** 2
      ) {
        return ["win", indicator(playerState.order)];
      }
  }

  return ["playing", String(playerState.score)];
};

const indicator = (i: number) => {
  i = Math.abs(i) + 1;
  var cent = i % 100;
  if (cent >= 10 && cent <= 20) return `${i}st`;
  var dec = i % 10;
  if (dec === 1) return `${i}st`;
  if (dec === 2) return `${i}nd`;
  if (dec === 3) return `${i}rd`;
  return `${i}th`;
};

export default computeScore;
