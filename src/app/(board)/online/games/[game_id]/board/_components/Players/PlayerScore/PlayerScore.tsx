"use client";

import { Flex } from "@mantine/core";

import PlayerScoreButton from "../PlayerScoreButton/PlayerScoreButton";

import classes from "./PlayerScore.module.css";

import type { UserPreferencesType } from "@/models/user-preferences";
import type { ComputedScoreProps, LogDBProps, RuleNames } from "@/utils/types";

import { numberSign as _numberSign } from "@/utils/functions";

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
  preferences: UserPreferencesType | null;
};

const PlayerScore: React.FC<Props> = ({
  game,
  player,
  isPending,
  onAddLog,
  preferences,
}) => {
  const props = {
    game_id: game.id,
    player_id: player.player_id,
    isPending,
    onAddLog,
  };

  // 設定に基づいてnumberSignを実行するヘルパー関数
  const getNumberSign = (type: "correct" | "wrong" | "pt", score?: number) => {
    const showSignString = preferences?.showSignString ?? true;
    const wrongNumber = preferences?.wrongNumber ?? true;

    if (typeof score === "undefined") {
      switch (type) {
        case "correct":
          return "○";
        case "wrong":
          return "✕";
        case "pt":
          return "pt";
        default:
          return "";
      }
    }

    switch (type) {
      case "correct":
        return showSignString ? `○${score}` : `${score}`;
      case "wrong":
        if (wrongNumber && score <= 4) {
          return score === 0 ? "・" : "✕".repeat(score);
        }
        return showSignString ? `✕${score}` : `${score}`;
      case "pt":
        return showSignString ? `${score}pt` : `${score}`;
      default:
        return `${score}`;
    }
  };

  return (
    <Flex className={classes.player_score}>
      {game.ruleType === "normal" && (
        <PlayerScoreButton color="red" {...props}>
          {getNumberSign("pt", player.score)}
        </PlayerScoreButton>
      )}
      {game.ruleType === "nomx" && (
        <>
          <PlayerScoreButton color="red" {...props}>
            {player.state === "win"
              ? player.text
              : getNumberSign("correct", player.correct)}
          </PlayerScoreButton>
          <PlayerScoreButton color="blue" {...props}>
            {player.state === "lose"
              ? player.text
              : getNumberSign("wrong", player.wrong)}
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
              {getNumberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton color="blue" compact {...props}>
              {getNumberSign("wrong", player.wrong)}
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
              {getNumberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              color={player.is_incapacity ? "gray" : "blue"}
              compact
              disabled={player.is_incapacity}
              {...props}
            >
              {getNumberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {/* 他の形式は必要に応じて追加 */}
    </Flex>
  );
};

export default PlayerScore;
