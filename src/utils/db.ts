import Dexie, { Table } from "dexie";

export type DexieDatabase = { [P in keyof Dexie]: Dexie[P] };

export type gameDBProps = {
  id?: number;
  name: string;
  count: number;
  type: "normal";
  correct_me: number;
  wrong_me: number;
  correct_other: number;
  wrong_other: number;
  win_point?: number;
  lose_point?: number;
  win_through?: number;
  limit?: number;
  started: boolean;
};

export type playerDBProps = {
  id?: number;
  game_id: number;
  name: string;
  belong?: string;
  initial_correct: number;
  initial_wrong: number;
};

export type logDBProps = {
  id?: number;
  game_id: number;
  player_id: number;
  variant: string;
};

export interface MotionCraftDatabase extends DexieDatabase {
  games: Table<gameDBProps>;
  players: Table<playerDBProps>;
  logs: Table<logDBProps>;
}

const db = new Dexie("score_watcher") as MotionCraftDatabase;
db.version(1).stores({
  games:
    "++id, type, name, count, correct_me, wrong_me, correct_other, wrong_other, win_point, lose_point, win_through, limit, started",
  players:
    "++id, game_id -> games.id, name, belong, initial_correct, initial_wrong",
  logs: "++id, game_id -> games.id, player_id -> players.id, variant",
});
db.open();

export default db;
