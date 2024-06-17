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
};

const Players: React.FC<Props> = ({ game, scores, players }) => {
  return (
    <Flex className={classes.players} id="players-area">
      {players.map((player, i) => (
        <Player
          game_id={game.id}
          index={i}
          isVerticalView={players.length > 10}
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
