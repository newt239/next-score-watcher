"use client";

import { useState } from "react";

import { Group, NativeSelect, SegmentedControl, Title } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";

import GameListGrid from "../GameListGrid/GameListGrid";
import GameListTable from "../GameListTable/GameListTable";

import Link from "@/app/_components/Link/Link";
import db from "@/utils/db";
import { getRuleStringByType } from "@/utils/rules";

type Props = {
  currentProfile: string;
};

const GameList: React.FC<Props> = ({ currentProfile }) => {
  const games = useLiveQuery(
    () => db(currentProfile).games.orderBy("last_open").reverse().toArray(),
    []
  );
  const logs = useLiveQuery(() => db(currentProfile).logs.toArray(), []);
  const [orderType, setOrderType] = useState<"last_open" | "name">("last_open");
  const [displayMode, setDisplayMode] = useState<"grid" | "table">("grid");

  const parsedGameList = (games || [])
    .sort((prev, cur) => {
      if (orderType === "last_open") {
        if (prev.last_open > cur.last_open) return -1;
        if (prev.last_open < cur.last_open) return 1;
        return 0;
      } else {
        if (prev.name < cur.name) return -1;
        if (prev.name > cur.name) return 1;
        return 0;
      }
    })
    .map((game) => {
      const eachGameLogs = (logs || []).filter(
        (log) => log.game_id === game.id
      );
      const gameState =
        eachGameLogs.length === 0 ? "設定中" : `${eachGameLogs.length}問目`;
      return {
        id: game.id,
        name: game.name,
        type: getRuleStringByType(game),
        player_count: game.players.length,
        state: gameState,
        last_open: game.last_open,
      };
    });

  return (
    <>
      <Title order={2}>作成したゲーム</Title>
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
          <option value="last_open">最終閲覧順</option>
          <option value="name">ゲーム名順</option>
        </NativeSelect>
      </Group>
      {parsedGameList.length === 0 ? (
        <p>
          作成済みのゲームはありません。
          <Link href="/rules">形式一覧</Link>
          ページから新しいゲームを作ることが出来ます。
        </p>
      ) : displayMode === "grid" ? (
        <GameListGrid gameList={parsedGameList} />
      ) : (
        <GameListTable gameList={parsedGameList} />
      )}
    </>
  );
};

export default GameList;
