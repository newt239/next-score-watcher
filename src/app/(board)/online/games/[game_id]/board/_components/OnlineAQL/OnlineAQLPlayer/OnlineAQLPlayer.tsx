"use client";

import { Flex, useComputedColorScheme } from "@mantine/core";

import OnlinePlayerScoreButton from "../../OnlinePlayers/OnlinePlayerScoreButton/OnlinePlayerScoreButton";

import classes from "./OnlineAQLPlayer.module.css";

import type {
  ComputedScoreProps,
  GameDBPlayerProps,
  LogDBProps,
  RuleNames,
  States,
} from "@/utils/types";

import PlayerHeader from "@/app/(board)/games/[game_id]/board/_components/PlayerHeader/PlayerHeader";
import PlayerName from "@/app/(board)/games/[game_id]/board/_components/PlayerName/PlayerName";
import { numberSign } from "@/utils/functions";

type OnlineGame = {
  id: string;
  name: string;
  ruleType: RuleNames;
};

type Props = {
  game: OnlineGame;
  player: GameDBPlayerProps;
  index: number;
  score: ComputedScoreProps | undefined;
  is_incapacity: boolean;
  isPending: boolean;
  onAddLog: (playerId: string, actionType: LogDBProps["variant"]) => void;
};

const OnlineAQLPlayer: React.FC<Props> = ({
  game,
  player,
  index,
  score,
  is_incapacity,
  isPending,
  onAddLog,
}) => {
  const computedColorScheme = useComputedColorScheme("light");

  if (!score) return null;

  const getColor = (state: States) => {
    return state === "win"
      ? computedColorScheme === "light"
        ? "red.9"
        : "red.3"
      : state == "lose"
        ? computedColorScheme === "light"
          ? "blue.9"
          : "blue.3"
        : undefined;
  };

  return (
    <Flex
      className={classes.player}
      bg={
        getColor(score.state) ||
        (computedColorScheme === "light" ? "gray.1" : "gray.9")
      }
      c={
        getColor(score.state) &&
        (computedColorScheme === "light" ? "white" : "gray.9")
      }
      w={{
        base: "100%",
        md: `clamp(8vw, ${
          (98 - 10) / 10 // AQLは10プレイヤー固定
        }vw, 15vw)`,
      }}
      style={{
        borderColor: `var(--mantine-color-${(
          getColor(score.state) ||
          getColor(score.reach_state) ||
          (computedColorScheme === "dark" ? "gray.7" : "gray.1")
        ).replace(".", "-")})`,
      }}
    >
      <Flex className={classes.player_info}>
        <PlayerHeader
          belong={
            (player as GameDBPlayerProps & { belong?: string }).belong || ""
          }
          index={index}
          isVerticalView={true}
          text={(player as GameDBPlayerProps & { text?: string }).text || ""}
        />
        <PlayerName player_name={player.name} isAQL rows={3} />
      </Flex>
      <Flex className={classes.player_score}>
        <OnlinePlayerScoreButton
          color={is_incapacity ? "black" : "green"}
          game_id={game.id}
          player_id={player.id}
          isPending={isPending}
          onAddLog={onAddLog}
          disabled={is_incapacity}
        >
          {numberSign("pt", score.score)}
        </OnlinePlayerScoreButton>
        <Flex className={classes.player_score_pair}>
          <OnlinePlayerScoreButton
            color={is_incapacity ? "black" : "red"}
            game_id={game.id}
            player_id={player.id}
            isPending={isPending}
            onAddLog={onAddLog}
            disabled={is_incapacity}
            compact={true}
          >
            {numberSign("correct", score.correct)}
          </OnlinePlayerScoreButton>
          <OnlinePlayerScoreButton
            color={is_incapacity ? "black" : "blue"}
            game_id={game.id}
            player_id={player.id}
            isPending={isPending}
            onAddLog={onAddLog}
            disabled={is_incapacity}
            compact={true}
          >
            {numberSign("wrong", score.wrong)}
          </OnlinePlayerScoreButton>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default OnlineAQLPlayer;
