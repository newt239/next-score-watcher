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
  const props = { game_id: game.id!, player_id: player_id };
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
        <PlayerScoreButton variant="correct" {...props}>
          {score.score}
        </PlayerScoreButton>
      )}
      {game.rule === "nomx" && (
        <>
          <PlayerScoreButton variant="correct" {...props}>
            {score.state === "win" ? score.text : score.correct}
          </PlayerScoreButton>
          <PlayerScoreButton variant="wrong" {...props}>
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
                : "green"
            }
            {...props}
          >
            {score.text}
          </PlayerScoreButton>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <PlayerScoreButton variant="correct" {...props}>
              {score.correct}
            </PlayerScoreButton>
            <PlayerScoreButton variant="wrong" {...props}>
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
                : "green"
            }
            {...props}
          >
            {score.text}
          </PlayerScoreButton>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <PlayerScoreButton variant="correct" {...props}>
              ○
            </PlayerScoreButton>
            <PlayerScoreButton variant="wrong" {...props}>
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
                : "green"
            }
            {...props}
          >
            {score.text}
          </PlayerScoreButton>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <PlayerScoreButton variant="correct" {...props}>
              ○
            </PlayerScoreButton>
            <PlayerScoreButton variant="wrong" {...props}>
              {`${score.wrong}×`}
            </PlayerScoreButton>
          </div>
        </>
      )}
      {game.rule === "attacksurvival" && (
        <>
          <PlayerScoreButton
            variant={
              score.state === "win"
                ? "correct"
                : score.state === "lose"
                ? "wrong"
                : "green"
            }
            {...props}
          >
            {score.text}
          </PlayerScoreButton>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <PlayerScoreButton variant="correct" {...props}>
              {`${score.correct}○`}
            </PlayerScoreButton>
            <PlayerScoreButton variant="wrong" {...props}>
              {`${score.wrong}×`}
            </PlayerScoreButton>
          </div>
        </>
      )}
      {game.rule === "squarex" && (
        <>
          <PlayerScoreButton
            variant={
              score.state === "win"
                ? "correct"
                : score.state === "lose"
                ? "wrong"
                : "green"
            }
            {...props}
          >
            {score.text}
          </PlayerScoreButton>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <PlayerScoreButton variant="green" text {...props}>
              {score.odd_score}
            </PlayerScoreButton>
            ×
            <PlayerScoreButton variant="green" text {...props}>
              {score.even_score}
            </PlayerScoreButton>
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <PlayerScoreButton variant="correct" {...props}>
              ○
            </PlayerScoreButton>
            <PlayerScoreButton variant="wrong" {...props}>
              ×
            </PlayerScoreButton>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerScore;
