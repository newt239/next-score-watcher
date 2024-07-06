"use client";

import { Flex } from "@mantine/core";

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
  return (
    <Flex
      className={classes.players}
      id="players-area"
      data-showq={!!game.quiz}
    >
      {players.map((player, i) => (
        <Player
          currentProfile={currentProfile}
          game_id={game.id}
          index={i}
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
