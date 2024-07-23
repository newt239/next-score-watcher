"use client";

import { Flex } from "@mantine/core";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { nanoid } from "nanoid";

import PlayerScoreButton from "../PlayerScoreButton/PlayerScoreButton";

import classes from "./PlayerScore.module.css";

import db from "@/utils/db";
import { numberSign } from "@/utils/functions";
import { ComputedScoreProps, GamePropsUnion } from "@/utils/types";

type Props = {
  game: GamePropsUnion;
  player: ComputedScoreProps;
  currentProfile: string;
};

const PlayerScore: React.FC<Props> = ({ game, player, currentProfile }) => {
  const logs = useLiveQuery(
    () =>
      db(currentProfile).logs.where({ game_id: game.id }).sortBy("timestamp"),
    []
  );

  const props = {
    game_id: game.id,
    player_id: player.player_id,
    editable: game.editable,
  };

  if (logs === undefined) return null;

  return (
    <Flex className={classes.player_score}>
      {game.rule === "normal" && (
        <PlayerScoreButton
          currentProfile={currentProfile}
          color="red"
          {...props}
        >
          {numberSign("pt", player.score)}
        </PlayerScoreButton>
      )}
      {game.rule === "nomx" && (
        <>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color="red"
            {...props}
          >
            {player.state === "win"
              ? player.text
              : numberSign("correct", player.correct)}
          </PlayerScoreButton>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color="blue"
            {...props}
          >
            {player.state === "lose"
              ? player.text
              : numberSign("wrong", player.wrong)}
          </PlayerScoreButton>
        </>
      )}
      {game.rule === "nomx-ad" && (
        <>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color={player.state}
            disabled
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color="red"
            filled={player.stage === 2}
            {...props}
          >
            {numberSign("correct", player.correct)}
          </PlayerScoreButton>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color="blue"
            {...props}
          >
            {numberSign("wrong", player.wrong)}
          </PlayerScoreButton>
        </>
      )}
      {game.rule === "ny" && (
        <>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color={player.state}
            disabled
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="red"
              compact
              {...props}
            >
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="blue"
              compact
              {...props}
            >
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.rule === "nomr" && (
        <>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color={player.is_incapacity ? "blue" : "green"}
            disabled
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color={player.is_incapacity ? "gray" : "red"}
              compact
              disabled={player.is_incapacity}
              {...props}
            >
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              currentProfile={currentProfile}
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
            currentProfile={currentProfile}
            color={player.state}
            disabled
            filled={player.state === "playing"}
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color="green"
            disabled
            {...props}
          >
            {`${player.correct}✕${game.win_point! - player.wrong}`}
          </PlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="red"
              compact
              {...props}
            >
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="blue"
              compact
              {...props}
            >
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.rule === "nupdown" && (
        <>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color={player.state}
            disabled
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="red"
              compact
              {...props}
            >
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="blue"
              compact
              {...props}
            >
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.rule === "divide" && (
        <>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color={player.state}
            disabled
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="red"
              compact
              {...props}
            >
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="blue"
              compact
              {...props}
            >
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.rule === "swedish10" && (
        <>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color={player.state}
            disabled
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="red"
              compact
              disabled={player.state === "lose"}
              {...props}
            >
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              currentProfile={currentProfile}
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
          <PlayerScoreButton
            currentProfile={currentProfile}
            color={player.state}
            disabled
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="red"
              compact
              {...props}
            >
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="blue"
              compact
              {...props}
            >
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.rule === "attacksurvival" && (
        <>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color={player.state}
            disabled
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="red"
              compact
              {...props}
            >
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="blue"
              compact
              {...props}
            >
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.rule === "squarex" && (
        <>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color={player.state}
            disabled
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color="green"
            disabled
            filled
            {...props}
          >
            {`${player.odd_score}✕${player.even_score}`}
          </PlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="red"
              compact
              {...props}
            >
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="blue"
              compact
              {...props}
            >
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.rule === "z" && (
        <>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color={player.text === "休" ? "blue" : player.state}
            disabled
            filled={player.text === "休"}
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color={player.text === "休" ? "gray" : "red"}
              compact
              disabled={player.text === "休"}
              {...props}
            >
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              currentProfile={currentProfile}
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
            currentProfile={currentProfile}
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
            currentProfile={currentProfile}
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
            currentProfile={currentProfile}
            disabled={player.is_incapacity}
            color="red"
            {...props}
          >
            {player.state === "win"
              ? player.text
              : numberSign("correct", player.correct)}
          </PlayerScoreButton>
          <PlayerScoreButton
            currentProfile={currentProfile}
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
                      await db(currentProfile).logs.update(last_log.id, {
                        available: 0,
                      });
                    } else {
                      await db(currentProfile).logs.update(last_log.id, {
                        timestamp: cdate().text(),
                        player_id: new_player_id,
                      });
                    }
                  } else {
                    await db(currentProfile).logs.update(last_log.id, {
                      timestamp: cdate().text(),
                      player_id: `${last_log.player_id},${player.player_id}`,
                    });
                  }
                } else {
                  await db(currentProfile).logs.put({
                    id: nanoid(),
                    game_id: game.id,
                    player_id: player.player_id,
                    variant: "multiple_wrong",
                    system: 0,
                    timestamp: cdate().text(),
                    available: 1,
                  });
                }
              } else {
                await db(currentProfile).logs.put({
                  id: nanoid(),
                  game_id: game.id,
                  player_id: player.player_id,
                  variant: "multiple_wrong",
                  system: 0,
                  timestamp: cdate().text(),
                  available: 1,
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
          <PlayerScoreButton
            currentProfile={currentProfile}
            color={player.state}
            disabled
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="red"
              compact
              {...props}
            >
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              currentProfile={currentProfile}
              color="blue"
              compact
              {...props}
            >
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color="green"
            disabled
            {...props}
          >
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
