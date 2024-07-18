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
  show_header: boolean;
};

const Players: React.FC<Props> = ({
  game,
  scores,
  players,
  currentProfile,
  show_header,
}) => {
  return (
    <Flex
      className={classes.players}
      id="players-area"
      data-showq={!!game.quiz}
      data-showheader={show_header}
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
