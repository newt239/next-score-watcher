"use client";

import { useState } from "react";

import { Group, NativeSelect, SegmentedControl, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import GameListGrid from "../GameListGrid/GameListGrid";
import GameListTable from "../GameListTable/GameListTable";

import ButtonLink from "@/app/_components/ButtonLink";
import Link from "@/app/_components/Link";

type Game = {
  id: string;
  name: string;
  ruleType: string;
  updatedAt: string;
  logCount: number;
  playerCount: number;
  isPublic: boolean;
};

type GameListProps = {
  games: Game[];
};

const GameList: React.FC<GameListProps> = ({ games }) => {
  const [orderType, setOrderType] = useState<"last_open" | "name">("last_open");
  const [displayMode, setDisplayMode] = useState<"grid" | "table">("grid");

  const orderedGameList = games.sort((prev, cur) => {
    if (orderType === "last_open") {
      if (prev.updatedAt > cur.updatedAt) return -1;
      if (prev.updatedAt < cur.updatedAt) return 1;
      return 0;
    } else {
      if (prev.name < cur.name) return -1;
      if (prev.name > cur.name) return 1;
      return 0;
    }
  });

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={2}>ゲーム</Title>
        <ButtonLink href="/online/rules" leftSection={<IconPlus size={16} />}>
          新しいゲームを作成
        </ButtonLink>
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
      {orderedGameList.length === 0 ? (
        <p>
          作成済みのゲームはありません。
          <Link href="/online/rules">形式一覧</Link>
          ページから新しいゲームを作ることが出来ます。
        </p>
      ) : displayMode === "grid" ? (
        <GameListGrid gameList={orderedGameList} />
      ) : (
        <GameListTable gameList={orderedGameList} />
      )}
    </>
  );
};

export default GameList;
