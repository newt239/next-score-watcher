"use client";

import { Flex } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { nanoid } from "nanoid";

import PlayerScoreButton from "./PlayerScoreButton";

import db from "@/utils/db";
import { isDesktop, numberSign } from "@/utils/functions";
import { ComputedScoreProps, GamePropsUnion } from "@/utils/types";

type Props = {
  game: GamePropsUnion;
  player: ComputedScoreProps;
  isVerticalView: boolean;
};

const PlayerScore: React.FC<Props> = ({ game, player, isVerticalView }) => {
  const colorMode = useColorScheme();
  const logs = useLiveQuery(
    () => db().logs.where({ game_id: game.id }).sortBy("timestamp"),
    []
  );

  const props = {
    game_id: game.id,
    player_id: player.player_id,
    editable: game.editable,
  };

  if (logs === undefined) return null;

  return (
    <Flex
      className="w-auto lg:w-full"
      style={{
        flexDirection: !isVerticalView ? "column" : "row",
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: colorMode === "light" ? "white" : "gray.800",
        paddingRight: !isVerticalView && isDesktop() ? undefined : "0.5rem",
        gap: "0.5rem 0",
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
          <PlayerScoreButton color="red" filled={player.stage === 2} {...props}>
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
          <Flex style={{ w: isDesktop() ? "100%" : undefined }}>
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
          <Flex style={{ w: isDesktop() ? "100%" : undefined }}>
            <PlayerScoreButton
              color={player.is_incapacity ? "gray" : "red"}
              compact
              disabled={player.is_incapacity}
              {...props}
            >
              {numberSign("correct", player.correct)}
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
            {`${player.correct}✕${game.win_point! - player.wrong}`}
          </PlayerScoreButton>
          <Flex style={{ w: isDesktop() ? "100%" : undefined }}>
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
          <Flex style={{ w: isDesktop() ? "100%" : undefined }}>
            <PlayerScoreButton color="red" compact {...props}>
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.rule === "divide" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <Flex style={{ w: isDesktop() ? "100%" : undefined }}>
            <PlayerScoreButton color="red" compact {...props}>
              {numberSign("correct", player.correct)}
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
          <Flex style={{ w: isDesktop() ? "100%" : undefined }}>
            <PlayerScoreButton
              color="red"
              compact
              disabled={player.state === "lose"}
              {...props}
            >
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              color="blue"
              compact
              disabled={player.state === "lose"}
              {...props}
            >
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
          <Flex style={{ w: isDesktop() ? "100%" : undefined }}>
            <PlayerScoreButton color="red" compact {...props}>
              {numberSign("correct", player.correct)}
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
          <Flex style={{ w: isDesktop() ? "100%" : undefined }}>
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
            {`${player.odd_score}✕${player.even_score}`}
          </PlayerScoreButton>
          <Flex style={{ w: isDesktop() ? "100%" : undefined }}>
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
            color={player.text === "休" ? "blue" : player.state}
            disabled
            filled={player.text === "休"}
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <Flex style={{ w: isDesktop() ? "100%" : undefined }}>
            <PlayerScoreButton
              color={player.text === "休" ? "gray" : "red"}
              compact
              disabled={player.text === "休"}
              {...props}
            >
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              color={player.text === "休" ? "gray" : "blue"}
              compact
              disabled={player.text === "休"}
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
      {game.rule === "endless-chance" && (
        <>
          <PlayerScoreButton
            disabled={player.is_incapacity}
            color="red"
            {...props}
          >
            {player.state === "win"
              ? player.text
              : numberSign("correct", player.correct)}
          </PlayerScoreButton>
          <PlayerScoreButton
            color="blue"
            disabled={player.is_incapacity}
            onClick={async () => {
              if (logs.length > 0) {
                const last_log = logs[logs.length - 1];
                if (last_log.variant === "multiple_wrong") {
                  if (last_log.player_id.includes(player.player_id)) {
                    const new_player_id = last_log.player_id
                      .replace(`,${player.player_id}`, "")
                      .replace(player.player_id, "");
                    if (new_player_id === "") {
                      await db().logs.delete(last_log.id);
                    } else {
                      await db().logs.update(last_log.id, {
                        timestamp: cdate().text(),
                        player_id: new_player_id,
                      });
                    }
                  } else {
                    await db().logs.update(last_log.id, {
                      timestamp: cdate().text(),
                      player_id: `${last_log.player_id},${player.player_id}`,
                    });
                  }
                } else {
                  await db().logs.put({
                    id: nanoid(),
                    game_id: game.id,
                    player_id: player.player_id,
                    variant: "multiple_wrong",
                    system: false,
                    timestamp: cdate().text(),
                  });
                }
              } else {
                await db().logs.put({
                  id: nanoid(),
                  game_id: game.id,
                  player_id: player.player_id,
                  variant: "multiple_wrong",
                  system: false,
                  timestamp: cdate().text(),
                });
              }
            }}
            {...props}
          >
            {player.state === "lose" || player.is_incapacity
              ? player.text
              : numberSign("wrong", player.wrong)}
          </PlayerScoreButton>
        </>
      )}
      {game.rule === "variables" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <Flex style={{ w: isDesktop() ? "100%" : undefined }}>
            <PlayerScoreButton color="red" compact {...props}>
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
          <PlayerScoreButton color="green" disabled {...props}>
            {`+${game.players.find(
              (gamePlayer) => gamePlayer.id === player.player_id
            )?.base_correct_point!} / ${game.players.find(
              (gamePlayer) => gamePlayer.id === player.player_id
            )?.base_wrong_point!}`}
          </PlayerScoreButton>
        </>
      )}
    </Flex>
  );
};

export default PlayerScore;
