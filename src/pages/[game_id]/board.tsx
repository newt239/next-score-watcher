import { useEffect } from "react";

import { useLiveQuery } from "dexie-react-hooks";
import { NextPage } from "next";
import { useRouter } from "next/router";

import BoardHeader from "#/components/BoardHeader";
import Player from "#/components/Player";
import computeScore from "#/utils/computeScore";
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
  const computed_scores = useLiveQuery(
    () => db.computed_scores.where({ game_id: Number(game_id) }).toArray(),
    []
  );

  useEffect(() => {
    computeScore(Number(game_id));
  }, [logs]);

  if (!game || !players || !computed_scores) {
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
          {players?.map((player, i) => (
            <Player
              player={player}
              key={i}
              index={i}
              score={computed_scores.find(
                (score) => score.player_id === player.id
              )}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Board;
