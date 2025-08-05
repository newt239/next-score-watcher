"use client";

import { useState, useEffect } from "react";

import { Group, NativeSelect, SegmentedControl, Title } from "@mantine/core";

import CloudGameListGrid from "../CloudGameListGrid/CloudGameListGrid";
import CloudGameListTable from "../CloudGameListTable/CloudGameListTable";

import Link from "@/app/_components/Link";
import { authClient } from "@/utils/auth/auth-client";
import { getCloudGames } from "@/utils/cloud-db";

type User = {
  id: string;
  name: string;
  email: string;
};

type Game = {
  id: string;
  name: string;
  ruleType: string;
  updatedAt: Date;
};

const CloudGameList: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [logs, setLogs] = useState<unknown[]>([]);
  const [orderType, setOrderType] = useState<"last_open" | "name">("last_open");
  const [displayMode, setDisplayMode] = useState<"grid" | "table">("grid");

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
        const gamesData = await getCloudGames(user.id);
        setGames(gamesData);

        // TODO: 各ゲームのログを取得する処理を実装
        // 現在は空配列で初期化
        setLogs([]);
      } catch (error) {
        console.error("Failed to fetch cloud games:", error);
      }
    };

    fetchData();
  }, [user?.id]);

  const parsedGameList = games
    .sort((prev, cur) => {
      if (orderType === "last_open") {
        if (prev.updatedAt > cur.updatedAt) return -1;
        if (prev.updatedAt < cur.updatedAt) return 1;
        return 0;
      } else {
        if (prev.name < cur.name) return -1;
        if (prev.name > cur.name) return 1;
        return 0;
      }
    })
    .map((game) => {
      const eachGameLogs = logs.filter(
        (log) => (log as { game_id?: string }).game_id === game.id
      );
      const gameState =
        eachGameLogs.length === 0 ? "設定中" : `${eachGameLogs.length}問目`;
      return {
        id: game.id,
        name: game.name,
        type: game.ruleType,
        player_count: 0, // TODO: プレイヤー数を取得
        state: gameState,
        last_open: game.updatedAt.toISOString(),
      };
    });

  if (!user) {
    return (
      <>
        <Title order={2}>クラウドゲーム</Title>
        <p>
          クラウドゲームを利用するには
          <Link href="/sign-in">サインイン</Link>
          が必要です。
        </p>
      </>
    );
  }

  return (
    <>
      <Title order={2}>クラウドゲーム</Title>
      <Group justify="end" mb="lg" gap="md">
        <SegmentedControl
          value={displayMode}
          onChange={(v) => setDisplayMode(v as "grid" | "table")}
          data={[
            { value: "grid", label: "グリッド" },
            { value: "table", label: "テーブル" },
          ]}
        />
        <NativeSelect
          onChange={(v) => setOrderType(v.target.value as "last_open" | "name")}
        >
          <option value="last_open">最終更新順</option>
          <option value="name">ゲーム名順</option>
        </NativeSelect>
      </Group>
      {parsedGameList.length === 0 ? (
        <p>
          作成済みのクラウドゲームはありません。
          <Link href="/rules">形式一覧</Link>
          ページから新しいゲームを作ることが出来ます。
        </p>
      ) : displayMode === "grid" ? (
        <CloudGameListGrid gameList={parsedGameList} />
      ) : (
        <CloudGameListTable gameList={parsedGameList} />
      )}
    </>
  );
};

export default CloudGameList;
