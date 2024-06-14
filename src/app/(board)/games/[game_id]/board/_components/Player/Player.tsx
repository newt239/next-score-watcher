"use client";

import { useEffect, useState } from "react";

import { Flex } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useLiveQuery } from "dexie-react-hooks";

import PlayerColorConfig from "../PlayerColorConfig";
import PlayerHeader from "../PlayerHeader/PlayerHeader";
import PlayerName from "../PlayerName";
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
  const colorMode = useColorScheme();
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
      ? colorMode === "light"
        ? "red.6"
        : "red.3"
      : state == "lose"
      ? colorMode === "light"
        ? "blue.6"
        : "blue.3"
      : undefined;
  };

  return (
    <Flex
      className={classes.player}
      style={{
        width: `clamp(8vw, ${
          (98 - game.players.length) / game.players.length
        }vw, 15vw)`,
        backgroundColor: getColor(editedScore.state),
        color:
          getColor(editedScore.state) &&
          (colorMode === "light" ? "white" : "gray.800"),
        borderColor:
          getColor(editedScore.state) ||
          getColor(editedScore.reach_state) ||
          (colorMode === "dark" ? "gray.700" : "gray.100"),
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
          paddingLeft: !isVerticalView && isDesktop() ? undefined : "0.5rem",
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
        <PlayerName
          isVerticalView={isVerticalView}
          player_name={player.name}
          rows={rows}
        />
      </Flex>
      <PlayerScore
        game={game}
        isVerticalView={(isVerticalView && isDesktop()) || !isDesktop()}
        player={editedScore}
      />
    </Flex>
  );
};

export default Player;
