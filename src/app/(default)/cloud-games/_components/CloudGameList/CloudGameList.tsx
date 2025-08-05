"use client";

import { useState } from "react";

import { Group, NativeSelect, SegmentedControl, Title } from "@mantine/core";

import CloudCreateGameModal from "../CloudCreateGameModal/CloudCreateGameModal";
import CloudGameListGrid from "../CloudGameListGrid/CloudGameListGrid";
import CloudGameListTable from "../CloudGameListTable/CloudGameListTable";

import Link from "@/app/_components/Link";

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

type CloudGameListProps = {
  user: User | null;
  games: Game[];
  logCounts: Record<string, number>;
  playerCounts: Record<string, number>;
};

const CloudGameList: React.FC<CloudGameListProps> = ({
  user,
  games,
  logCounts,
  playerCounts,
}) => {
  const [orderType, setOrderType] = useState<"last_open" | "name">("last_open");
  const [displayMode, setDisplayMode] = useState<"grid" | "table">("grid");

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
      const logCount = logCounts[game.id] || 0;
      const playerCount = playerCounts[game.id] || 0;
      const gameState = logCount === 0 ? "設定中" : `${logCount}問目`;

      return {
        id: game.id,
        name: game.name,
        type: game.ruleType,
        player_count: playerCount,
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
      <Group justify="space-between" mb="lg">
        <Title order={2}>クラウドゲーム</Title>
        <CloudCreateGameModal userId={user.id} />
      </Group>
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
