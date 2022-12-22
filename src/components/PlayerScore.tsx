import PlayerScoreButton from "#/blocks/PlayerScoreButton";
import db, { ComputedScoreDBProps, GameDBProps } from "#/utils/db";

type PlayerScoreProps = {
  game: GameDBProps;
  player_id: number;
  score: ComputedScoreDBProps;
};

const PlayerScore: React.FC<PlayerScoreProps> = ({
  game,
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
      {game.rule === "normal" && (
        <PlayerScoreButton
          variant="correct"
          state={score.state}
          onClick={async () => {
            try {
              await db.logs.put({
                game_id: game.id!,
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
      {game.rule === "nomx" && (
        <>
          <PlayerScoreButton
            variant="correct"
            state={score.state}
            onClick={async () => {
              try {
                await db.logs.put({
                  game_id: game.id!,
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
                  game_id: game.id!,
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
      {game.rule === "nbyn" && (
        <>
          <PlayerScoreButton
            variant={
              score.state === "win"
                ? "correct"
                : score.state === "lose"
                ? "wrong"
                : "through"
            }
            state={score.state}
          >
            {score.text}
          </PlayerScoreButton>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <PlayerScoreButton
              variant="correct"
              state={score.state}
              onClick={async () => {
                try {
                  await db.logs.put({
                    game_id: game.id!,
                    player_id: Number(player_id),
                    variant: "correct",
                  });
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              {score.correct}
            </PlayerScoreButton>
            <PlayerScoreButton
              variant="wrong"
              state={score.state}
              onClick={async () => {
                try {
                  await db.logs.put({
                    game_id: game.id!,
                    player_id: Number(player_id),
                    variant: "wrong",
                  });
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              {game.win_point! - score.wrong}
            </PlayerScoreButton>
          </div>
        </>
      )}
      {game.rule === "nupdown" && (
        <>
          <PlayerScoreButton
            variant={
              score.state === "win"
                ? "correct"
                : score.state === "lose"
                ? "wrong"
                : "through"
            }
            state={score.state}
          >
            {score.text}
          </PlayerScoreButton>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <PlayerScoreButton
              variant="correct"
              state={score.state}
              onClick={async () => {
                try {
                  await db.logs.put({
                    game_id: game.id!,
                    player_id,
                    variant: "correct",
                  });
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              ○
            </PlayerScoreButton>
            <PlayerScoreButton
              variant="wrong"
              state={score.state}
              onClick={async () => {
                try {
                  await db.logs.put({
                    game_id: game.id!,
                    player_id,
                    variant: "wrong",
                  });
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              {`${score.wrong}×`}
            </PlayerScoreButton>
          </div>
        </>
      )}
      {game.rule === "swedishx" && (
        <>
          <PlayerScoreButton
            variant={
              score.state === "win"
                ? "correct"
                : score.state === "lose"
                ? "wrong"
                : "through"
            }
            state={score.state}
          >
            {score.text}
          </PlayerScoreButton>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <PlayerScoreButton
              variant="correct"
              state={score.state}
              onClick={async () => {
                try {
                  await db.logs.put({
                    game_id: game.id!,
                    player_id,
                    variant: "correct",
                  });
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              ○
            </PlayerScoreButton>
            <PlayerScoreButton
              variant="wrong"
              state={score.state}
              onClick={async () => {
                try {
                  await db.logs.put({
                    game_id: game.id!,
                    player_id,
                    variant: "wrong",
                  });
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              {`${score.wrong}×`}
            </PlayerScoreButton>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerScore;
