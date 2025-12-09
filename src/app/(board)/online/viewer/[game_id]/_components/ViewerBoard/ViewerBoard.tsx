"use client";

import { useCallback, useEffect, useState } from "react";

import { Text } from "@mantine/core";

import ViewerAQLBoard from "../ViewerAQLBoard/ViewerAQLBoard";
import ViewerPlayer from "../ViewerPlayer/ViewerPlayer";

import styles from "./ViewerBoard.module.css";

import type { GetViewerBoardDataResponseType } from "@/models/game";

import createApiClient from "@/utils/hono/browser";

type ViewerBoardProps = {
  gameId: string;
  initialData: GetViewerBoardDataResponseType;
};

const ViewerBoard = ({ gameId, initialData }: ViewerBoardProps) => {
  const [gameData, setGameData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  // APIから受け取ったプレイヤーデータをそのまま使用
  // すでにサーバー側で計算済みのスコアデータ
  const players = gameData.players;

  // 2秒間隔でデータを更新
  const fetchData = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const apiClient = createApiClient();
      const response = await apiClient.viewer.games[":gameId"].board.$get({
        param: { gameId },
      });

      if (response.ok) {
        const result = await response.json();
        if ("data" in result) {
          setGameData(result.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch viewer data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [gameId, isLoading]);

  useEffect(() => {
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text size="xl" fw={700} c="white">
          {gameData.game.name}
        </Text>
        <Text size="sm" c="dimmed">
          {gameData.game.ruleType} ルール
        </Text>
        {isLoading && (
          <Text size="xs" c="blue">
            更新中...
          </Text>
        )}
      </div>

      <div className={styles.board}>
        {gameData.game.ruleType === "aql" ? (
          <div className={styles.aqlBoard}>
            <ViewerAQLBoard players={players} />
          </div>
        ) : (
          <div className={styles.playersList}>
            {players.map((player) => (
              <ViewerPlayer key={player.player_id} player={player} />
            ))}
          </div>
        )}
      </div>

      <div className={styles.logs}>
        <Text size="lg" fw={600} mb="md" c="white">
          ゲームログ
        </Text>
        <div className={styles.logsContainer}>
          {gameData.logs.slice(-10).map((log, index) => {
            const player = gameData.players.find((p) => p.player_id === log.player_id);
            const playerName = player?.text || `プレイヤー${log.player_id}`;
            return (
              <div key={index} className={styles.logItem}>
                <Text size="sm" c="dimmed">
                  {log.variant} - {playerName}
                </Text>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewerBoard;
