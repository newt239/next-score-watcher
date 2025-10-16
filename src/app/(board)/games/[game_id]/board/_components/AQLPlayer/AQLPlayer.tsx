"use client";

import { useEffect, useState } from "react";

import { Flex, useComputedColorScheme } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";

import PlayerHeader from "../PlayerHeader/PlayerHeader";
import PlayerName from "../PlayerName/PlayerName";
import PlayerScoreButton from "../PlayerScoreButton/PlayerScoreButton";

import classes from "./AQLPlayer.module.css";

import type { ComputedScoreProps, PlayerDBProps, States } from "@/utils/types";

import db from "@/utils/db";
import { numberSign } from "@/utils/functions";

type Props = {
  game_id: string;
  player: PlayerDBProps;
  index: number;
  score: ComputedScoreProps | undefined;
  is_incapacity: boolean;
  currentProfile: string;
};

const AQLPlayer: React.FC<Props> = ({
  game_id,
  player,
  index,
  score,
  is_incapacity,
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
      bg={
        getColor(editedScore.state) ||
        (computedColorScheme === "light" ? "gray.1" : "gray.9")
      }
      c={
        getColor(editedScore.state) &&
        (computedColorScheme === "light" ? "white" : "gray.9")
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
      <Flex className={classes.player_info}>
        <PlayerHeader
          belong={player.belong}
          index={index}
          isVerticalView={true}
          text={player.text}
        />
        <PlayerName player_name={player.name} isAQL rows={3} />
      </Flex>
      <Flex className={classes.player_score}>
        <PlayerScoreButton
          currentProfile={currentProfile}
          color={is_incapacity ? "black" : "green"}
          game_id={game_id}
          player_id={player.id}
          editable={false}
          disabled={is_incapacity}
        >
          {numberSign("pt", score.score)}
        </PlayerScoreButton>
        <Flex className={classes.player_score_pair}>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color={is_incapacity ? "black" : "red"}
            game_id={game_id}
            player_id={player.id}
            editable={false}
            disabled={is_incapacity}
            compact={true}
          >
            {numberSign("correct", score.correct)}
          </PlayerScoreButton>
          <PlayerScoreButton
            currentProfile={currentProfile}
            color={is_incapacity ? "black" : "blue"}
            game_id={game_id}
            player_id={player.id}
            editable={false}
            disabled={is_incapacity}
            compact={true}
          >
            {numberSign("wrong", score.wrong)}
          </PlayerScoreButton>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AQLPlayer;
