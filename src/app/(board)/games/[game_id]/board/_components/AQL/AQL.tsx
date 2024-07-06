"use client";

import { Box, Flex } from "@mantine/core";

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
  show_header: boolean;
};

const AQL: React.FC<Props> = ({
  game,
  scores,
  players,
  currentProfile,
  team_name,
  show_header,
}) => {
  const playerScoreList = players
    .map((player) => {
      const score = scores.find(
        (score) => score.game_id === game.id && score.player_id === player.id
      );
      return { player, score };
    })
    .filter((item) => item.score !== undefined) as {
    player: PlayerDBProps;
    score: ComputedScoreProps;
  }[];

  if (playerScoreList.length !== 10) return null;

  const leftTeamScore = playerScoreList.slice(0, 5).reduce((acc, cur) => {
    return acc * cur.score.score;
  }, 1);
  const rightTeamScore = playerScoreList.slice(5, 10).reduce((acc, cur) => {
    return acc * cur.score.score;
  }, 1);
  const leftTeamState =
    leftTeamScore >= 200
      ? "win"
      : rightTeamScore >= 200 ||
        playerScoreList.reduce((acc, cur) => {
          return cur.score.is_incapacity ? acc + 1 : acc;
        }, 0) === 5
      ? "lose"
      : "playing";
  const rightTeamState =
    rightTeamScore >= 200
      ? "win"
      : leftTeamScore >= 200 ||
        playerScoreList.reduce((acc, cur) => {
          return cur.score.is_incapacity ? acc + 1 : acc;
        }, 0) === 5
      ? "lose"
      : "playing";

  return (
    <Flex
      className={classes.aql}
      id="players-area"
      data-showq={!!game.quiz}
      data-showheader={show_header}
    >
      <Flex className={classes.team} data-state={leftTeamState}>
        <Flex className={classes.team_info}>
          <Box className={classes.team_name}>{team_name.left_team}</Box>
          <Box className={classes.team_score}>
            {leftTeamState === "win"
              ? "WIN"
              : leftTeamState === "lose"
              ? "LOSE"
              : leftTeamScore}
          </Box>
        </Flex>
        <Flex className={classes.players}>
          {playerScoreList.slice(0, 5).map((item, i) => (
            <AQLPlayer
              currentProfile={currentProfile}
              game_id={game.id}
              index={i}
              key={i}
              player={item.player}
              score={item.score}
              is_incapacity={item.score.is_incapacity}
            />
          ))}
        </Flex>
      </Flex>
      <Flex className={classes.team} data-state={rightTeamState}>
        <Flex className={classes.team_info}>
          <Box className={classes.team_name}>{team_name.right_team}</Box>
          <Box className={classes.team_score}>
            {rightTeamState === "win"
              ? "WIN"
              : rightTeamState === "lose"
              ? "LOSE"
              : rightTeamScore}
          </Box>
        </Flex>
        <Flex className={classes.players}>
          {playerScoreList.slice(5, 10).map((item, i) => (
            <AQLPlayer
              currentProfile={currentProfile}
              game_id={game.id}
              index={i}
              key={i}
              player={item.player}
              score={item.score}
              is_incapacity={item.score.is_incapacity}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default AQL;
