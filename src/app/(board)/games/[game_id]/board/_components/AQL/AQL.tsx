"use client";

import { Box, Flex } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

import AQLPlayer from "../AQLPlayer/AQLPlayer";

import classes from "./AQL.module.css";

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
  team_name: {
    left_team: string;
    right_team: string;
  };
};

const AQL: React.FC<Props> = ({
  game,
  scores,
  players,
  currentProfile,
  team_name,
}) => {
  const { width } = useViewportSize();

  const isDesktop = width > 992;
  const isVerticalView = isDesktop && players.length > 10;

  const playerScoreList = players
    .map((player) => {
      const score = scores.find(
        (score) => score.game_id === game.id && score.player_id === player.id
      );
      return { player, score };
    })
    .filter((item) => item.score !== undefined);

  if (playerScoreList.length !== 10) return null;

  const left_team_score = playerScoreList.slice(0, 5).reduce((acc, cur) => {
    return acc * cur.score.score;
  }, 1);
  const right_team_score = playerScoreList.slice(5, 10).reduce((acc, cur) => {
    return acc * cur.score.score;
  }, 1);

  return (
    <Flex className={classes.aql} id="players-area">
      <Flex className={classes.team}>
        <Flex className={classes.team_info}>
          <Box className={classes.team_name}>{team_name.left_team}</Box>
          <Box className={classes.team_score}>{left_team_score}</Box>
        </Flex>
        <Flex className={classes.players}>
          {playerScoreList.slice(0, 5).map((item, i) => (
            <AQLPlayer
              currentProfile={currentProfile}
              game_id={game.id}
              index={i}
              isVerticalView={isVerticalView}
              key={i}
              player={item.player}
              score={item.score}
            />
          ))}
        </Flex>
      </Flex>
      <Flex className={classes.team}>
        <Flex className={classes.team_info}>
          <Box className={classes.team_name}>{team_name.right_team}</Box>
          <Box className={classes.team_score}>{right_team_score}</Box>
        </Flex>
        <Flex className={classes.players}>
          {playerScoreList.slice(5, 10).map((item, i) => (
            <AQLPlayer
              currentProfile={currentProfile}
              game_id={game.id}
              index={i}
              isVerticalView={isVerticalView}
              key={i}
              player={item.player}
              score={item.score}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default AQL;
