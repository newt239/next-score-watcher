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
        width: "100%",
        gap: 5,
        margin: 5,
      }}
    >
      {game.rule === "normal" && (
        <PlayerScoreButton color="red" {...props}>
          {score.score}
        </PlayerScoreButton>
      )}
      {game.rule === "nomx" && (
        <>
          <PlayerScoreButton color="red" {...props}>
            {score.state === "win" ? score.text : score.correct}
          </PlayerScoreButton>
          <PlayerScoreButton color="blue" {...props}>
            {score.state === "lose" ? score.text : score.wrong}
          </PlayerScoreButton>
        </>
      )}
      {game.rule === "nbyn" && (
        <>
          <PlayerScoreButton
            color={
              score.state === "win"
                ? "red"
                : score.state === "lose"
                ? "blue"
                : "green"
            }
            {...props}
          >
            {score.text}
          </PlayerScoreButton>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlayerScoreButton color="red" {...props}>
              {score.correct}
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" {...props}>
              {game.win_point! - score.wrong}
            </PlayerScoreButton>
          </div>
        </>
      )}
      {game.rule === "nupdown" && (
        <>
          <PlayerScoreButton
            color={
              score.state === "win"
                ? "red"
                : score.state === "lose"
                ? "blue"
                : "green"
            }
            {...props}
          >
            {score.text}
          </PlayerScoreButton>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlayerScoreButton color="red" {...props}>
              ○
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" {...props}>
              {`${score.wrong}×`}
            </PlayerScoreButton>
          </div>
        </>
      )}
      {game.rule === "swedishx" && (
        <>
          <PlayerScoreButton
            color={
              score.state === "win"
                ? "red"
                : score.state === "lose"
                ? "blue"
                : "green"
            }
            {...props}
          >
            {score.text}
          </PlayerScoreButton>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlayerScoreButton color="red" {...props}>
              ○
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" {...props}>
              {`${score.wrong}×`}
            </PlayerScoreButton>
          </div>
        </>
      )}
      {game.rule === "attacksurvival" && (
        <>
          <PlayerScoreButton
            color={
              score.state === "win"
                ? "red"
                : score.state === "lose"
                ? "blue"
                : "green"
            }
            {...props}
          >
            {score.text}
          </PlayerScoreButton>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlayerScoreButton color="red" {...props}>
              {`${score.correct}○`}
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" {...props}>
              {`${score.wrong}×`}
            </PlayerScoreButton>
          </div>
        </>
      )}
      {game.rule === "squarex" && (
        <>
          <PlayerScoreButton
            color={
              score.state === "win"
                ? "red"
                : score.state === "lose"
                ? "blue"
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
            <PlayerScoreButton color="green" text {...props}>
              {score.odd_score}
            </PlayerScoreButton>
            ×
            <PlayerScoreButton color="green" text {...props}>
              {score.even_score}
            </PlayerScoreButton>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlayerScoreButton color="red" {...props}>
              ○
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" {...props}>
              ×
            </PlayerScoreButton>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerScore;
