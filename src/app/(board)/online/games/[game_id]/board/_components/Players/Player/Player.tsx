"use client";

import { Flex, useComputedColorScheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

import PlayerScore from "../PlayerScore/PlayerScore";

import classes from "./Player.module.css";

import type {
  ComputedScoreProps,
  GameDBPlayerProps,
  LogDBProps,
  RuleNames,
  States,
} from "@/utils/types";

import PlayerHeader from "@/app/(board)/games/[game_id]/board/_components/PlayerHeader/PlayerHeader";
import PlayerName from "@/app/(board)/games/[game_id]/board/_components/PlayerName/PlayerName";
import { rules } from "@/utils/rules";

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
  isPending: boolean;
  onAddLog: (playerId: string, actionType: LogDBProps["variant"]) => void;
};

const Player: React.FC<Props> = ({
  game,
  player,
  index,
  score,
  isPending,
  onAddLog,
}) => {
  const computedColorScheme = useComputedColorScheme("light");

  const [reversePlayerInfo] = useLocalStorage({
    key: "reversePlayerInfo",
    defaultValue: false,
  });

  if (!score) return null;

  const rows = rules[game.ruleType].rows;

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
      bg={getColor(score.state)}
      c={
        getColor(score.state) &&
        (computedColorScheme === "light" ? "white" : "black")
      }
      w={{
        base: "100%",
        md: `clamp(8vw, ${
          (98 - 5) / 5 // 仮で5プレイヤーとして計算
        }vw, 15vw)`,
      }}
      style={{
        borderColor: `var(--mantine-color-${(
          getColor(score.state) ||
          getColor(score.reach_state) ||
          (computedColorScheme === "dark" ? "gray.8" : "gray.1")
        ).replace(".", "-")})`,
      }}
      data-reverse={reversePlayerInfo}
    >
      <Flex className={classes.player_info} data-rows={rows}>
        <PlayerHeader
          belong={
            (player as GameDBPlayerProps & { belong?: string }).belong || ""
          }
          index={index}
          isVerticalView={true}
          text={(player as GameDBPlayerProps & { text?: string }).text || ""}
        />
        <PlayerName player_name={player.name} rows={rows} />
      </Flex>
      <PlayerScore
        game={game}
        player={score}
        isPending={isPending}
        onAddLog={onAddLog}
      />
    </Flex>
  );
};

export default Player;
