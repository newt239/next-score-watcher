import type {
  ComputedScoreProps,
  GamePlayerProps,
  GetGameDetailResponseType,
  States,
} from "@/models/game";

/**
 * プレイヤーの初期状態を生成
 */
export const getInitialPlayersStateForOnline = (
  game: GetGameDetailResponseType
): ComputedScoreProps[] => {
  return game.players.map((p) => ({
    game_id: game.id,
    player_id: p.id,
    score: getInitialScore(game, p),
    correct: getInitialCorrect(game, p),
    wrong: getInitialWrong(game, p),
    last_correct: -10,
    last_wrong: -10,
    state: "playing",
    reach_state: "playing",
    odd_score: game.ruleType === "squarex" ? (p.initialScore ?? 0) : 0,
    even_score: game.ruleType === "squarex" ? (p.initialScore ?? 0) : 0,
    stage: game.ruleType === "z" ? 1 : 1,
    is_incapacity: false,
    order: 0,
    text: "",
  }));
};

/**
 * ゲーム形式に応じた初期スコアを計算
 */
const getInitialScore = (
  game: GetGameDetailResponseType,
  player: GamePlayerProps
): number => {
  switch (game.ruleType) {
    case "divide":
      return game.option.correct_me;
    case "attacksurvival":
      return (game.option.win_through ?? 15) + (player.initialScore ?? 0);
    case "ny":
      return (player.initialScore ?? 0) - (player.initialScore ?? 0);
    case "nomr":
      return player.initialScore ?? 0;
    case "backstream":
      return (
        (player.initialScore ?? 0) -
        initialBackstreamWrong(player.initialScore ?? 0)
      );
    case "squarex": {
      const baseScore = player.initialScore ?? 0;
      return baseScore * baseScore;
    }
    case "aql":
      return 1;
    default:
      return (player.initialScore ?? 0) - (player.initialScore ?? 0);
  }
};

/**
 * ゲーム形式に応じた初期正解数を計算
 */
const getInitialCorrect = (
  game: GetGameDetailResponseType,
  player: GamePlayerProps
): number => {
  if (["attacksurvival", "squarex", "variables"].includes(game.ruleType)) {
    return 0;
  }
  return player.initialScore ?? 0;
};

/**
 * ゲーム形式に応じた初期誤答数を計算
 */
const getInitialWrong = (
  game: GetGameDetailResponseType,
  player: GamePlayerProps
): number => {
  if (game.ruleType === "backstream") {
    return initialBackstreamWrong(player.initialScore ?? 0);
  }
  if (game.ruleType === "squarex") {
    return 0;
  }
  return player.initialScore ?? 0;
};

/**
 * Backstreamの初期誤答計算
 */
const initialBackstreamWrong = (wrong_num: number): number => {
  const minusCountArray = [0, 1, 3, 6, 10];
  return wrong_num < 5 ? minusCountArray[wrong_num] : 10;
};

/**
 * プレイヤー順序の計算
 */
export const getSortedPlayerOrderListForOnline = (
  playersState: ComputedScoreProps[]
): string[] => {
  return playersState
    .sort((pre, cur) => {
      // 勝ち抜けているかどうか
      if (pre.state === "win" && cur.state !== "win") return -1;
      else if (pre.state !== "win" && cur.state === "win") return 1;
      // 最後に正解した問題番号の若さを比較
      else if (pre.state === "win" && cur.state === "win") {
        if (pre.last_correct < cur.last_correct) return -1;
        else if (cur.last_correct < pre.last_correct) return 1;
      }
      // ステージを比較
      if (pre.stage > cur.stage) return -1;
      else if (cur.stage > pre.stage) return 1;
      // スコアを比較
      if (pre.score > cur.score) return -1;
      else if (cur.score > pre.score) return 1;
      // 正答数を比較
      if (pre.correct > cur.correct) return -1;
      else if (cur.correct > pre.correct) return 1;
      // 誤答数を比較
      if (pre.wrong > cur.wrong) return 1;
      else if (cur.wrong > pre.wrong) return -1;
      return 0;
    })
    .map((score) => score.player_id);
};

/**
 * 順位表示文字列を生成
 */
export const indicator = (i: number): string => {
  i = Math.abs(i) + 1;
  const cent = i % 100;
  if (cent === 11 || cent === 12 || cent === 13) return `${i}th`;
  const dec = i % 10;
  if (dec === 1) return `${i}st`;
  if (dec === 2) return `${i}nd`;
  if (dec === 3) return `${i}rd`;
  return `${i}th`;
};

/**
 * スコア表示用のテキスト生成
 */
export const generateScoreText = (
  score: ComputedScoreProps,
  order: number
): string => {
  if (score.state === "win") {
    return indicator(order);
  }
  if (score.state === "lose") {
    return "LOSE";
  }
  return String(score.score);
};

export type { States };
