"use client";

import { useEffect, useState } from "react";

import { Flex, useComputedColorScheme } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";

import PlayerHeader from "../PlayerHeader/PlayerHeader";
import PlayerName from "../PlayerName/PlayerName";
import PlayerScoreButton from "../PlayerScoreButton/PlayerScoreButton";

import classes from "./AQLPlayer.module.css";

import db from "@/utils/db";
import { numberSign } from "@/utils/functions";
import { rules } from "@/utils/rules";
import { ComputedScoreProps, PlayerDBProps, States } from "@/utils/types";

type Props = {
  game_id: string;
  player: PlayerDBProps;
  index: number;
  score: ComputedScoreProps | undefined;
  isVerticalView: boolean;
  currentProfile: string;
};

const AQLPlayer: React.FC<Props> = ({
  game_id,
  player,
  index,
  score,
  isVerticalView,
  currentProfile,
}) => {
  const computedColorScheme = useComputedColorScheme("light");
  const game = useLiveQuery(() =>
    db(currentProfile).games.get(game_id as string)
  );
  const [editableState, setEditableState] = useState<States>("playing");

  useEffect(() => {
    if (score) {
      setEditableState(score.state || "playing");
    }
  }, [score]);

  if (!game || !score) return null;

  const rows = rules[game.rule].rows;

  const editedScore: ComputedScoreProps = {
    ...score,
    state: game.editable ? editableState : score.state,
  };

  const getColor = (state: States) => {
    return state === "win"
      ? computedColorScheme === "light"
        ? "red.9"
        : "red.3"
      : state == "lose"
      ? computedColorScheme === "light"
        ? "blue.9"
        : "blue.3"
      : undefined;
  };

  return (
    <Flex
      className={classes.player}
      data-vertical={isVerticalView}
      bg={
        getColor(editedScore.state) || computedColorScheme === "light"
          ? "gray.1"
          : "gray.8"
      }
      c={
        getColor(editedScore.state) &&
        (computedColorScheme === "light" ? "white" : "gray.8")
      }
      w={{
        base: "100%",
        md: `clamp(8vw, ${
          (98 - game.players.length) / game.players.length
        }vw, 15vw)`,
      }}
      style={{
        borderColor: `var(--mantine-color-${(
          getColor(editedScore.state) ||
          getColor(editedScore.reach_state) ||
          (computedColorScheme === "dark" ? "gray.7" : "gray.1")
        ).replace(".", "-")})`,
      }}
    >
      <Flex
        className={classes.player_info}
        data-vertical={isVerticalView}
        data-rows={rows}
      >
        <PlayerHeader
          belong={player.belong}
          index={index}
          isVerticalView={true}
          text={player.text}
        />
        <PlayerName player_name={player.name} />
      </Flex>
      <PlayerScoreButton
        currentProfile={currentProfile}
        color="red"
        game_id={game_id}
        player_id={player.id}
        editable={false}
      >
        {score.state === "win"
          ? score.text
          : numberSign("correct", score.correct)}
      </PlayerScoreButton>
      <PlayerScoreButton
        currentProfile={currentProfile}
        color="blue"
        game_id={game_id}
        player_id={player.id}
        editable={false}
      >
        {score.state === "lose" ? score.text : numberSign("wrong", score.wrong)}
      </PlayerScoreButton>
    </Flex>
  );
};

export default AQLPlayer;
