import { Button } from "semantic-ui-react";

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
    <div style={{ display: "flex", flexDirection: "column" }}>
      {rule === "normal" && (
        <Button
          circular
          color="red"
          style={{ fontSize: "2rem", aspectRatio: "1 / 1", margin: 5 }}
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
        </Button>
      )}
      {rule === "nomx" && (
        <>
          <Button
            circular
            color="red"
            style={{ fontSize: "2rem", aspectRatio: "1 / 1", margin: 5 }}
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
          </Button>
          <Button
            circular
            color="blue"
            style={{ fontSize: "2rem", aspectRatio: "1 / 1", margin: 5 }}
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
          </Button>
        </>
      )}
    </div>
  );
};

export default PlayerScore;
