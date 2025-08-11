import type {
  ComputedScoreProps,
  OnlineGameDBPlayerProps,
  RuleNames,
  States,
} from "@/models/games";

export type OnlineGameCore = {
  id: string;
  name: string;
  ruleType: RuleNames;
};

export type OnlineSettings = {
  winPoint?: number;
  losePoint?: number;
  targetPoint?: number;
  restCount?: number;
  correctMe?: number;
  wrongMe?: number;
  correctOther?: number;
  wrongOther?: number;
  winThrough?: number;
};

export type OnlineGameWithSettings = OnlineGameCore & OnlineSettings;

/**
 * プレイヤーの初期状態を生成
 */
export const getInitialPlayersStateForOnline = (
  game: OnlineGameWithSettings,
  players: OnlineGameDBPlayerProps[]
): ComputedScoreProps[] => {
  return players.map((p) => ({
    game_id: game.id,
    player_id: p.id,
    score: getInitialScore(game, p),
    correct: getInitialCorrect(game, p),
    wrong: getInitialWrong(game, p),
    last_correct: -10,
    last_wrong: -10,
    state: "playing",
    reach_state: "playing",
    odd_score: game.ruleType === "squarex" ? p.initial_correct : 0,
    even_score: game.ruleType === "squarex" ? p.initial_wrong : 0,
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
  game: OnlineGameWithSettings,
  player: OnlineGameDBPlayerProps
): number => {
  switch (game.ruleType) {
    case "divide":
      return game.correctMe ?? 10;
    case "attacksurvival":
      return (game.winPoint ?? 15) + player.initial_correct;
    case "ny":
      return player.initial_correct - player.initial_wrong;
    case "nomr":
      return player.initial_correct;
    case "backstream":
      return (
        player.initial_correct - initialBackstreamWrong(player.initial_wrong)
      );
    case "squarex":
      return (player.initial_correct || 1) * (player.initial_wrong || 1);
    case "aql":
      return 1;
    default:
      return player.initial_correct - player.initial_wrong;
  }
};

/**
 * ゲーム形式に応じた初期正解数を計算
 */
const getInitialCorrect = (
  game: OnlineGameWithSettings,
  player: OnlineGameDBPlayerProps
): number => {
  if (["attacksurvival", "squarex", "variables"].includes(game.ruleType)) {
    return 0;
  }
  return player.initial_correct;
};

/**
 * ゲーム形式に応じた初期誤答数を計算
 */
const getInitialWrong = (
  game: OnlineGameWithSettings,
  player: OnlineGameDBPlayerProps
): number => {
  if (game.ruleType === "backstream") {
    return initialBackstreamWrong(player.initial_wrong);
  }
  if (game.ruleType === "squarex") {
    return 0;
  }
  return player.initial_wrong;
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
