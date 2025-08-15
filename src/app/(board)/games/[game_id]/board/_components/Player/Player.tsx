"use client";

import { useEffect, useState } from "react";

import { Flex, useComputedColorScheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useLiveQuery } from "dexie-react-hooks";

import PlayerColorConfig from "../PlayerColorConfig";
import PlayerHeader from "../PlayerHeader/PlayerHeader";
import PlayerName from "../PlayerName/PlayerName";
import PlayerScore from "../PlayerScore/PlayerScore";

import classes from "./Player.module.css";

import type { ComputedScoreProps, PlayerDBProps, States } from "@/utils/types";

import db from "@/utils/db";
import { rules } from "@/utils/rules";

type Props = {
  game_id: string;
  player: PlayerDBProps;
  index: number;
  score: ComputedScoreProps | undefined;
  currentProfile: string;
};

const Player: React.FC<Props> = ({
  game_id,
  player,
  index,
  score,
  currentProfile,
}) => {
  const computedColorScheme = useComputedColorScheme("light");
  const game = useLiveQuery(() =>
    db(currentProfile).games.get(game_id as string)
  );
  const [editableState, setEditableState] = useState<States>("playing");

  const [reversePlayerInfo] = useLocalStorage({
    key: "reversePlayerInfo",
    defaultValue: false,
  });

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
      data-testid="player"
      className={classes.player}
      bg={getColor(editedScore.state)}
      c={
        getColor(editedScore.state) &&
        (computedColorScheme === "light" ? "white" : "black")
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
          (computedColorScheme === "dark" ? "gray.8" : "gray.1")
        ).replace(".", "-")})`,
      }}
      data-reverse={reversePlayerInfo}
    >
      <Flex className={classes.player_info} data-rows={rows}>
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
            isVerticalView={true}
            text={player.text}
          />
        )}
        <PlayerName player_name={player.name} rows={rows} />
      </Flex>
      <PlayerScore
        game={game}
        player={editedScore}
        currentProfile={currentProfile}
      />
    </Flex>
  );
};

export default Player;
