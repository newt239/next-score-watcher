import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/router";

import PlayerScore from "./PlayerScore";

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
      <PlayerScore
        rule={game.rule}
        game_id={Number(game.id)}
        player_id={Number(player.id)}
        logs={playerLogs}
      />
    </div>
  );
};

export default Player;
