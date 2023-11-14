import Dexie, { Table } from "dexie";

import { Database } from "./schema";

export type DexieDatabase = { [P in keyof Dexie]: Dexie[P] };

export type RuleNames =
  | "normal"
  | "nomx"
  | "nomx-ad"
  | "ny"
  | "nomr"
  | "nbyn"
  | "nupdown"
  | "swedish10"
  | "backstream"
  | "attacksurvival"
  | "squarex"
  | "z"
  | "freezex"
  | "variables";

export type GameDBPlayerProps = {
  id: string;
  name: string;
  initial_correct: number;
  initial_wrong: number;
  base_correct_point: number;
  base_wrong_point: number;
};

export type GameDBQuizProps = {
  set_name: string;
  offset: number;
};

export type GameOptionProps = {
  [key in Exclude<RuleNames, "nomx-ad">]: null;
} & {
  "nomx-ad": {
    streak_over3: boolean;
  };
};

export type GamePropsOnSupabase = Database["public"]["Tables"]["games"]["Row"];

export type GameDBPropsUnion = {
  [T in RuleNames]: GamePropsOnSupabase & {
    rule: T;
    players: string[];
    quiz: {
      set_name: string;
      offset: number;
    } | null;
    options: GameOptionProps[T];
  };
};

export type GameDBProps = GameDBPropsUnion[RuleNames];

export type GamePlayerPropsOnSupabase =
  Database["public"]["Tables"]["game_players"]["Row"];

export type GamePlayerDBProps = GamePlayerPropsOnSupabase & {
  options: {
    [key: string]: boolean;
  } | null;
};

export type PlayerPropsOnSupabase =
  Database["public"]["Tables"]["players"]["Row"];

export type GamePlayerWithProfileProps = GamePlayerPropsOnSupabase & {
  players: PlayerPropsOnSupabase;
};

export type PlayerDBProps = {
  id: string;
  name: string;
  order: string;
  belong: string;
};

export type QuizsetPropsOnSupabase =
  Database["public"]["Tables"]["quizsets"]["Row"];

export type GameLogPropsOnSupabase =
  Database["public"]["Tables"]["game_logs"]["Row"];

export type Variants = "correct" | "wrong" | "through" | "skip";

export type GameLogDBProps = GameLogPropsOnSupabase & {
  variant: Variants;
  options: {
    [key: string]: boolean;
  } | null;
};

export type States = "win" | "lose" | "playing";
export type ComputedScoreProps = {
  game_id: string;
  player_id: string;
  state: States;
  reach_state: States;
  score: number;
  correct: number; // 正解数
  wrong: number; // 誤答数
  last_correct: number; // 最後に正解した問題番号
  last_wrong: number; // 最後に誤答した問題番号
  odd_score: number; // 奇数問目のスコア
  even_score: number; // 偶数問目のスコア
  stage: number;
  is_incapacity: boolean;
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
  games: Table<GamePropsOnSupabase>;
  players: Table<PlayerDBProps>;
  logs: Table<GameLogDBProps>;
  quizes: Table<QuizDBProps>;
}

export type WinPlayerProps = {
  player_id: string;
  name?: string;
  text: string;
};

export type AQLGamePropsUnion = {
  id: string;
  name: string;
  left_team: string;
  right_team: string;
  quiz: {
    set_name: string;
    offset: number;
  };
  last_open: string;
};
