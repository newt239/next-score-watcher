import { Box, theme, useColorMode } from "@chakra-ui/react";

import PlayerScoreButton from "#/blocks/PlayerScoreButton";
import db, { ComputedScoreDBProps, GameDBProps } from "#/utils/db";

type PlayerScoreProps = {
  game: GameDBProps;
  player_id: number;
  score: ComputedScoreDBProps;
  qn: number;
};

const PlayerScore: React.FC<PlayerScoreProps> = ({
  game,
  player_id,
  score,
  qn,
}) => {
  const { colorMode } = useColorMode();
  const props = {
    game_id: game.id!,
    player_id: player_id,
    editable: game.editable,
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        py: 5,
        m: 1,
        backgroundColor:
          colorMode === "light" ? "white" : theme.colors.gray[800],
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colorMode === "light" ? "white" : theme.colors.gray[800],
        borderBottomRadius: "calc(1rem - 1px)",
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
              color: "black",
            }}
          >
            <PlayerScoreButton color="green" filled {...props}>
              {score.odd_score}
            </PlayerScoreButton>
            ×
            <PlayerScoreButton color="green" filled {...props}>
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
      {game.rule === "z" && (
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
            {score.isIncapacity ||
            (qn === score.last_wrong + 1 && score.stage === 1)
              ? "LOCKED"
              : score.text}
          </PlayerScoreButton>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlayerScoreButton
              color="red"
              disabled={
                score.isIncapacity ||
                (qn === score.last_wrong + 1 && score.stage === 1)
              }
              {...props}
            >
              {`${score.correct}○`}
            </PlayerScoreButton>
            <PlayerScoreButton
              color="blue"
              disabled={
                score.isIncapacity ||
                (qn === score.last_wrong + 1 && score.stage === 1)
              }
              {...props}
            >
              {`${score.wrong}×`}
            </PlayerScoreButton>
          </div>
        </>
      )}
      {game.rule === "freezx" && (
        <>
          <PlayerScoreButton
            color={score.isIncapacity ? "green" : "red"}
            {...props}
          >
            {score.text}
          </PlayerScoreButton>
          <PlayerScoreButton color="blue" {...props}>
            {`${score.wrong}×`}
          </PlayerScoreButton>
        </>
      )}
    </Box>
  );
};

export default PlayerScore;
