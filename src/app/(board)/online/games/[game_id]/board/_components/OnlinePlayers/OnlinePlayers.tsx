"use client";

import { Flex } from "@mantine/core";

import OnlinePlayer from "./OnlinePlayer/OnlinePlayer";
import classes from "./OnlinePlayers.module.css";

import type {
  ComputedScoreProps,
  GameDBPlayerProps,
  LogDBProps,
  RuleNames,
} from "@/utils/types";

type OnlineGame = {
  id: string;
  name: string;
  ruleType: RuleNames;
};

type Props = {
  game: OnlineGame;
  scores: ComputedScoreProps[];
  players: GameDBPlayerProps[];
  isPending: boolean;
  onAddLog: (playerId: string, actionType: LogDBProps["variant"]) => void;
};

/**
 * オンライン版のプレイヤー一覧表示コンポーネント
 * ローカル版のPlayersコンポーネントと同等の機能を提供
 */
const OnlinePlayers: React.FC<Props> = ({
  game,
  scores,
  players,
  isPending,
  onAddLog,
}) => {
  return (
    <Flex className={classes.players} id="players-area">
      {players.map((player, i) => (
        <OnlinePlayer
          game={game}
          index={i}
          key={player.id}
          player={player}
          score={scores.find((score) => score.player_id === player.id)}
          isPending={isPending}
          onAddLog={onAddLog}
        />
      ))}
    </Flex>
  );
};

export default OnlinePlayers;
