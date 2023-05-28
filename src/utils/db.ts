import Dexie from "dexie";

import { ScoreWatcherDBTables } from "./types";

const db = new Dexie("score_watcher") as ScoreWatcherDBTables;
db.version(2).stores({
  games:
    "id, rule, name, players, correct_me, wrong_me, correct_other, wrong_other, win_point, lose_point, win_through, limit, quiz, editable, discord_webhook_url, last_open",
  players: "id, name, belong, text, tags",
  logs: "id, game_id, player_id, variant, system",
  quizes: "id, q, a, set_name",
});

db.open().catch((r) => console.log(r));

export default db;
