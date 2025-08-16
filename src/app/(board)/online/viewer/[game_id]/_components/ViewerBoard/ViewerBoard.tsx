"use client";

import { useCallback, useEffect, useState } from "react";

import { Flex, Text } from "@mantine/core";

import styles from "./ViewerBoard.module.css";

import type {
  ComputedScoreProps,
  GetViewerBoardDataResponseType,
} from "@/models/games";

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

  // ページのフォーカス時に即座に更新
  useEffect(() => {
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
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
            <AQLViewerBoard players={players} />
          </div>
        ) : (
          <div className={styles.playersList}>
            {players.map((player) => (
              <PlayerViewerCard key={player.player_id} player={player} />
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
            const player = gameData.players.find(
              (p) => p.player_id === log.player_id
            );
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

// 個別プレイヤーカード（観戦専用）
type PlayerCardProps = {
  player: ComputedScoreProps;
};

const PlayerViewerCard = ({ player }: PlayerCardProps) => {
  // プレイヤー名を取得（player.textを使用）
  const playerName = player.text || `プレイヤー${player.player_id}`;
  return (
    <div className={styles.playerCard}>
      <div className={styles.playerInfo}>
        <Text size="lg" fw={600} c="white">
          {playerName}
        </Text>
        <Text size="sm" c="dimmed">
          {player.order}位
        </Text>
      </div>
      <div className={styles.playerScore}>
        <Text size="xl" fw={700} c="yellow">
          {player.score}pt
        </Text>
        <div className={styles.playerStats}>
          <Text size="sm" c="green">
            正解: {player.correct}
          </Text>
          <Text size="sm" c="red">
            誤答: {player.wrong}
          </Text>
        </div>
      </div>
    </div>
  );
};

// AQL専用ボード（観戦専用）
const AQLViewerBoard = ({ players }: { players: ComputedScoreProps[] }) => {
  return (
    <div className={styles.aqlContainer}>
      <div className={styles.aqlPlayers}>
        {players.map((player) => (
          <div key={player.player_id} className={styles.aqlPlayer}>
            <Text size="md" fw={600} c="white" ta="center">
              {player.text || `プレイヤー${player.player_id}`}
            </Text>
            <Text size="xl" fw={700} c="yellow" ta="center">
              {player.score}
            </Text>
            <Flex gap="sm" justify="center">
              <Text size="sm" c="green">
                {player.correct}
              </Text>
              <Text size="sm" c="red">
                {player.wrong}
              </Text>
            </Flex>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewerBoard;
