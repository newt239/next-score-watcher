import { Box, theme, useColorMode, useMediaQuery } from "@chakra-ui/react";

import PlayerScoreButton from "#/blocks/PlayerScoreButton";
import { numberSign } from "#/utils/commonFunctions";
import { ComputedScoreDBProps, GameDBProps } from "#/utils/db";

type PlayerScoreProps = {
  game: GameDBProps;
  player_id: string;
  player: ComputedScoreDBProps;
  qn: number;
  isLastCorrectPlayer: boolean;
};

const PlayerScore: React.FC<PlayerScoreProps> = ({
  game,
  player_id,
  player,
  qn,
  isLastCorrectPlayer,
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
          : "0 calc(0.5rem - 2px) calc(0.5rem - 2px) 0",
      }}
    >
      {game.rule === "normal" && (
        <PlayerScoreButton color="red" {...props}>
          {player.score}
        </PlayerScoreButton>
      )}
      {game.rule === "nomx" && (
        <>
          <PlayerScoreButton color="red" {...props}>
            {player.state === "win"
              ? player.text
              : `${player.correct}${numberSign("correct")}`}
          </PlayerScoreButton>
          <PlayerScoreButton color="blue" {...props}>
            {player.state === "lose"
              ? player.text
              : `${player.wrong}${numberSign("wrong")}`}
          </PlayerScoreButton>
        </>
      )}
      {game.rule === "nomx-ad" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <PlayerScoreButton
            color="red"
            filled={isLastCorrectPlayer}
            {...props}
          >
            {`${player.correct}${numberSign("correct")}`}
          </PlayerScoreButton>
          <PlayerScoreButton color="blue" {...props}>
            {`${player.wrong}${numberSign("wrong")}`}
          </PlayerScoreButton>
        </>
      )}
      {game.rule === "nbyn" && (
        <>
          <PlayerScoreButton
            color={player.state}
            filled={player.state === "playing"}
            disabled
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlayerScoreButton color="green" compact {...props}>
              {`${player.correct}×${game.win_point! - player.wrong}`}
            </PlayerScoreButton>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlayerScoreButton color="red" compact {...props}>
              {`${player.correct}${numberSign("correct")}`}
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {`${player.wrong}${numberSign("wrong")}`}
            </PlayerScoreButton>
          </div>
        </>
      )}
      {game.rule === "nupdown" && (
        <>
          <PlayerScoreButton color={player.state} {...props}>
            {player.text}
          </PlayerScoreButton>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlayerScoreButton color="red" compact {...props}>
              ○
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {`${player.wrong}${numberSign("wrong")}`}
            </PlayerScoreButton>
          </div>
        </>
      )}
      {game.rule === "swedish10" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlayerScoreButton color="red" compact {...props}>
              ○
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {`${player.wrong}${numberSign("wrong")}`}
            </PlayerScoreButton>
          </div>
        </>
      )}
      {game.rule === "attacksurvival" && (
        <>
          <PlayerScoreButton color={player.state} {...props}>
            {player.text}
          </PlayerScoreButton>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlayerScoreButton color="red" compact {...props}>
              {`${player.correct}${numberSign("correct")}`}
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {`${player.wrong}${numberSign("wrong")}`}
            </PlayerScoreButton>
          </div>
        </>
      )}
      {game.rule === "squarex" && (
        <>
          <PlayerScoreButton color={player.state} {...props}>
            {player.text}
          </PlayerScoreButton>
          <PlayerScoreButton color="green" filled {...props}>
            {`${player.odd_score}×${player.even_score}`}
          </PlayerScoreButton>
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
            color={player.text === "LOCKED" ? "blue" : player.state}
            filled={player.text === "LOCKED"}
            disabled
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlayerScoreButton
              color="red"
              disabled={
                player.isIncapacity ||
                (qn === player.last_wrong + 1 && player.stage === 1)
              }
              {...props}
            >
              {`${player.correct}${numberSign("correct")}`}
            </PlayerScoreButton>
            <PlayerScoreButton
              color="blue"
              disabled={
                player.isIncapacity ||
                (qn === player.last_wrong + 1 && player.stage === 1)
              }
              {...props}
            >
              {`${player.wrong}${numberSign("wrong")}`}
            </PlayerScoreButton>
          </div>
        </>
      )}
      {game.rule === "freezex" && (
        <>
          <PlayerScoreButton
            color={player.isIncapacity ? "green" : "red"}
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <PlayerScoreButton
            disabled={player.isIncapacity}
            color="blue"
            {...props}
          >
            {`${player.wrong}${numberSign("wrong")}`}
          </PlayerScoreButton>
        </>
      )}
      {game.rule === "various-fluctuations" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PlayerScoreButton color="red" compact {...props}>
              {`${player.correct}${numberSign("correct")}`}
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {`${player.wrong}${numberSign("wrong")}`}
            </PlayerScoreButton>
          </div>
          <PlayerScoreButton color="green" disabled {...props}>
            {`+${game.players.find((gamePlayer) => gamePlayer.id === player_id)
              ?.base_correct_point!} / ${game.players.find(
              (gamePlayer) => gamePlayer.id === player_id
            )?.base_wrong_point!}`}
          </PlayerScoreButton>
        </>
      )}
    </Box>
  );
};

export default PlayerScore;
