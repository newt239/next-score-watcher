"use client";

import { useEffect, useState } from "react";

import { Box, Text } from "@mantine/core";
import { parseResponse } from "hono/client";

import classes from "./Board.module.css";

import createApiClient from "@/utils/hono/client";

type Props = {
  game_id: string;
  user: User | null;
};

type User = {
  id: string;
  name: string;
  email: string;
};

type Game = {
  id: string;
  name: string;
  ruleType: string;
};

const Board: React.FC<Props> = ({ game_id, user }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<unknown[]>([]);
  const [logs, setLogs] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const apiClient = await createApiClient();
        const [gameData, playersData, logsData] = await Promise.all([
          parseResponse(
            apiClient["games"][":gameId"].$get(
              { param: { gameId: game_id } },
              {
                headers: { "x-user-id": user.id },
              }
            )
          ),
          parseResponse(
            apiClient["games"][":gameId"]["players"].$get(
              { param: { gameId: game_id } },
              {
                headers: { "x-user-id": user.id },
              }
            )
          ),
          parseResponse(
            apiClient["games"][":gameId"]["logs"].$get(
              { param: { gameId: game_id } },
              {
                headers: { "x-user-id": user.id },
              }
            )
          ),
        ]);

        if ("game" in gameData) {
          setGame(gameData.game);
        }
        if ("players" in playersData) {
          setPlayers(playersData.players);
        }
        if ("logs" in logsData) {
          setLogs(logsData.logs);
        }
      } catch (error) {
        console.error("Failed to fetch cloud game board data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [game_id, user?.id]);

  if (loading) {
    return (
      <Box className={classes.loading}>
        <Text>読み込み中...</Text>
      </Box>
    );
  }

  if (!game) {
    return (
      <Box className={classes.error}>
        <Text>ゲームが見つかりません</Text>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box className={classes.error}>
        <Text>サインインが必要です</Text>
      </Box>
    );
  }

  return (
    <Box className={classes.board}>
      <Text size="xl" fw={700} mb="md">
        {game.name} - クラウドボード
      </Text>
      <Text size="sm" c="dimmed">
        クラウドゲーム用のボード表示機能は実装中です。
      </Text>
      <Text size="sm" mt="md">
        ゲーム形式: {game.ruleType}
      </Text>
      <Text size="sm">プレイヤー数: {players.length}人</Text>
      <Text size="sm">ログ数: {logs.length}件</Text>
    </Box>
  );
};

export default Board;
