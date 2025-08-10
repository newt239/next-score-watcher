"use client";

import { Flex } from "@mantine/core";

import OnlinePlayerScoreButton from "../OnlinePlayerScoreButton/OnlinePlayerScoreButton";

import classes from "./OnlinePlayerScore.module.css";

import type { ComputedScoreProps, LogDBProps, RuleNames } from "@/utils/types";

import { numberSign } from "@/utils/functions";

type OnlineGame = {
  id: string;
  name: string;
  ruleType: RuleNames;
};

type Props = {
  game: OnlineGame;
  player: ComputedScoreProps;
  isPending: boolean;
  onAddLog: (playerId: string, actionType: LogDBProps["variant"]) => void;
};

const OnlinePlayerScore: React.FC<Props> = ({
  game,
  player,
  isPending,
  onAddLog,
}) => {
  const props = {
    game_id: game.id,
    player_id: player.player_id,
    isPending,
    onAddLog,
  };

  return (
    <Flex className={classes.player_score}>
      {game.ruleType === "normal" && (
        <OnlinePlayerScoreButton color="red" {...props}>
          {numberSign("pt", player.score)}
        </OnlinePlayerScoreButton>
      )}
      {game.ruleType === "nomx" && (
        <>
          <OnlinePlayerScoreButton color="red" {...props}>
            {player.state === "win"
              ? player.text
              : numberSign("correct", player.correct)}
          </OnlinePlayerScoreButton>
          <OnlinePlayerScoreButton color="blue" {...props}>
            {player.state === "lose"
              ? player.text
              : numberSign("wrong", player.wrong)}
          </OnlinePlayerScoreButton>
        </>
      )}
      {game.ruleType === "ny" && (
        <>
          <OnlinePlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </OnlinePlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <OnlinePlayerScoreButton color="red" compact {...props}>
              {numberSign("correct", player.correct)}
            </OnlinePlayerScoreButton>
            <OnlinePlayerScoreButton color="blue" compact {...props}>
              {numberSign("wrong", player.wrong)}
            </OnlinePlayerScoreButton>
          </Flex>
        </>
      )}
      {game.ruleType === "nomr" && (
        <>
          <OnlinePlayerScoreButton
            color={player.is_incapacity ? "blue" : "green"}
            disabled
            {...props}
          >
            {player.text}
          </OnlinePlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <OnlinePlayerScoreButton
              color={player.is_incapacity ? "gray" : "red"}
              compact
              disabled={player.is_incapacity}
              {...props}
            >
              {numberSign("correct", player.correct)}
            </OnlinePlayerScoreButton>
            <OnlinePlayerScoreButton
              color={player.is_incapacity ? "gray" : "blue"}
              compact
              disabled={player.is_incapacity}
              {...props}
            >
              {numberSign("wrong", player.wrong)}
            </OnlinePlayerScoreButton>
          </Flex>
        </>
      )}
      {/* 他の形式は必要に応じて追加 */}
    </Flex>
  );
};

export default OnlinePlayerScore;
