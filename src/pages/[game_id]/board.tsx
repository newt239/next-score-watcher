import { useLiveQuery } from "dexie-react-hooks";
import { NextPage } from "next";
import { useRouter } from "next/router";

import BoardHeader from "#/components/BoardHeader";
import db from "#/utils/db";

const Board: NextPage = () => {
  const router = useRouter();
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(Number(game_id)));
  const players = useLiveQuery(
    () => db.players.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  const logs = useLiveQuery(
    () => db.logs.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  if (!game || !players || !logs) {
    return null;
  }
  return (
    <div>
      <main>
        <div style={{ padding: "1rem" }}>
          <BoardHeader />
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-evenly",
            marginTop: 5,
          }}
        >
          {players?.map((player, i) => {
            const playerLogs = logs.filter(
              (log) => log.player_id === player.id
            );
            return (
              <div
                key={player.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div>{player.belong}</div>
                  <div>{i + 1}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    writingMode: "vertical-rl",
                    fontSize: "clamp(8vh, 2rem, 8vw)",
                    height: "50vh",
                    margin: "auto",
                  }}
                >
                  {player.name}
                </div>
                <div
                  style={{ fontSize: "2rem", color: "red", cursor: "pointer" }}
                  onClick={async () => {
                    try {
                      await db.logs.put({
                        game_id: Number(game_id),
                        player_id: Number(player.id),
                        variant: "correct",
                      });
                    } catch (err) {
                      console.log(err);
                    }
                  }}
                >
                  {playerLogs.filter((log) => log.variant === "correct")
                    .length -
                    playerLogs.filter((log) => log.variant === "wrong").length}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Board;
