import { Flex, theme, useColorMode } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import PlayerScoreButton from "#/blocks/PlayerScoreButton";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import { numberSign } from "#/utils/commonFunctions";
import { ComputedScoreDBProps, GameDBProps } from "#/utils/db";
import { verticalViewAtom } from "#/utils/jotai";

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
  const isDesktop = useDeviceWidth();
  const isVerticalView =
    (useAtomValue(verticalViewAtom) && isDesktop) || !isDesktop;

  const props = {
    game_id: game.id,
    player_id: player_id,
    editable: game.editable,
  };

  return (
    <Flex
      sx={{
        w: "100%",
        flexDirection: !isVerticalView ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        py: !isVerticalView ? 3 : undefined,
        px: !isVerticalView ? undefined : "0.5rem",
        gap: 1.5,
        backgroundColor:
          colorMode === "light" ? "white" : theme.colors.gray[800],
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colorMode === "light" ? "white" : theme.colors.gray[800],
        borderRadius: !isVerticalView
          ? "0 0 calc(1rem - 6px) calc(1rem - 6px)"
          : "0 calc(0.5rem - 2px) calc(0.5rem - 2px) 0",
      }}
    >
      {game.rule === "normal" && (
        <PlayerScoreButton color="red" {...props}>
          {numberSign("pt", player.score)}
        </PlayerScoreButton>
      )}
      {game.rule === "nomx" && (
        <>
          <PlayerScoreButton color="red" {...props}>
            {player.state === "win"
              ? player.text
              : numberSign("correct", player.correct)}
          </PlayerScoreButton>
          <PlayerScoreButton color="blue" {...props}>
            {player.state === "lose"
              ? player.text
              : numberSign("wrong", player.wrong)}
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
            {numberSign("correct", player.correct)}
          </PlayerScoreButton>
          <PlayerScoreButton color="blue" {...props}>
            {numberSign("wrong", player.wrong)}
          </PlayerScoreButton>
        </>
      )}
      {game.rule === "ny" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <Flex w="100%" h="100%">
            <PlayerScoreButton color="red" compact {...props}>
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.rule === "nomr" && (
        <>
          <PlayerScoreButton
            color={player.isIncapacity ? "blue" : "green"}
            disabled
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <Flex w="100%" h="100%">
            <PlayerScoreButton
              color={player.isIncapacity ? "gray" : "red"}
              disabled={player.isIncapacity}
              compact
              {...props}
            >
              {numberSign("correct")}
            </PlayerScoreButton>
            <PlayerScoreButton
              color={player.isIncapacity ? "gray" : "blue"}
              disabled={player.isIncapacity}
              compact
              {...props}
            >
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
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
          <PlayerScoreButton color="green" {...props}>
            {`${player.correct}×${game.win_point! - player.wrong}`}
          </PlayerScoreButton>
          <Flex w="100%" h="100%">
            <PlayerScoreButton color="red" compact {...props}>
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.rule === "nupdown" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <Flex w="100%" h="100%">
            <PlayerScoreButton color="red" compact {...props}>
              ○
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.rule === "swedish10" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <Flex w="100%" h="100%">
            <PlayerScoreButton color="red" compact {...props}>
              ○
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.rule === "backstream" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <Flex w="100%" h="100%">
            <PlayerScoreButton color="red" compact {...props}>
              ○
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.rule === "attacksurvival" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <Flex w="100%" h="100%">
            <PlayerScoreButton color="red" compact {...props}>
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.rule === "squarex" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <PlayerScoreButton color="green" filled disabled {...props}>
            {`${player.odd_score}×${player.even_score}`}
          </PlayerScoreButton>
          <Flex w="100%" h="100%">
            <PlayerScoreButton color="red" compact {...props}>
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
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
          <Flex w="100%" h="100%">
            <PlayerScoreButton
              color="red"
              disabled={
                player.isIncapacity ||
                (qn === player.last_wrong + 1 && player.stage === 1)
              }
              compact
              {...props}
            >
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              color="blue"
              disabled={
                player.isIncapacity ||
                (qn === player.last_wrong + 1 && player.stage === 1)
              }
              compact
              {...props}
            >
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
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
            {numberSign("wrong", player.wrong)}
          </PlayerScoreButton>
        </>
      )}
      {game.rule === "various-fluctuations" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <Flex w="100%" h="100%">
            <PlayerScoreButton color="red" compact {...props}>
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
          <PlayerScoreButton color="green" disabled {...props}>
            {`+${game.players.find((gamePlayer) => gamePlayer.id === player_id)
              ?.base_correct_point!} / ${game.players.find(
              (gamePlayer) => gamePlayer.id === player_id
            )?.base_wrong_point!}`}
          </PlayerScoreButton>
        </>
      )}
    </Flex>
  );
};

export default PlayerScore;
