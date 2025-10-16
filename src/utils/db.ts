import Dexie from "dexie";

import type { ScoreWatcherDBTables } from "@/utils/types";

const db = (name?: string | null) => {
  const db_name =
    name === undefined || name === null || name === "" ? "score_watcher" : name;
  const localDB = new Dexie(db_name) as ScoreWatcherDBTables;
  localDB
    .version(5)
    .stores({
      games:
        "id, rule, name, players, correct_me, wrong_me, correct_other, wrong_other, win_point, lose_point, win_through, limit, quiz, discord_webhook_url, options, editable, last_open",
      players: "id, name, belong, text, tags",
      logs: "id, game_id, player_id, variant, system, available",
      quizes: "id, q, a, set_name",
    })
    .upgrade((trans) => {
      return trans
        .table("logs")
        .toCollection()
        .modify((game) => {
          if (game.system !== 1) {
            game.system = 0;
          }
          if (game.available !== 0) {
            game.available = 1;
          }
        });
    });

  localDB.open().catch((r) => console.log(r));
  return localDB;
};

export default db;
