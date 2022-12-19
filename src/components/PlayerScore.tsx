import PlayerScoreButton from "#/blocks/PlayerScoreButton";
import db, { ComputedScoreDBProps, Rules } from "#/utils/db";

type PlayerScoreProps = {
  rule: Rules;
  game_id: number;
  player_id: number;
  score: ComputedScoreDBProps;
};

const PlayerScore: React.FC<PlayerScoreProps> = ({
  rule,
  game_id,
  player_id,
  score,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "70%",
        gap: 5,
        margin: 5,
      }}
    >
      {rule === "normal" && (
        <PlayerScoreButton
          variant="correct"
          state={score.state}
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
        </PlayerScoreButton>
      )}
      {rule === "nomx" && (
        <>
          <PlayerScoreButton
            variant="correct"
            state={score.state}
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
            {score.state === "win" ? score.text : score.correct}
          </PlayerScoreButton>
          <PlayerScoreButton
            variant="wrong"
            state={score.state}
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
            {score.state === "lose" ? score.text : score.wrong}
          </PlayerScoreButton>
        </>
      )}
    </div>
  );
};

export default PlayerScore;
