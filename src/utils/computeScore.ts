import { numberSign } from "./commonFunctions";
import db, {
  ComputedScoreDBProps,
  GameDBProps,
  LogDBProps,
  States,
  Variants,
} from "./db";

import { getConfig } from "#/hooks/useBooleanConfig";

export type winThroughPlayerProps = { player_id: string; text: string } | null;

const computeScore = async (game_id: string) => {
  const game = await db.games.get(game_id);
  if (!game)
    return { scoreList: [], winThroughPlayer: { player_id: "", text: "" } };
  const gameLogList = await db.logs
    .where({ game_id: game_id })
    .sortBy("timestamp");

  let playersState: ComputedScoreDBProps[] = getInitialPlayersState(game);

  if (game.rule === "nomx-ad") {
    return await nomxAd(game, gameLogList);
  }
  if (game.rule === "nbyn") {
    return await nbyn(game, gameLogList);
  }
  if (game.rule === "squarex") {
    return await squarex(game, gameLogList);
  }
  if (game.rule === "swedish10") {
    return await swedish10(game, gameLogList);
  }
  if (game.rule === "z") {
    return await z(game, gameLogList);
  }
  if (game.rule === "freezex") {
    return await freezex(game, gameLogList);
  }
  if (game.rule === "various-fluctuations") {
    return await variousFluctuations(game, gameLogList);
  }

  let winThroughPlayer: { player_id: string; text: string } = {
    player_id: "",
    text: "",
  };
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        const score = getScore(game, playerState, log.variant);
        switch (log.variant) {
          case "through":
            return playerState;
          case "correct":
            if (score >= game.win_point!) {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score,
                last_correct: qn,
                state: "win",
              };
            } else {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score,
                last_correct: qn,
              };
            }
          case "wrong":
            const newWrong = playerState.wrong + 1;
            if (newWrong >= game.lose_point!) {
              return {
                ...playerState,
                wrong: newWrong,
                score,
                last_wrong: qn,
                state: "lose",
              };
            } else {
              return {
                ...playerState,
                wrong: newWrong,
                score,
                last_wrong: qn,
              };
            }
        }
      } else {
        // 他人のアクション
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
  const playerOrderList = getSortedPlayerOrderList(playersState);
  playersState = playersState.map((insertData) => {
    const order = playerOrderList.findIndex(
      (score) => score === insertData.player_id
    );
    return {
      ...insertData,
      order,
    };
  });

  // order をもとに state を算出
  playersState = playersState.map((playerState) => {
    const [state, text] = getState(game, playerState, gameLogList.length);
    if (
      state === "win" &&
      playerState.last_correct + 1 === gameLogList.length
    ) {
      // 最近のアクションでプレイヤーが勝ち抜けていればリストに追加
      winThroughPlayer = { player_id: playerState.player_id, text };
    }
    let reachState: States = "playing";
    switch (game.rule) {
      case "normal":
        break;
      case "nomx":
        if (playerState.wrong + 1 === game.lose_point!) {
          reachState = "lose";
        }
        if (playerState.correct + 1 === game.win_point!) {
          reachState = "win";
        }
        break;
      case "nbyn":
        if (playerState.wrong + 1 === game.lose_point!) {
          reachState = "lose";
        }
        if (
          (playerState.correct + 1) * (game.win_point! - playerState.wrong) ===
          game.win_point! ** 2
        ) {
          reachState = "win";
        }
        break;
    }
    return {
      ...playerState,
      state: state,
      reachState,
      text,
    };
  });
  return { scoreList: playersState, winThroughPlayer };
};

const getInitialPlayersState = (game: GameDBProps) => {
  const initialPlayersState = game.players.map(
    (gamePlayer): ComputedScoreDBProps => {
      return {
        game_id: game.id,
        player_id: gamePlayer.id,
        state: "playing",
        reachState: "playing",
        score: game.rule === "attacksurvival" ? game.win_point! : 0,
        correct: gamePlayer.initial_correct,
        wrong: gamePlayer.initial_wrong,
        last_correct: 10000,
        last_wrong: -10000,
        odd_score: 0,
        even_score: 0,
        stage: 1,
        isIncapacity: false,
        order: 0,
        text: "",
      };
    }
  );
  return initialPlayersState;
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
    case "nupdown":
      return variant === "wrong" ? 0 : playerState.score + 1;
    case "attacksurvival":
      return (
        playerState.score +
        (variant === "wrong" ? game.wrong_me : game.correct_me)
      );
    default:
      return playerState.correct;
  }
};

const getState = (
  game: GameDBProps,
  playerState: ComputedScoreDBProps,
  quiz_position: number
): [state: States, text: string] => {
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
      if (playerState.wrong >= game.win_point!) {
        return ["lose", "LOSE"];
      } else if (
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
    case "swedish10":
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

  return [
    "playing",
    getConfig("scorewatcher-show-sign-string")
      ? `${playerState.score}pt`
      : String(playerState.score),
  ];
};

const getSortedPlayerOrderList = (playersState: ComputedScoreDBProps[]) =>
  playersState
    .sort((pre, cur) => {
      // 勝ち抜けているかどうか
      if (pre.state === "win" && cur.state !== "win") return -1;
      else if (pre.state !== "win" && cur.state === "win") return 1;
      // 最後に正解した問題番号の若さを比較
      else if (pre.last_correct < cur.last_correct) return -1;
      else if (cur.last_correct < pre.last_correct) return 1;
      // ステージを比較
      if (pre.stage > cur.stage) return -1;
      else if (cur.stage > pre.stage) return 1;
      // スコアを比較
      if (pre.score > cur.score) return -1;
      else if (cur.score > pre.score) return 1;
      // 最後に正解した問題番号で比較  TODO: 複数人が正解となるパターン＆判定勝ち
      if (cur.last_correct > pre.last_correct) return -1;
      else if (pre.last_correct > cur.last_correct) return 1;
      // 正答数を比較
      if (pre.correct > cur.correct) return -1;
      else if (cur.correct > pre.correct) return 1;
      // 誤答数を比較
      if (pre.wrong > cur.wrong) return -1;
      else if (cur.wrong > pre.wrong) return 1;
      // 必要に応じて評価基準を追加
      else return 0;
    })
    .map((score) => score.player_id);

const nbyn = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
  let winThroughPlayer: { player_id: string; text: string } = {
    player_id: "",
    text: "",
  };
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        if (log.variant === "correct") {
          const newCorrect = playerState.correct + 1;
          const newScore = newCorrect * (game.win_point! - playerState.wrong);
          if (newScore >= game.win_point! ** 2) {
            return {
              ...playerState,
              correct: newCorrect,
              score: newScore,
              last_correct: qn,
              state: "win",
            };
          } else {
            return {
              ...playerState,
              correct: playerState.correct + 1,
              score: newScore,
              last_correct: qn,
            };
          }
        } else if (log.variant === "wrong") {
          const newWrong = playerState.wrong + 1;
          const newScore = playerState.correct * (game.win_point! - newWrong);
          if (newWrong >= game.win_point!) {
            return {
              ...playerState,
              wrong: newWrong,
              score: newScore,
              last_wrong: qn,
              state: "lose",
            };
          } else {
            return {
              ...playerState,
              wrong: newWrong,
              score: newScore,
              last_wrong: qn,
            };
          }
        } else {
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
    const text = playerState.state === "win" ? indicator(order) : "";
    if (
      playerState.state === "win" &&
      playerState.last_correct + 1 === gameLogList.length
    ) {
      winThroughPlayer = { player_id: playerState.player_id, text };
    }
    return { ...playerState, order, text };
  });
  return { scoreList: playersState, winThroughPlayer };
};

// scoreをwrong ptとして利用
const swedish10 = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
  let winThroughPlayer: { player_id: string; text: string } = {
    player_id: "",
    text: "",
  };
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        if (log.variant === "correct") {
          const newCorrect = playerState.correct + 1;
          if (newCorrect >= game.win_point!) {
            return {
              ...playerState,
              correct: newCorrect,
              last_correct: qn,
              state: "win",
            };
          } else {
            return {
              ...playerState,
              correct: newCorrect,
              last_correct: qn,
            };
          }
        } else if (log.variant === "wrong") {
          let newWrong = playerState.wrong;
          if (playerState.correct <= 0) {
            newWrong += 1;
          } else if (playerState.correct <= 2) {
            newWrong += 2;
          } else if (playerState.correct <= 5) {
            newWrong += 3;
          } else {
            newWrong += 4;
          }
          if (newWrong >= game.lose_point!) {
            return {
              ...playerState,
              wrong: newWrong,
              score: newWrong,
              last_wrong: qn,
              state: "lose",
            };
          } else {
            return {
              ...playerState,
              wrong: newWrong,
              score: newWrong,
              last_wrong: qn,
            };
          }
        } else {
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
    const text =
      playerState.state === "win"
        ? indicator(order)
        : playerState.state === "lose"
        ? "LOSE"
        : `${playerState.correct}${numberSign("pt")}`;
    if (
      playerState.state === "win" &&
      playerState.last_correct + 1 === gameLogList.length
    ) {
      winThroughPlayer = { player_id: playerState.player_id, text };
    }
    return { ...playerState, order, text };
  });
  return { scoreList: playersState, winThroughPlayer };
};

// TODO: 連答時+2ptとランプ
const nomxAd = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
  let winThroughPlayer: { player_id: string; text: string } = {
    player_id: "",
    text: "",
  };
  let playersState = getInitialPlayersState(game);
  let last_correct_player: string = "";
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        switch (log.variant) {
          case "through":
            return playerState;
          case "correct":
            const newScore =
              playerState.score +
              (last_correct_player === playerState.player_id ? 2 : 1);
            last_correct_player = playerState.player_id;
            if (newScore >= game.win_point!) {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newScore,
                last_correct: qn,
                state: "win",
              };
            } else {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newScore,
                last_correct: qn,
              };
            }
          case "wrong":
            const newWrong = playerState.wrong + 1;
            if (newWrong >= game.lose_point!) {
              return {
                ...playerState,
                wrong: newWrong,
                last_wrong: qn,
                state: "lose",
              };
            } else {
              return {
                ...playerState,
                wrong: newWrong,
                last_wrong: qn,
              };
            }
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
    const text = playerState.state === "win" ? indicator(order) : "";
    if (
      playerState.state === "win" &&
      playerState.last_correct + 1 === gameLogList.length
    ) {
      winThroughPlayer = { player_id: playerState.player_id, text };
    }
    return { ...playerState, order, text };
  });
  return { scoreList: playersState, winThroughPlayer };
};

const squarex = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
  let winThroughPlayer: { player_id: string; text: string } = {
    player_id: "",
    text: "",
  };
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        let newOddScore = playerState.odd_score;
        let newEvenScore = playerState.even_score;
        switch (log.variant) {
          case "through":
            return playerState;
          case "correct":
            if (qn % 2 === 0) {
              newOddScore++;
            } else {
              newEvenScore++;
            }
            if (newOddScore * newEvenScore >= game.win_point!) {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newOddScore * newEvenScore,
                odd_score: newOddScore,
                even_score: newEvenScore,
                last_correct: qn,
                state: "win",
              };
            } else {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newOddScore * newEvenScore,
                odd_score: newOddScore,
                even_score: newEvenScore,
                last_correct: qn,
              };
            }
          case "wrong":
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
    const text = playerState.state === "win" ? indicator(order) : "";
    if (
      playerState.state === "win" &&
      playerState.last_correct + 1 === gameLogList.length
    ) {
      winThroughPlayer = { player_id: playerState.player_id, text };
    }
    return { ...playerState, order, text };
  });
  return { scoreList: playersState, winThroughPlayer };
};

const z = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
  let winThroughPlayer: { player_id: string; text: string } = {
    player_id: "",
    text: "",
  };
  let playersState = getInitialPlayersState(game);
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
                last_correct: qn,
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
  const playerOrderList = getSortedPlayerOrderList(playersState);
  playersState = playersState.map((playerState) => {
    const order = playerOrderList.findIndex(
      (score) => score === playerState.player_id
    );
    const text =
      playerState.state === "win"
        ? indicator(order)
        : `Stage ${playerState.stage}`;
    if (
      playerState.state === "win" &&
      playerState.last_correct + 1 === gameLogList.length
    ) {
      winThroughPlayer = { player_id: playerState.player_id, text };
    }
    return { ...playerState, order, text };
  });
  return { scoreList: playersState, winThroughPlayer };
};

const freezex = async (game: GameDBProps, gameLogList: LogDBProps[]) => {
  let winThroughPlayer: { player_id: string; text: string } = {
    player_id: "",
    text: "",
  };
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        switch (log.variant) {
          case "through":
            return playerState;
          case "correct":
            const newCorrect = playerState.correct + 1;
            if (newCorrect === game.win_point) {
              return {
                ...playerState,
                correct: newCorrect,
                last_correct: qn,
                state: "win",
              };
            } else {
              return {
                ...playerState,
                correct: newCorrect,
              };
            }
          case "wrong":
            return {
              ...playerState,
              wrong: playerState.wrong + 1,
              last_wrong: qn,
            };
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
    const remainIncapacity =
      playerState.wrong - (gameLogList.length - playerState.last_wrong - 1);
    const text =
      playerState.state === "win"
        ? indicator(order)
        : remainIncapacity > 0
        ? `~${remainIncapacity}~`
        : `${playerState.correct}○`;
    if (
      playerState.state === "win" &&
      playerState.last_correct + 1 === gameLogList.length
    ) {
      winThroughPlayer = { player_id: playerState.player_id, text };
    }
    return { ...playerState, order, text, isIncapacity: remainIncapacity > 0 };
  });
  return { scoreList: playersState, winThroughPlayer };
};

const variousFluctuations = async (
  game: GameDBProps,
  gameLogList: LogDBProps[]
) => {
  let winThroughPlayer: { player_id: string; text: string } = {
    player_id: "",
    text: "",
  };
  let playersState = getInitialPlayersState(game);
  gameLogList.map((log, qn) => {
    playersState = playersState.map((playerState) => {
      if (playerState.player_id === log.player_id) {
        switch (log.variant) {
          case "through":
            return playerState;
          case "correct":
            const correct_point = game.players.find(
              (gamePlayer) => gamePlayer.id === playerState.player_id
            )?.base_correct_point!;
            const newScore = playerState.score + correct_point;
            if (newScore >= game.win_point!) {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newScore,
                last_correct: qn,
                state: "win",
              };
            } else if (newScore + correct_point >= game.win_point!) {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newScore,
                last_correct: qn,
                reachState: "win",
              };
            } else {
              return {
                ...playerState,
                correct: playerState.correct + 1,
                score: newScore,
              };
            }
          case "wrong":
            const wrong_point = game.players.find(
              (gamePlayer) => gamePlayer.id === playerState.player_id
            )?.base_wrong_point!;
            return {
              ...playerState,
              wrong: playerState.wrong + 1,
              score: playerState.score + wrong_point,
              last_wrong: qn,
            };
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
    const remainIncapacity =
      playerState.wrong - (gameLogList.length - playerState.last_wrong - 1);
    const text =
      playerState.state === "win"
        ? indicator(order)
        : playerState.state === "lose"
        ? "LOSE"
        : "";
    if (
      playerState.state === "win" &&
      playerState.last_correct + 1 === gameLogList.length
    ) {
      winThroughPlayer = { player_id: playerState.player_id, text };
    }
    return { ...playerState, order, text, isIncapacity: remainIncapacity > 0 };
  });
  return { scoreList: playersState, winThroughPlayer };
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
