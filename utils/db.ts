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
};

export interface MotionCraftDatabase extends DexieDatabase {
  games: Table<gameDBProps>;
}

const db = new Dexie("score_watcher") as MotionCraftDatabase;
db.version(1).stores({
  games:
    "++id, type, name, count, correct_me, wrong_me, correct_other, wrong_other, win_point, lose_point, win_through, limit",
});
db.open();

export default db;
