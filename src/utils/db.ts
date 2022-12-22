import Dexie, { Table } from "dexie";

export type DexieDatabase = { [P in keyof Dexie]: Dexie[P] };

export type RuleNames = "normal" | "nomx" | "nbyn" | "nupdown" | "swedishx";

export type GameDBProps = {
  id?: number;
  name: string;
  count: number; // プレイヤーの人数
  rule: RuleNames;
  correct_me: number;
  wrong_me: number;
  correct_other?: number;
  wrong_other?: number;
  win_point?: number;
  lose_point?: number;
  win_through?: number;
  limit?: number;
  started: boolean;
  quizset_name?: string;
  quizset_offset: number;
};

export type PlayerDBProps = {
  id?: number;
  game_id: number;
  name: string;
  belong: string;
  initial_correct: number;
  initial_wrong: number;
};

export type Variants = "correct" | "wrong" | "through";
export type LogDBProps = {
  id?: number;
  game_id: number;
  player_id: number;
  variant: Variants;
};

export type States = "win" | "lose" | "playing";
export type ComputedScoreDBProps = {
  id: string; // ${game_id}_${player_id}
  game_id: number;
  player_id: number;
  state: States;
  score: number;
  correct: number; // 正解数
  wrong: number; // 誤答数
  last_correct: number; // 最後に正解した問題番号
  last_wrong: number; // 最後に誤答した問題番号
  odd_score: number; // 奇数問目のスコア
  even_score: number; // 偶数問目のスコア
  order: number; // プレイヤー同士の評価順
  text: string; // 画面上に表示するための文字
};

export type QuizDBProps = {
  id?: number;
  index: number;
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
    "++id, rule, name, count, correct_me, wrong_me, correct_other, wrong_other, win_point, lose_point, win_through, limit, started, quizset_name, quizset_offset",
  players: "++id, game_id, name, belong, initial_correct, initial_wrong",
  logs: "++id, game_id, player_id, variant",
  computed_scores:
    "id, game_id, player_id, state, score, correct, wrong, last_correct, last_wrong, odd_score, even_score, order, text",
  quizes: "++id, index, q, a, set_name",
});

db.open()
  .then((r) => console.log("open score_watcher database"))
  .catch((r) => console.log(r));

export default db;
