import { Box, theme, useColorMode, useMediaQuery } from "@chakra-ui/react";

import PlayerScoreButton from "#/blocks/PlayerScoreButton";
import { ComputedScoreDBProps, GameDBProps } from "#/utils/db";

type PlayerScoreProps = {
  game: GameDBProps;
  player_id: string;
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
  const [isLargerThan700] = useMediaQuery("(min-width: 700px)");

  const props = {
    game_id: game.id,
    player_id: player_id,
    editable: game.editable,
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: isLargerThan700 ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        paddingTop: isLargerThan700 ? 3 : undefined,
        paddingBottom: isLargerThan700 ? 3 : undefined,
        paddingLeft: isLargerThan700 ? undefined : "0.5rem",
        paddingRight: isLargerThan700 ? undefined : "0.5rem",
        gap: isLargerThan700 ? 3 : 1.5,
        backgroundColor:
          colorMode === "light" ? "white" : theme.colors.gray[800],
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colorMode === "light" ? "white" : theme.colors.gray[800],
        borderRadius: isLargerThan700
          ? "0 0 calc(1rem - 6px) calc(1rem - 6px)"
          : "0 calc(1rem - 2px) calc(1rem - 2px) 0",
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
            {score.state === "win" ? score.text : `${score.correct}○`}
          </PlayerScoreButton>
          <PlayerScoreButton color="blue" {...props}>
            {score.state === "lose" ? score.text : `${score.wrong}×`}
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
            <PlayerScoreButton color="red" compact {...props}>
              {score.correct}○
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {game.win_point! - score.wrong}×
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
            <PlayerScoreButton color="red" compact {...props}>
              ○
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
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
            <PlayerScoreButton color="red" compact {...props}>
              ○
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
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
            <PlayerScoreButton color="red" compact {...props}>
              {`${score.correct}○`}
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
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
            <PlayerScoreButton color="green" filled compact {...props}>
              {score.odd_score}
            </PlayerScoreButton>
            <span
              style={{
                color: colorMode === "light" ? theme.colors.gray[800] : "white",
              }}
            >
              ×
            </span>
            <PlayerScoreButton color="green" filled compact {...props}>
              {score.even_score}
            </PlayerScoreButton>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlayerScoreButton color="red" compact {...props}>
              ○
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
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
          <PlayerScoreButton
            disabled={score.isIncapacity}
            color="blue"
            rounded
            {...props}
          >
            {`${score.wrong}×`}
          </PlayerScoreButton>
        </>
      )}
      {game.rule === "various-fluctuations" && (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlayerScoreButton color="red" compact {...props}>
              {score.correct}○
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact rounded {...props}>
              {score.wrong}×
            </PlayerScoreButton>
          </div>
          <PlayerScoreButton
            color={score.state === "playing" ? "green" : "red"}
            disabled={score.state !== "playing"}
            {...props}
          >
            {score.state === "playing" ? (
              <>
                +
                {
                  game.players.find((gamePlayer) => gamePlayer.id === player_id)
                    ?.base_correct_point!
                }{" "}
                /{" "}
                {
                  game.players.find((gamePlayer) => gamePlayer.id === player_id)
                    ?.base_wrong_point!
                }
              </>
            ) : (
              <>{score.text}</>
            )}
          </PlayerScoreButton>
        </>
      )}
    </Box>
  );
};

export default PlayerScore;
