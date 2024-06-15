"use client";

import { useEffect, useState } from "react";

import { Flex, useComputedColorScheme } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";

import PlayerColorConfig from "../PlayerColorConfig";
import PlayerHeader from "../PlayerHeader/PlayerHeader";
import PlayerName from "../PlayerName/PlayerName";
import PlayerScore from "../PlayerScore/PlayerScore";

import classes from "./Player.module.css";

import db from "@/utils/db";
import { isDesktop } from "@/utils/functions";
import { rules } from "@/utils/rules";
import { ComputedScoreProps, PlayerDBProps, States } from "@/utils/types";

type Props = {
  game_id: string;
  player: PlayerDBProps;
  index: number;
  score: ComputedScoreProps | undefined;
  isVerticalView: boolean;
};

const Player: React.FC<Props> = ({
  game_id,
  player,
  index,
  score,
  isVerticalView,
}) => {
  const computedColorScheme = useComputedColorScheme("light");
  const game = useLiveQuery(() => db().games.get(game_id as string));
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
      bg={getColor(editedScore.state)}
      c={
        getColor(editedScore.state) &&
        (computedColorScheme === "light" ? "white" : "gray.8")
      }
      style={{
        width: `clamp(8vw, ${
          (98 - game.players.length) / game.players.length
        }vw, 15vw)`,
        borderColor: `var(--mantine-color-${(
          getColor(editedScore.state) ||
          getColor(editedScore.reach_state) ||
          (computedColorScheme === "dark" ? "gray.7" : "gray.1")
        ).replace(".", "-")})`,
      }}
    >
      <Flex
        className={classes.player_info}
        style={{
          width: isDesktop() ? (isVerticalView ? "40vw" : "100%") : "100%",
          height:
            isDesktop() && !isVerticalView
              ? `calc(80vh - ${rows * 4}rem)`
              : "100%",
          alignItems: !isVerticalView && isDesktop() ? "center" : "flex-start",
        }}
      >
        {game.editable ? (
          <PlayerColorConfig
            colorState={getColor(editedScore.state)}
            editableState={editableState}
            setEditableState={setEditableState}
          />
        ) : (
          <PlayerHeader
            belong={player.belong}
            index={index}
            isVerticalView={(isVerticalView && isDesktop()) || !isDesktop()}
            text={player.text}
          />
        )}
        <PlayerName player_name={player.name} />
      </Flex>
      <PlayerScore game={game} player={editedScore} />
    </Flex>
  );
};

export default Player;