"use client";

import { Suspense, useState, useCallback } from "react";

import { Tabs, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import OnlineCreatePlayer from "./OnlineCreatePlayer";
import OnlinePlayersTable from "./OnlinePlayersTable";

import type { ApiPlayerDataType } from "@/models/players";

import apiClient from "@/utils/hono/client";

type Props = {
  currentProfile: string;
  initialPlayers: ApiPlayerDataType[];
};

const OnlineManagePlayer: React.FC<Props> = ({
  currentProfile,
  initialPlayers,
}) => {
  const [players, setPlayers] = useState<ApiPlayerDataType[]>(initialPlayers);

  const refetchPlayers = useCallback(async () => {
    try {
      const response = await apiClient.players.$get({ query: {} });
      if (!response.ok) {
        throw new Error("プレイヤー一覧の取得に失敗しました");
      }
      const data = await response.json();
      setPlayers(data.data.players || []);
    } catch (error) {
      notifications.show({
        title: "エラー",
        message:
          error instanceof Error ? error.message : "不明なエラーが発生しました",
        color: "red",
      });
    }
  }, []);
  return (
    <>
      <Title order={2}>オンラインプレイヤー管理</Title>
      <h3>プレイヤーの追加</h3>
      <Tabs pt="lg" variant="outline" defaultValue="add">
        <Tabs.List mt="lg" grow>
          <Tabs.Tab value="add">個別に追加</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="add" style={{ paddingTop: "1rem" }}>
          <Suspense>
            <OnlineCreatePlayer
              currentProfile={currentProfile}
              onPlayerCreated={refetchPlayers}
            />
          </Suspense>
        </Tabs.Panel>
      </Tabs>

      <OnlinePlayersTable
        currentProfile={currentProfile}
        players={players}
        onPlayersUpdated={setPlayers}
      />
    </>
  );
};

export default OnlineManagePlayer;
