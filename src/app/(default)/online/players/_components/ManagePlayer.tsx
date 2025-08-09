"use client";

import { Suspense, useState, useCallback } from "react";

import { Tabs, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import CreatePlayer from "./CreatePlayer";
import ImportPlayer from "./ImportPlayer";
import LoadPlayer from "./LoadPlayer";
import PlayersTable from "./PlayersTable";

import type { ApiPlayerDataType } from "@/models/players";

import createApiClient from "@/utils/hono/client";

type Props = {
  initialPlayers: ApiPlayerDataType[];
};

const ManagePlayer: React.FC<Props> = ({ initialPlayers }) => {
  const [players, setPlayers] = useState<ApiPlayerDataType[]>(initialPlayers);

  const refetchPlayers = useCallback(async () => {
    try {
      const apiClient = await createApiClient();
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
      <Title order={2}>プレイヤー管理</Title>
      <h3>プレイヤーの追加</h3>
      <Tabs pt="lg" variant="outline" defaultValue="add">
        <Tabs.List mt="lg" grow>
          <Tabs.Tab value="add">個別に追加</Tabs.Tab>
          <Tabs.Tab value="paste">貼り付け</Tabs.Tab>
          <Tabs.Tab value="import">インポート</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="add" style={{ paddingTop: "1rem" }}>
          <Suspense>
            <CreatePlayer onPlayerCreated={refetchPlayers} />
          </Suspense>
        </Tabs.Panel>
        <Tabs.Panel value="paste" style={{ paddingTop: "1rem" }}>
          <LoadPlayer onPlayerCreated={refetchPlayers} />
        </Tabs.Panel>
        <Tabs.Panel value="import" style={{ paddingTop: "1rem" }}>
          <ImportPlayer onPlayerCreated={refetchPlayers} />
        </Tabs.Panel>
      </Tabs>

      <PlayersTable players={players} onPlayersUpdated={setPlayers} />
    </>
  );
};

export default ManagePlayer;
