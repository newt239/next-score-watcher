"use client";

import { useState, useEffect } from "react";

import { Box, Text } from "@mantine/core";

import classes from "./CloudBoard.module.css";

import { authClient } from "@/utils/auth/auth-client";
import apiClient from "@/utils/hono/client";

type Props = {
  game_id: string;
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

const CloudBoard: React.FC<Props> = ({ game_id }) => {
  const [user, setUser] = useState<User | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<unknown[]>([]);
  const [logs, setLogs] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await authClient.getSession();
        setUser(session?.data?.user || null);
      } catch (error) {
        console.error("Failed to get user session:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const [gameResponse, playersResponse, logsResponse] = await Promise.all(
          [
            apiClient["games"][":gameId"].$get(
              { param: { gameId: game_id } },
              {
                headers: { "x-user-id": user.id },
              }
            ),
            apiClient["games"][":gameId"]["players"].$get(
              { param: { gameId: game_id } },
              {
                headers: { "x-user-id": user.id },
              }
            ),
            apiClient["games"][":gameId"]["logs"].$get(
              { param: { gameId: game_id } },
              {
                headers: { "x-user-id": user.id },
              }
            ),
          ]
        );

        const gameData = await gameResponse.json();
        const playersData = await playersResponse.json();
        const logsData = await logsResponse.json();

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

export default CloudBoard;
