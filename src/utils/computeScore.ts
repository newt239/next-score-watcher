import db, { ComputedScoreDBProps, GameDBProps, States, Variants } from "./db";

const computeScore = async (game_id: number) => {
  const game = await db.games.get(game_id);
  if (!game) return [];
  const playerList = await db.players.where({ game_id: game_id }).toArray();
  const gameLogList = await db.logs.where({ game_id: game_id }).toArray();
  await db.games.update(game_id, { started: gameLogList.length !== 0 });
  const congratulationsList: [number, string][] = [];
  let insertDataList: ComputedScoreDBProps[] = playerList.map((player) => {
    return {
      id: `${game_id}_${player.id}`,
      game_id,
      player_id: Number(player.id),
      state: "playing",
      score:
        game.rule === "attacksurvival"
          ? game.win_point!
          : player.initial_correct - player.initial_wrong, // TODO: ここ間違ってるので直す
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
        const editedPlayerState =
          game.rule === "squarex"
            ? quiz_position % 2 === 0
              ? {
                  ...playerState,
                  odd_score:
                    playerState.odd_score +
                    (log.variant === "correct"
                      ? 1
                      : log.variant === "wrong"
                      ? -1
                      : 0),
                }
              : {
                  ...playerState,
                  even_score:
                    playerState.even_score +
                    (log.variant === "correct"
                      ? 1
                      : log.variant === "wrong"
                      ? -1
                      : 0),
                }
            : playerState;
        const score = getScore(game, editedPlayerState, log.variant);
        if (log.variant === "correct") {
          return {
            ...editedPlayerState,
            correct: editedPlayerState.correct + 1,
            last_correct: quiz_position, // 0-indexed
            score,
          };
        } else if (log.variant === "wrong") {
          return {
            ...editedPlayerState,
            wrong: editedPlayerState.wrong + 1,
            last_wrong: quiz_position, // 0-indexed
            score,
          };
        } else {
          return editedPlayerState;
        }
      } else {
        if (game.rule === "attacksurvival") {
          return {
            ...playerState,
            score:
              playerState.score +
              (log.variant === "correct"
                ? game.correct_other!
                : log.variant === "wrong"
                ? game.wrong_other!
                : 0),
          };
        }
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
    if (state === "win" && insertData.state !== "win") {
      congratulationsList.push([insertData.player_id!, text]);
    }
    return {
      ...insertData,
      state: state as States,
      text,
    };
  });
  db.computed_scores.bulkPut(insertDataList);
  return congratulationsList;
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
    case "nupdown":
      return variant === "wrong" ? 0 : playerState.score + 1;
    case "swedishx":
      return variant === "wrong"
        ? playerState.score - playerState.wrong - 1
        : playerState.score + 1;
    case "attacksurvival":
      return (
        playerState.score +
        (variant === "wrong" ? game.wrong_me : game.correct_me)
      );
    case "squarex":
      return playerState.odd_score * playerState.even_score;
  }
};

const getState = (
  game: GameDBProps,
  playerState: ComputedScoreDBProps,
  quiz_position: number
) => {
  console.log(game);
  if (game.limit && quiz_position >= game.limit) {
    // 出題数が限定問題数を超えたとき
    if (!game.win_through || playerState.order < game.win_through) {
      // グループ内順位が勝ち抜け上限人数より小さいとき
      return ["win", indicator(playerState.order)];
    } else {
      return ["lose", "LOSE"];
    }
  }
  if (game.lose_point && playerState.wrong >= game.lose_point) {
    // 失格誤答数より多く誤答したとき
    return ["lose", "LOSE"];
  }
  switch (game.rule) {
    case "nomx":
      if (playerState.correct >= game.win_point!) {
        return ["win", indicator(playerState.order)];
      }
      break;
    case "nbyn":
      if (
        playerState.correct * (game.win_point! - playerState.wrong) >=
        game.win_point! ** 2
      ) {
        return ["win", indicator(playerState.order)];
      }
      break;
    case "nupdown":
      if (playerState.score >= game.win_point!) {
        return ["win", indicator(playerState.order)];
      }
      break;
    case "swedishx":
      if (playerState.score >= game.win_point!) {
        return ["win", indicator(playerState.order)];
      }
      break;
    case "attacksurvival":
      if (playerState.score <= 0) {
        return ["lose", "LOSE"];
      }
      break;
    case "squarex":
      if (playerState.score >= game.win_point!) {
        return ["win", indicator(playerState.order)];
      }
      break;
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
