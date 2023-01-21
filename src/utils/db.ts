import Dexie, { Table } from "dexie";

export type DexieDatabase = { [P in keyof Dexie]: Dexie[P] };

export type RuleNames =
  | "normal"
  | "nomx"
  | "nbyn"
  | "nupdown"
  | "swedishx"
  | "attacksurvival"
  | "squarex"
  | "z"
  | "freezx";

export type GameDBPlayerProps = {
  id: string;
  name: string;
  initial_correct: number;
  initial_wrong: number;
};

export type GameDBProps = {
  id: string;
  name: string;
  players: GameDBPlayerProps[];
  rule: RuleNames;
  correct_me: number;
  wrong_me: number;
  correct_other?: number;
  wrong_other?: number;
  win_point?: number;
  lose_point?: number;
  win_through?: number;
  limit?: number;
  quiz_set?: string;
  editable: boolean;
};

export type PlayerDBProps = {
  id: string;
  name: string;
  text: string;
  belong: string;
  tags: string[];
};

export type Variants = "correct" | "wrong" | "through";
export type LogDBProps = {
  id: string;
  game_id: string;
  player_id: string;
  variant: Variants;
  system: boolean;
  timestamp: string;
};

export type States = "win" | "lose" | "playing";
export type ComputedScoreDBProps = {
  id?: string;
  game_id: string;
  player_id: string;
  state: States;
  score: number;
  correct: number; // 正解数
  wrong: number; // 誤答数
  last_correct: number; // 最後に正解した問題番号
  last_wrong: number; // 最後に誤答した問題番号
  odd_score: number; // 奇数問目のスコア
  even_score: number; // 偶数問目のスコア
  stage: number;
  isIncapacity: boolean;
  order: number; // プレイヤー同士の評価順
  text: string; // 画面上に表示するための文字
};

export type QuizDBProps = {
  id: string;
  n: number;
  q: string;
  a: string;
  set_name: string;
};

export interface ScoreWatcherDBTables extends DexieDatabase {
  games: Table<GameDBProps>;
  players: Table<PlayerDBProps>;
  logs: Table<LogDBProps>;
  computed_scores: Table<ComputedScoreDBProps>;
  quizes: Table<QuizDBProps>;
}

const db = new Dexie("score_watcher") as ScoreWatcherDBTables;
db.version(1).stores({
  games:
    "id, rule, name, players, correct_me, wrong_me, correct_other, wrong_other, win_point, lose_point, win_through, limit, quiz_set, editable",
  players: "id, name, belong, text, tags",
  logs: "id, game_id, player_id, variant, system",
  quizes: "id, q, a, set_name",
  computed_scores:
    "++id, game_id, player_id, state, score, correct, wrong, last_correct, last_wrong, odd_score, even_score, stage, isIncapacity, order, text",
});

db.open()
  .then((r) => console.log("open score_watcher database"))
  .catch((r) => console.log(r));

export default db;
