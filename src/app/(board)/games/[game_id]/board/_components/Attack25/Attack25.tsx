"use client";

import { useState, useTransition } from "react";

import { Box, Button, Flex, Text, UnstyledButton } from "@mantine/core";
import { cdate } from "cdate";
import { nanoid } from "nanoid";

import {
  applyReversiFlip,
  computeAttack25Board,
  countPanels,
  getClaimablePanels,
  isAttackChanceActive,
  PANEL_COUNT,
} from "@/utils/attack25";
import db from "@/utils/db";

import classes from "./Attack25.module.css";

import type { Attack25Board } from "@/utils/attack25";
import type { AllGameProps, LogDBProps, PlayerDBProps } from "@/utils/types";

/** プレイヤーの並び順に対応するパネルの色 */
const PLAYER_COLORS = ["red", "green", "white", "blue"] as const;

/** 色のスクリーンリーダー向け日本語ラベル */
const COLOR_LABELS: Record<string, string> = {
  red: "赤",
  green: "緑",
  white: "白",
  blue: "青",
  empty: "空き",
};

type Props = {
  game: AllGameProps["attack25"];
  players: PlayerDBProps[];
  logs: LogDBProps[];
  currentProfile: string;
  show_header: boolean;
};

const Attack25: React.FC<Props> = ({ game, players, logs, currentProfile, show_header }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [pendingClaim, setPendingClaim] = useState<{
    playerId: string;
    panel: number;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const attackChanceEnabled = game.options.attack_chance;
  const { board, attackChanceUsed } = computeAttack25Board(logs, attackChanceEnabled);
  const attackChanceActive = isAttackChanceActive(board, attackChanceUsed, attackChanceEnabled);
  const boardFull = board.every((cell) => cell !== null);

  // アタックチャンスの消去待ち中は、確定前の獲得を盤面に重ねて表示する
  const displayBoard: Attack25Board = pendingClaim
    ? applyReversiFlip(board, pendingClaim.panel, pendingClaim.playerId)
    : board;
  const counts = countPanels(displayBoard);

  // 選択中プレイヤーが獲得できるマス（はさめるマスがあれば必ずそれら、無ければ隣接マス）
  const claimablePanels =
    selectedPlayerId && !pendingClaim && !boardFull
      ? new Set(getClaimablePanels(board, selectedPlayerId))
      : null;

  const colorOf = (playerId: string) => {
    const index = players.findIndex((player) => player.id === playerId);
    return index >= 0 && index < PLAYER_COLORS.length ? PLAYER_COLORS[index] : "empty";
  };

  /** プレイヤーIDから表示名（未設定なら連番名）を返す */
  const displayNameOf = (playerId: string) => {
    const index = players.findIndex((player) => player.id === playerId);
    return players[index]?.name || `プレイヤー${index + 1}`;
  };

  const writeLog = (log: Pick<LogDBProps, "player_id" | "variant" | "panel" | "removed_panel">) => {
    startTransition(async () => {
      await db(currentProfile).logs.put({
        id: nanoid(),
        game_id: game.id,
        system: 0,
        timestamp: cdate().text(),
        available: 1,
        ...log,
      });
    });
  };

  const handlePanelClick = (index: number) => {
    if (boardFull || isPending) return;
    if (pendingClaim) {
      // 消去モード: 点灯済みパネル（獲得したばかりのパネルを除く）をクリックで消去
      if (displayBoard[index] !== null && index !== pendingClaim.panel) {
        writeLog({
          player_id: pendingClaim.playerId,
          variant: "correct",
          panel: pendingClaim.panel,
          removed_panel: index,
        });
        setPendingClaim(null);
        setSelectedPlayerId(null);
      }
      return;
    }
    // 通常の獲得: 獲得可能なマスのみ、プレイヤー選択済みのとき
    if (board[index] !== null || !selectedPlayerId) return;
    if (claimablePanels && !claimablePanels.has(index)) return;
    if (attackChanceActive) {
      setPendingClaim({ playerId: selectedPlayerId, panel: index });
    } else {
      writeLog({ player_id: selectedPlayerId, variant: "correct", panel: index });
      setSelectedPlayerId(null);
    }
  };

  const handleSkipRemoval = () => {
    if (!pendingClaim || isPending) return;
    writeLog({
      player_id: pendingClaim.playerId,
      variant: "correct",
      panel: pendingClaim.panel,
    });
    setPendingClaim(null);
    setSelectedPlayerId(null);
  };

  const handleWrong = () => {
    if (!selectedPlayerId || isPending) return;
    writeLog({ player_id: selectedPlayerId, variant: "wrong" });
    setSelectedPlayerId(null);
  };

  const winnerName = (() => {
    if (!boardFull) return "";
    const top = players.reduce<{ name: string; count: number }>(
      (acc, player) => {
        const count = counts[player.id] ?? 0;
        return count > acc.count ? { name: player.name, count } : acc;
      },
      { name: "", count: -1 }
    );
    return top.name;
  })();

  return (
    <Flex
      className={classes.attack25}
      id="players-area"
      data-showq={!!game.quiz}
      data-showheader={show_header}
    >
      <Box component="output" className={classes.message}>
        {boardFull ? (
          <Text className={classes.message_text} fw={700}>
            ゲーム終了 — 優勝: {winnerName}
          </Text>
        ) : pendingClaim ? (
          <>
            <Text className={classes.message_text} fw={700} c="orange">
              アタックチャンス！消すパネルを選択してください
            </Text>
            <Button size="xs" variant="default" onClick={handleSkipRemoval} disabled={isPending}>
              消さずに確定
            </Button>
          </>
        ) : !selectedPlayerId ? (
          <Text className={classes.message_text}>正解したプレイヤーを選択してください</Text>
        ) : (
          <>
            <Text className={classes.message_text}>
              {players.find((player) => player.id === selectedPlayerId)?.name}
              が獲得するパネルを選択してください
              {attackChanceActive && (
                <Text component="span" c="orange" fw={700}>
                  （次の正解はアタックチャンスです）
                </Text>
              )}
            </Text>
            <Button size="xs" color="blue" onClick={handleWrong} disabled={isPending}>
              誤答
            </Button>
            <Button
              size="xs"
              variant="default"
              onClick={() => setSelectedPlayerId(null)}
              disabled={isPending}
            >
              選択解除
            </Button>
          </>
        )}
      </Box>
      <Flex className={classes.main}>
        <Flex className={classes.players}>
          {players.map((player, index) => {
            const color = colorOf(player.id);
            const isSelected = selectedPlayerId === player.id;
            const name = player.name || `プレイヤー${index + 1}`;
            return (
              <UnstyledButton
                key={player.id}
                className={classes.player_card}
                data-color={color}
                data-selected={isSelected}
                disabled={boardFull || !!pendingClaim || isPending}
                aria-pressed={isSelected}
                aria-label={`${COLOR_LABELS[color]}・${name}・${counts[player.id] ?? 0}枚保持`}
                onClick={() => setSelectedPlayerId(isSelected ? null : player.id)}
              >
                <Box className={classes.player_swatch} data-color={color} aria-hidden />
                <Text className={classes.player_name}>{name}</Text>
                <Text className={classes.player_count}>{counts[player.id] ?? 0}</Text>
              </UnstyledButton>
            );
          })}
        </Flex>
        <Box className={classes.board}>
          {Array.from({ length: PANEL_COUNT }, (_, index) => {
            const cell = displayBoard[index];
            const color = cell === null ? "empty" : colorOf(cell);
            const isRemovable = !!pendingClaim && cell !== null && index !== pendingClaim.panel;
            const isClaimable =
              claimablePanels !== null && cell === null && claimablePanels.has(index);
            const panelLabel = (() => {
              const base = `パネル${index + 1}`;
              if (cell === null) {
                return isClaimable ? `${base}、空き、獲得できます` : `${base}、空き`;
              }
              const owner = `${COLOR_LABELS[color]}・${displayNameOf(cell)}が保持`;
              return isRemovable ? `${base}、${owner}、消去できます` : `${base}、${owner}`;
            })();
            return (
              <UnstyledButton
                key={index}
                className={classes.panel}
                data-color={color}
                data-actionable={isRemovable || isClaimable}
                disabled={boardFull || isPending || (!isRemovable && !isClaimable)}
                aria-label={panelLabel}
                onClick={() => handlePanelClick(index)}
              >
                {index + 1}
              </UnstyledButton>
            );
          })}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Attack25;
