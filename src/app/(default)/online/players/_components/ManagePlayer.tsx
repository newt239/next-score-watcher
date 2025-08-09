"use client";

import { Suspense, useCallback, useOptimistic, useState } from "react";

import { Tabs, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import CreatePlayer from "./CreatePlayer";
import ImportPlayer from "./ImportPlayer";
import LoadPlayer from "./LoadPlayer";
import PlayersTable from "./PlayersTable";

import type { ApiPlayerDataType, CreatePlayerType } from "@/models/players";

import createApiClient from "@/utils/hono/client";

type Props = {
  initialPlayers: ApiPlayerDataType[];
  userId: string;
};

const ManagePlayer: React.FC<Props> = ({ initialPlayers }) => {
  const [players, setPlayers] = useState<ApiPlayerDataType[]>(initialPlayers);

  // useOptimistic を使用して楽観的更新を実装
  const [optimisticPlayers, addOptimisticPlayer] = useOptimistic(
    players,
    (currentPlayers: ApiPlayerDataType[], newPlayer: CreatePlayerType) => {
      // 楽観的に新しいプレイヤーを一覧に追加
      const optimisticPlayer: ApiPlayerDataType = {
        id: `temp-${Date.now()}`, // 一時的なID
        name: newPlayer.name,
        text: newPlayer.name, // displayNameがない場合はnameを使用
        belong: newPlayer.affiliation || "",
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return [optimisticPlayer, ...currentPlayers];
    }
  );

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

  // 共通のAPIリクエスト関数群
  // プレイヤー作成（単体・複数統一）
  const createPlayers = useCallback(
    async (playerData: CreatePlayerType | CreatePlayerType[]) => {
      try {
        const apiClient = await createApiClient();
        const response = await apiClient.players.$post({
          json: playerData,
        });

        if (!response.ok) {
          throw new Error("プレイヤーの作成に失敗しました");
        }

        const data = await response.json();

        if ("success" in data && data.success) {
          const isArray = Array.isArray(playerData);
          const count = data.data.createdCount;

          notifications.show({
            title: "プレイヤーを作成しました",
            message: isArray
              ? `${count}人のプレイヤーを追加しました`
              : `${(playerData as CreatePlayerType).name} を追加しました`,
            color: "green",
          });

          return count;
        } else {
          let errorMessage = "プレイヤーの作成に失敗しました";
          if (
            "error" in data &&
            typeof data.error === "object" &&
            data.error &&
            "message" in data.error &&
            typeof data.error.message === "string"
          ) {
            errorMessage = data.error.message;
          }
          throw new Error(errorMessage);
        }
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
    },
    []
  );

  // プレイヤー削除
  const deletePlayers = useCallback(async (playerIds: string[]) => {
    try {
      const apiClient = await createApiClient();
      const deletePromises = playerIds.map((playerId) =>
        apiClient.players[":id"].$delete({ param: { id: playerId } })
      );

      await Promise.all(deletePromises);

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

  // プレイヤー作成時の楽観的更新処理
  const handleOptimisticPlayerCreate = useCallback(
    (playerData: CreatePlayerType) => {
      addOptimisticPlayer(playerData);
    },
    [addOptimisticPlayer]
  );

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
            <CreatePlayer
              onOptimisticCreate={handleOptimisticPlayerCreate}
              onPlayerCreated={refetchPlayers}
              createPlayer={createPlayers}
            />
          </Suspense>
        </Tabs.Panel>
        <Tabs.Panel value="paste" style={{ paddingTop: "1rem" }}>
          <LoadPlayer
            onPlayerCreated={refetchPlayers}
            createBulkPlayers={createPlayers}
          />
        </Tabs.Panel>
        <Tabs.Panel value="import" style={{ paddingTop: "1rem" }}>
          <ImportPlayer
            onPlayerCreated={refetchPlayers}
            createBulkPlayers={createPlayers}
          />
        </Tabs.Panel>
      </Tabs>

      <PlayersTable
        players={optimisticPlayers}
        deletePlayers={deletePlayers}
        refetchPlayers={refetchPlayers}
      />
    </>
  );
};

export default ManagePlayer;
