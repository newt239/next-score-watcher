import Dexie from "dexie";

import { ScoreWatcherDBTables } from "~/utils/types";

const db = new Dexie("score_watcher") as ScoreWatcherDBTables;
db.version(3)
  .stores({
    games:
      "id, rule, name, players, correct_me, wrong_me, correct_other, wrong_other, win_point, lose_point, win_through, limit, quiz, discord_webhook_url, options, editable, last_open",
    players: "id, name, belong, text, tags",
    logs: "id, game_id, player_id, variant, system",
    quizes: "id, q, a, set_name",
  })
  .upgrade((trans) => {
    return trans
      .table("games")
      .toCollection()
      .modify((game) => {
        if (!game.options) {
          if (game.rule === "nomx-ad") {
            game.options = {
              streak_over3: true,
            };
          } else {
            game.options = undefined;
          }
        }
      });
  });

db.open().catch((r) => console.log(r));

export default db;
