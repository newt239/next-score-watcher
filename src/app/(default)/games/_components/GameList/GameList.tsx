"use client";

import { useState } from "react";

import { Group, NativeSelect, SegmentedControl, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useLiveQuery } from "dexie-react-hooks";

import { CURRENT_PROFILE_STORAGE_KEY } from "@/utils/current-profile";
import db from "@/utils/db";
import { parseGameList } from "@/utils/parseGameList";

import GameListGrid from "../GameListGrid/GameListGrid";
import GameListTable from "../GameListTable/GameListTable";

type Props = {
  currentProfile: string;
};

const GameList: React.FC<Props> = ({ currentProfile }) => {
  const [storedCurrentProfile] = useLocalStorage({
    key: CURRENT_PROFILE_STORAGE_KEY,
    defaultValue: currentProfile,
  });
  const games = useLiveQuery(
    () => db(storedCurrentProfile).games.orderBy("last_open").reverse().toArray(),
    [storedCurrentProfile]
  );
  const logs = useLiveQuery(() => db(storedCurrentProfile).logs.toArray(), [storedCurrentProfile]);
  const [orderType, setOrderType] = useState<"last_open" | "name">("last_open");
  const [displayMode, setDisplayMode] = useState<"grid" | "table">("grid");

  const parsedGameList = parseGameList(games, logs, orderType);

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
        <NativeSelect onChange={(v) => setOrderType(v.target.value as "last_open" | "name")}>
          <option value="last_open">最終閲覧順</option>
          <option value="name">ゲーム名順</option>
        </NativeSelect>
      </Group>
      {displayMode === "grid" ? (
        <GameListGrid gameList={parsedGameList} />
      ) : (
        <GameListTable gameList={parsedGameList} />
      )}
    </>
  );
};

export default GameList;
