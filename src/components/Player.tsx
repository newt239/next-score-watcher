import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/router";
import { Card } from "semantic-ui-react";

import PlayerScore from "./PlayerScore";

import db, { ComputedScoreDBProps, PlayerDBProps } from "#/utils/db";

type PlayerProps = {
  player: PlayerDBProps;
  index: number;
  score: ComputedScoreDBProps | undefined;
};

const Player: React.FC<PlayerProps> = ({ player, index, score }) => {
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
  const colorState =
    score &&
    (score.state === "win"
      ? "#db2828"
      : score.state == "lose"
      ? "#2185d0"
      : undefined);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: colorState,
        color: colorState && "white",
        width: "max(8vh, 8vw)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 5,
        }}
      >
        <div>{index + 1}</div>
        <div>{player.belong !== "" ? player.belong : "_"}</div>
      </div>
      <div
        style={{
          display: "flex",
          writingMode: "vertical-rl",
          textOrientation: "upright",
          fontSize: "clamp(8vh, 2rem, 8vw)",
          fontWeight: 800,
          height: "50vh",
          margin: "auto",
        }}
      >
        {player.name}
      </div>
      {score ? (
        <PlayerScore
          rule={game.rule}
          game_id={Number(game.id)}
          player_id={Number(player.id)}
          score={score}
        />
      ) : (
        <div>ERR!</div>
      )}
    </div>
  );
};

export default Player;
