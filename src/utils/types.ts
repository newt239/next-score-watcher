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
  [key in Exclude<RuleNames, "nomx-ad">]: undefined;
} & {
  "nomx-ad": {
    streak_over3: boolean;
  };
};

export type GameDBProps = {
  id: string;
  name: string;
  rule: string;
  correct_me: number;
  wrong_me: number;
  correct_other?: number;
  wrong_other?: number;
  win_point?: number;
  lose_point?: number;
  win_through?: number;
  limit?: number;
  quiz?: GameDBQuizProps;
  discord_webhook_url: string;
  editable: boolean;
  options?: {
    [key: string]: boolean;
  };
};

export type GamePropsUnion = Database["public"]["Tables"]["games"]["Row"];

export type GamesDB = Database["public"]["Tables"]["games"];

export type GamePlayersDB = Database["public"]["Tables"]["game_players"];

export type PlayersDB = Database["public"]["Tables"]["players"];

export type PlayerDBProps = {
  id: string;
  name: string;
  order: string;
  belong: string;
};

export type Variants = "correct" | "wrong" | "through" | "skip";
export type LogDBProps = {
  id: string;
  game_id: string;
  player_id: string;
  variant: Variants;
  system: boolean;
  timestamp: string;
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
  games: Table<GamePropsUnion>;
  players: Table<PlayerDBProps>;
  logs: Table<LogDBProps>;
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
