import db, { logDBProps, playerDBProps, Rule } from "#/utils/db";

type PlayerProps = {
  rule: Rule;
  game_id: number;
  player_id: number;
  logs: logDBProps[];
};
const PlayerScore: React.FC<PlayerProps> = ({
  rule,
  game_id,
  player_id,
  logs,
}) => {
  return (
    <div>
      {rule === "normal" && (
        <div
          style={{ fontSize: "2rem", color: "red", cursor: "pointer" }}
          onClick={async () => {
            try {
              await db.logs.put({
                game_id,
                player_id,
                variant: "correct",
              });
            } catch (err) {
              console.log(err);
            }
          }}
        >
          {logs.filter((log) => log.variant === "correct").length -
            logs.filter((log) => log.variant === "wrong").length}
        </div>
      )}
      {rule === "nomx" && (
        <>
          <div
            style={{ fontSize: "2rem", color: "red", cursor: "pointer" }}
            onClick={async () => {
              try {
                await db.logs.put({
                  game_id: Number(game_id),
                  player_id: Number(player_id),
                  variant: "correct",
                });
              } catch (err) {
                console.log(err);
              }
            }}
          >
            {logs.filter((log) => log.variant === "correct").length}
          </div>
          <div
            style={{ fontSize: "2rem", color: "blue", cursor: "pointer" }}
            onClick={async () => {
              try {
                await db.logs.put({
                  game_id: Number(game_id),
                  player_id: Number(player_id),
                  variant: "wrong",
                });
              } catch (err) {
                console.log(err);
              }
            }}
          >
            {logs.filter((log) => log.variant === "wrong").length}
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerScore;
