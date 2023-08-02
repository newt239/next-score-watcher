import { Flex, theme, useColorMode } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import PlayerScoreButton from "#/blocks/PlayerScoreButton";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import { numberSign } from "#/utils/functions";
import { verticalViewAtom } from "#/utils/jotai";
import { ComputedScoreProps, GameDBProps } from "#/utils/types";

type PlayerScoreProps = {
  game: GameDBProps;
  player_id: string;
  player: ComputedScoreProps;
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
        gap: 1.5,
        backgroundColor:
          colorMode === "light" ? "white" : theme.colors.gray[800],
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
          <Flex h="100%" w="100%">
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
            color={player.is_incapacity ? "blue" : "green"}
            disabled
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <Flex h="100%" w="100%">
            <PlayerScoreButton
              color={player.is_incapacity ? "gray" : "red"}
              compact
              disabled={player.is_incapacity}
              {...props}
            >
              {numberSign("correct")}
            </PlayerScoreButton>
            <PlayerScoreButton
              color={player.is_incapacity ? "gray" : "blue"}
              compact
              disabled={player.is_incapacity}
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
            disabled
            filled={player.state === "playing"}
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <PlayerScoreButton color="green" disabled {...props}>
            {`${player.correct}×${game.win_point! - player.wrong}`}
          </PlayerScoreButton>
          <Flex h="100%" w="100%">
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
          <Flex h="100%" w="100%">
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
          <Flex h="100%" w="100%">
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
          <Flex h="100%" w="100%">
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
          <Flex h="100%" w="100%">
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
          <PlayerScoreButton color="green" disabled filled {...props}>
            {`${player.odd_score}×${player.even_score}`}
          </PlayerScoreButton>
          <Flex h="100%" w="100%">
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
            disabled
            filled={player.text === "LOCKED"}
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <Flex h="100%" w="100%">
            <PlayerScoreButton
              color="red"
              compact
              disabled={
                player.is_incapacity ||
                (qn === player.last_wrong + 1 && player.stage === 1)
              }
              {...props}
            >
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              color="blue"
              compact
              disabled={
                player.is_incapacity ||
                (qn === player.last_wrong + 1 && player.stage === 1)
              }
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
            color={
              player.is_incapacity || player.text.endsWith("休")
                ? "gray"
                : "red"
            }
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <PlayerScoreButton
            color="blue"
            disabled={player.is_incapacity}
            {...props}
          >
            {numberSign("wrong", player.wrong)}
          </PlayerScoreButton>
        </>
      )}
      {game.rule === "variables" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <Flex h="100%" w="100%">
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
