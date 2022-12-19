import db, { ComputedScoreDBProps, Rule } from "#/utils/db";

type PlayerProps = {
  rule: Rule;
  game_id: number;
  player_id: number;
  score: ComputedScoreDBProps;
};

const PlayerScore: React.FC<PlayerProps> = ({
  rule,
  game_id,
  player_id,
  score,
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
          {score.score}
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
            {score.correct}
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
            {score.wrong}
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerScore;
