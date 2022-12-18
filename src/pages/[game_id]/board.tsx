import { useLiveQuery } from "dexie-react-hooks";
import { NextPage } from "next";
import { useRouter } from "next/router";

import BoardHeader from "#/components/BoardHeader";
import db, { gameDBProps } from "#/utils/db";

const Board: NextPage = () => {
  const router = useRouter();
  const { game_id } = router.query;
  const game = useLiveQuery(() => db.games.get(Number(game_id)));
  const players = useLiveQuery(
    () => db.players.where({ game_id: Number(game_id) }).toArray(),
    []
  );
  return (
    <div>
      <main>
        <BoardHeader />
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-evenly",
            marginTop: 5,
          }}
        >
          {players?.map((player, i) => (
            <div
              key={player.id}
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
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
              <button className="btn-primary btn"></button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Board;
