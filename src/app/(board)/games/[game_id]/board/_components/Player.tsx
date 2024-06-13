"use client";

import { useEffect, useState } from "react";

import { Flex } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useLiveQuery } from "dexie-react-hooks";

import PlayerColorConfig from "./PlayerColorConfig";
import PlayerHeader from "./PlayerHeader";
import PlayerName from "./PlayerName";
import PlayerScore from "./PlayerScore";

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
        ? "red.600"
        : "red.300"
      : state == "lose"
      ? colorMode === "light"
        ? "blue.600"
        : "blue.300"
      : undefined;
  };

  return (
    <Flex
      className="items-stretch justify-between overflow-y-hidden overflow-x-scroll rounded-2xl border-4 border-solid transition-all"
      style={{
        flexDirection: "column",
        height: "80vh",
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
        style={{
          flexGrow: 1,
          width: isDesktop() ? (isVerticalView ? "40vw" : "100%") : "100%",
          height:
            isDesktop() && !isVerticalView
              ? `calc(80vh - ${rows * 4}rem)`
              : "100%",
          flexDirection: "column",
          alignItems: !isVerticalView && isDesktop() ? "center" : "flex-start",
          paddingLeft: !isVerticalView && isDesktop() ? undefined : "0.5rem",
          overflowX: "hidden",
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
