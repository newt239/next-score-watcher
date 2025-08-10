"use client";

import { Flex } from "@mantine/core";

import PlayerScoreButton from "../PlayerScoreButton/PlayerScoreButton";

import classes from "./PlayerScore.module.css";

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

const PlayerScore: React.FC<Props> = ({
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
        <PlayerScoreButton color="red" {...props}>
          {numberSign("pt", player.score)}
        </PlayerScoreButton>
      )}
      {game.ruleType === "nomx" && (
        <>
          <PlayerScoreButton color="red" {...props}>
            {player.state === "win"
              ? player.text
              : numberSign("correct", player.correct)}
          </PlayerScoreButton>
          <PlayerScoreButton color="blue" {...props}>
            {player.state === "lose"
              ? player.text
              : numberSign("wrong", player.wrong)}
          </PlayerScoreButton>
        </>
      )}
      {game.ruleType === "ny" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <PlayerScoreButton color="red" compact {...props}>
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.ruleType === "nomr" && (
        <>
          <PlayerScoreButton
            color={player.is_incapacity ? "blue" : "green"}
            disabled
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <PlayerScoreButton
              color={player.is_incapacity ? "gray" : "red"}
              compact
              disabled={player.is_incapacity}
              {...props}
            >
              {numberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              color={player.is_incapacity ? "gray" : "blue"}
              compact
              disabled={player.is_incapacity}
              {...props}
            >
              {numberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {/* 他の形式は必要に応じて追加 */}
    </Flex>
  );
};

export default PlayerScore;
