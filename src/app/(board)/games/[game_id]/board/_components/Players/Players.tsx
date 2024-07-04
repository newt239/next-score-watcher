"use client";

import { Flex } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

import Player from "../Player/Player";

import classes from "./Players.module.css";

import {
  ComputedScoreProps,
  GamePropsUnion,
  PlayerDBProps,
} from "@/utils/types";

type Props = {
  game: GamePropsUnion;
  scores: ComputedScoreProps[];
  players: PlayerDBProps[];
  currentProfile: string;
};

const Players: React.FC<Props> = ({
  game,
  scores,
  players,
  currentProfile,
}) => {
  const { width } = useViewportSize();

  const isDesktop = width > 992;
  const isVerticalView = isDesktop && players.length > 10;

  return (
    <Flex className={classes.players} id="players-area">
      {players.map((player, i) => (
        <Player
          currentProfile={currentProfile}
          game_id={game.id}
          index={i}
          isVerticalView={isVerticalView}
          key={i}
          player={player}
          score={scores.find(
            (score) =>
              score.game_id === game.id && score.player_id === player.id
          )}
        />
      ))}
    </Flex>
  );
};
export default Players;
