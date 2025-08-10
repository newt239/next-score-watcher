"use client";

import { Flex } from "@mantine/core";

import Player from "./Player/Player";
import classes from "./Players.module.css";

import type { UserPreferencesType } from "@/models/user-preferences";
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
  preferences: UserPreferencesType | null;
};

/**
 * オンライン版のプレイヤー一覧表示コンポーネント
 * ローカル版のPlayersコンポーネントと同等の機能を提供
 */
const Players: React.FC<Props> = ({
  game,
  scores,
  players,
  isPending,
  onAddLog,
  preferences,
}) => {
  return (
    <Flex
      className={classes.players}
      id="players-area"
      data-showheader={preferences?.showBoardHeader ?? true}
    >
      {players.map((player, i) => (
        <Player
          game={game}
          index={i}
          key={`online-player-${i}-${player.id}`}
          player={player}
          score={scores.find((score) => score.player_id === player.id)}
          isPending={isPending}
          onAddLog={onAddLog}
          preferences={preferences}
        />
      ))}
    </Flex>
  );
};

export default Players;
