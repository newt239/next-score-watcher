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
  win_point?: number; // nbyn形式で使用
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
      {game.ruleType === "nomx-ad" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <PlayerScoreButton color="red" filled={player.stage === 2} {...props}>
            {getNumberSign("correct", player.correct)}
          </PlayerScoreButton>
          <PlayerScoreButton color="blue" {...props}>
            {getNumberSign("wrong", player.wrong)}
          </PlayerScoreButton>
        </>
      )}
      {game.ruleType === "nbyn" && (
        <>
          <PlayerScoreButton
            color={player.state}
            disabled
            filled={player.state === "playing"}
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <PlayerScoreButton color="green" disabled {...props}>
            {`${player.correct}✕${(game.win_point || 7) - player.wrong}`}
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
      {game.ruleType === "nupdown" && (
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
      {game.ruleType === "divide" && (
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
      {game.ruleType === "swedish10" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <PlayerScoreButton
              color="red"
              compact
              disabled={player.state === "lose"}
              {...props}
            >
              {getNumberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              color="blue"
              compact
              disabled={player.state === "lose"}
              {...props}
            >
              {getNumberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.ruleType === "backstream" && (
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
      {game.ruleType === "attacksurvival" && (
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
      {game.ruleType === "squarex" && (
        <>
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
          <PlayerScoreButton color="green" disabled filled {...props}>
            {`${player.odd_score}✕${player.even_score}`}
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
      {game.ruleType === "z" && (
        <>
          <PlayerScoreButton
            color={player.text === "休" ? "blue" : player.state}
            disabled
            filled={player.text === "休"}
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <Flex className={classes.player_score_pair}>
            <PlayerScoreButton
              color={player.text === "休" ? "gray" : "red"}
              compact
              disabled={player.text === "休"}
              {...props}
            >
              {getNumberSign("correct", player.correct)}
            </PlayerScoreButton>
            <PlayerScoreButton
              color={player.text === "休" ? "gray" : "blue"}
              compact
              disabled={player.text === "休"}
              {...props}
            >
              {getNumberSign("wrong", player.wrong)}
            </PlayerScoreButton>
          </Flex>
        </>
      )}
      {game.ruleType === "freezex" && (
        <>
          <PlayerScoreButton
            color={
              player.is_incapacity || player.text.endsWith("休")
                ? "gray"
                : "red"
            }
            {...props}
          >
            {player.text}
          </PlayerScoreButton>
          <PlayerScoreButton
            color="blue"
            disabled={player.is_incapacity}
            {...props}
          >
            {getNumberSign("wrong", player.wrong)}
          </PlayerScoreButton>
        </>
      )}
      {game.ruleType === "endless-chance" && (
        <>
          <PlayerScoreButton
            disabled={player.is_incapacity}
            color="red"
            {...props}
          >
            {player.state === "win"
              ? player.text
              : getNumberSign("correct", player.correct)}
          </PlayerScoreButton>
          <PlayerScoreButton
            color="blue"
            disabled={player.is_incapacity}
            {...props}
          >
            {player.state === "lose" || player.is_incapacity
              ? player.text
              : getNumberSign("wrong", player.wrong)}
          </PlayerScoreButton>
        </>
      )}
      {game.ruleType === "variables" && (
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
          <PlayerScoreButton color="green" disabled {...props}>
            {/* variables形式の場合、プレイヤー固有の設定を表示する必要がありますが、
                オンライン版では実装が複雑なため、プレースホルダーを表示 */}
            {`+1 / -1`}
          </PlayerScoreButton>
        </>
      )}
      {game.ruleType === "aql" && (
        <>
          {/* AQL形式は専用のAQLコンポーネントで処理されるため、ここでは基本的な表示のみ */}
          <PlayerScoreButton color={player.state} disabled {...props}>
            {player.text}
          </PlayerScoreButton>
        </>
      )}
    </Flex>
  );
};

export default PlayerScore;
