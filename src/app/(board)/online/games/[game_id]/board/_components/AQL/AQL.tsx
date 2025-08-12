"use client";

import { Box, Flex } from "@mantine/core";

import AQLPlayer from "../AQLPlayer/AQLPlayer";

import classes from "./AQL.module.css";

import type {
  ComputedScoreProps,
  GamePlayerProps,
  LogDBProps,
} from "@/models/games";

type AQLProps = {
  scores: ComputedScoreProps[];
  players: GamePlayerProps[];
  isPending: boolean;
  onAddLog: (playerId: string, actionType: LogDBProps["variant"]) => void;
  team_name: {
    left_team: string;
    right_team: string;
  };
  show_header: boolean;
};

const AQL: React.FC<AQLProps> = ({
  scores,
  players,
  isPending,
  onAddLog,
  team_name,
  show_header,
}) => {
  const playerScoreList = players
    .map((player) => {
      const score = scores.find((score) => score.player_id === player.id);
      return { player, score };
    })
    .filter((item) => item.score !== undefined) as {
    player: GamePlayerProps;
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
      data-showq={false}
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
              index={i}
              key={i}
              player={item.player}
              score={item.score}
              isIncapacity={item.score.is_incapacity}
              isPending={isPending}
              onAddLog={onAddLog}
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
              index={i}
              key={i}
              player={item.player}
              score={item.score}
              isIncapacity={item.score.is_incapacity}
              isPending={isPending}
              onAddLog={onAddLog}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default AQL;
