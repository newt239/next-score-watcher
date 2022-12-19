import { useLiveQuery } from "dexie-react-hooks";
import { NextPage } from "next";
import { useRouter } from "next/router";

import BoardHeader from "#/components/BoardHeader";
import db, { playerDBProps } from "#/utils/db";

type PlayerProps = {
  player: playerDBProps;
  index: number;
};
const Player: React.FC<PlayerProps> = ({ player, index }) => {
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
  const playerLogs = logs.filter((log) => log.player_id === player.id);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>{player.belong}</div>
        <div>{index + 1}</div>
      </div>
      <div
        style={{
          display: "flex",
          writingMode: "vertical-rl",
          fontSize: "clamp(8vh, 2rem, 8vw)",
          fontWeight: 800,
          height: "50vh",
          margin: "auto",
        }}
      >
        {player.name}
      </div>
      {game.type === "normal" && (
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
          {playerLogs.filter((log) => log.variant === "correct").length -
            playerLogs.filter((log) => log.variant === "wrong").length}
        </div>
      )}
      {game.type === "nomx" && (
        <>
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
            {playerLogs.filter((log) => log.variant === "correct").length}
          </div>
          <div
            style={{ fontSize: "2rem", color: "blue", cursor: "pointer" }}
            onClick={async () => {
              try {
                await db.logs.put({
                  game_id: Number(game_id),
                  player_id: Number(player.id),
                  variant: "wrong",
                });
              } catch (err) {
                console.log(err);
              }
            }}
          >
            {playerLogs.filter((log) => log.variant === "wrong").length}
          </div>
        </>
      )}
    </div>
  );
};

export default Player;
