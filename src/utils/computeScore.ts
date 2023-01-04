import db, {
  ComputedScoreDBProps,
  GameDBProps,
  LogDBProps,
  States,
  Variants,
} from "./db";

const computeScore = async (game_id: number) => {
  const game = await db.games.get(game_id);
  if (!game) return { scoreList: undefined, congratulationsList: [] };
  const gameLogList = await db.logs.where({ game_id: game_id }).toArray();
  const congratulationsList: [number, string][] = [];
  if (game.rule === "z") {
    return await z(game, gameLogList);
  }
  let insertDataList: ComputedScoreDBProps[] = game.players.map((player_id) => {
    return {
      id: `${game_id}_${player_id}`,
      game_id,
      player_id: Number(player_id),
      state: "playing",
      score:
        game.rule === "attacksurvival"
          ? game.win_point!
          : game.rule === "z"
          ? 1
          : 0,
      correct: 0,
      wrong: 0,
      last_correct: 0,
      last_wrong: 0,
      odd_score: 0,
      even_score: 0,
      stage: 0,
      win_qn: 10000,
      isIncapacity: false,
      order: 0,
      text: game.rule === "z" ? "Stage 1" : "unknown",
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
    if (state === "win" && insertData.last_correct + 1 === gameLogList.length) {
      congratulationsList.push([insertData.player_id!, text]);
    }
    return {
      ...insertData,
      state: state as States,
      text,
    };
  });
  await db.computed_scores.bulkPut(insertDataList);
  return { scoreList: insertDataList, congratulationsList };
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
    case "z":
      return playerState.correct;
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

const z = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
  const congratulationsList: [number, string][] = [];
  let playersState: ComputedScoreDBProps[] = game.players.map((player_id) => {
    return {
      id: `${game.id}_${player_id}`,
      game_id: game.id!,
      player_id,
      score: 0,
      last_correct: 0,
      last_wrong: 0,
      odd_score: 0,
      even_score: 0,
      correct: 0,
      wrong: 0,
      stage: 1,
      order: 0,
      text: "",
      win_qn: 10000,
      state: "playing",
      isIncapacity: false,
    };
  });
  gameLogList.map((log, qn) => {
    const lastCorrectPlayer = playersState.find(
      (playerState) => playerState.player_id === log.player_id
    );
    const isResetTiming =
      log.variant === "correct" &&
      lastCorrectPlayer &&
      lastCorrectPlayer.stage === lastCorrectPlayer.correct + 1;
    playersState = playersState.map((playerState) => {
      const stage = playerState.stage;
      if (playerState.player_id === log.player_id) {
        switch (log.variant) {
          case "through":
            return playerState;
          case "correct":
            const newCorrect = playerState.correct + 1;
            if (stage === 4 && newCorrect === 4) {
              return {
                ...playerState,
                correct: 0,
                stage: 5,
                win_qn: qn,
                state: "win",
                isIncapacity: false,
              };
            } else if (stage === newCorrect) {
              return {
                ...playerState,
                correct: 0,
                stage: playerState.stage + 1,
                isIncapacity: false,
              };
            } else {
              return {
                ...playerState,
                correct: newCorrect,
                isIncapacity: false,
              };
            }
          case "wrong":
            const newWrong = playerState.wrong + 1;
            if (stage === 1 && newWrong === 1) {
              return { ...playerState, wrong: 0, last_wrong: qn };
            } else if (stage === newWrong + 1) {
              return {
                ...playerState,
                isIncapacity: true,
                last_wrong: qn,
                state: "lose",
              };
            } else {
              return { ...playerState, wrong: newWrong, last_wrong: qn };
            }
        }
      } else {
        if (isResetTiming) {
          return {
            ...playerState,
            correct: 0,
            wrong: 0,
            isIncapacity: false,
            state: "playing",
          };
        } else {
          return playerState;
        }
      }
    });
  });
  const playerOrderList = playersState
    .sort((pre, cur) => {
      // 勝ち抜けた問題番号の若さを比較
      if (pre.win_qn < cur.win_qn) return -1;
      else if (cur.win_qn < pre.win_qn) return 1;
      // ステージを比較
      if (pre.stage > cur.stage) return -1;
      else if (cur.stage > pre.stage) return 1;
      // 正答数を比較
      if (pre.correct > cur.correct) return -1;
      else if (cur.correct > pre.correct) return 1;
      // 誤答数を比較
      if (pre.wrong < cur.wrong) return -1;
      else if (cur.wrong < pre.wrong) return 1;
      // 必要に応じて評価基準を追加
      else return 0;
    })
    .map((score) => score.player_id);
  playersState = playersState.map((playerState) => {
    const order = playerOrderList.findIndex(
      (score) => score === playerState.player_id
    );
    const text =
      playerState.state === "win"
        ? indicator(order)
        : `Stage ${playerState.stage}`;
    if (playerState.win_qn + 1 === gameLogList.length) {
      congratulationsList.push([playerState.player_id, text]);
    }
    return { ...playerState, order, text };
  });
  await db.computed_scores.bulkPut(playersState);
  return { scoreList: playersState, congratulationsList };
};

export default computeScore;
