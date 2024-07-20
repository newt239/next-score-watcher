import Dexie, { Table } from "dexie";

export type DexieDatabase = { [P in keyof Dexie]: Dexie[P] };

export type RuleNames =
  | "normal"
  | "nomx"
  | "nomx-ad"
  | "ny"
  | "nomr"
  | "nbyn"
  | "nupdown"
  | "divide"
  | "swedish10"
  | "backstream"
  | "attacksurvival"
  | "squarex"
  | "z"
  | "freezex"
  | "endless-chance"
  | "variables"
  | "aql";

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
  [key in Exclude<RuleNames, "nomx-ad" | "endless-chance", "aql">]: undefined;
} & {
  "nomx-ad": {
    streak_over3: boolean;
  };
  "endless-chance": {
    use_r: boolean;
  };
  aql: {
    left_team: string;
    right_team: string;
  };
};

export type AllGameProps = {
  [T in RuleNames]: {
    id: string;
    name: string;
    players: GameDBPlayerProps[];
    rule: T;
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
    options: GameOptionProps[T];
    editable: boolean;
    last_open: string;
    available: boolean;
  };
};

export type GamePropsUnion = AllGameProps[RuleNames];

export type PlayerDBProps = {
  id: string;
  name: string;
  text: string;
  belong: string;
  tags: string[];
};

export type Variants =
  | "correct"
  | "wrong"
  | "through"
  | "mutiple_correct"
  | "multiple_wrong"
  | "skip"
  | "blank";
export type LogDBProps = {
  id: string;
  game_id: string;
  player_id: string;
  variant: Variants;
  system: boolean;
  timestamp: string;
  available: boolean;
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
  available: boolean;
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
