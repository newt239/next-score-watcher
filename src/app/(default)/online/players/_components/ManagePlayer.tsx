"use client";

import { Suspense, useCallback, useState } from "react";

import { Tabs, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { parseResponse } from "hono/client";

import CreatePlayer from "./CreatePlayer";
import ImportPlayer from "./ImportPlayer";
import LoadPlayer from "./LoadPlayer";
import PlayersTable from "./PlayersTable";

import type { CreatePlayerType, UpdatePlayerType } from "@/models/player";

import createApiClient from "@/utils/hono/browser";

type Props = {
  initialPlayers: UpdatePlayerType[];
};

const ManagePlayer: React.FC<Props> = ({ initialPlayers }) => {
  const [players, setPlayers] = useState<UpdatePlayerType[]>(initialPlayers);
  const apiClient = createApiClient();

  const refetchPlayers = async () => {
    try {
      const result = await parseResponse(apiClient.players.$get({ query: {} }));
      if ("error" in result) {
        throw new Error("プレイヤー一覧の取得に失敗しました");
      }
      setPlayers(result);
    } catch (error) {
      notifications.show({
        title: "エラー",
        message:
          error instanceof Error ? error.message : "不明なエラーが発生しました",
        color: "red",
      });
    }
  };

  // 共通のAPIリクエスト関数群
  // プレイヤー作成（単体・複数統一）
  const createPlayers = useCallback(async (playerData: CreatePlayerType[]) => {
    try {
      const data = await parseResponse(
        apiClient.players.$post({
          json: playerData,
        })
      );

      if (data.success) {
        const count = data.data.createdCount;

        notifications.show({
          title: "プレイヤーを作成しました",
          message: `${count}人のプレイヤーを追加しました`,
          color: "green",
        });

        await refetchPlayers();

        return count;
      }
      throw new Error("プレイヤーの作成に失敗しました");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "プレイヤーの作成に失敗しました";
      notifications.show({
        title: "エラー",
        message: errorMessage,
        color: "red",
      });
      throw error;
    }
  }, []);

  // プレイヤー削除
  const deletePlayers = useCallback(async (playerIds: string[]) => {
    try {
      await parseResponse(
        apiClient.players.$delete({
          json: playerIds,
        })
      );

      notifications.show({
        title: `${playerIds.length}人のプレイヤーを削除しました`,
        message: "削除が完了しました",
        autoClose: 9000,
        withCloseButton: true,
      });

      return true;
    } catch (error) {
      notifications.show({
        title: "エラー",
        message: "プレイヤーの削除に失敗しました",
        color: "red",
      });
      throw error;
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
            <CreatePlayer createPlayers={createPlayers} />
          </Suspense>
        </Tabs.Panel>
        <Tabs.Panel value="paste" style={{ paddingTop: "1rem" }}>
          <LoadPlayer createPlayers={createPlayers} />
        </Tabs.Panel>
        <Tabs.Panel value="import" style={{ paddingTop: "1rem" }}>
          <ImportPlayer createPlayers={createPlayers} />
        </Tabs.Panel>
      </Tabs>

      <PlayersTable
        players={players}
        deletePlayers={deletePlayers}
        refetchPlayers={refetchPlayers}
      />
    </>
  );
};

export default ManagePlayer;
