"use client";

import { useState } from "react";

import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { AdjustmentsHorizontal, Box } from "tabler-icons-react";

import ButtonLink from "@/app/_components/ButtonLink";
import Link from "@/app/_components/Link";
import db from "@/utils/db";
import { getRuleStringByType } from "@/utils/rules";
import { Flex, NativeSelect, Paper, Title } from "@mantine/core";

export default function GamesPage() {
  const currentProfile = window.localStorage.getItem("scorew_current_profile");
  const games = useLiveQuery(
    () => db(currentProfile).games.orderBy("last_open").reverse().toArray(),
    []
  );
  const logs = useLiveQuery(() => db(currentProfile).logs.toArray(), []);
  const [orderType, setOrderType] = useState<"last_open" | "name">("last_open");

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
      <Flex className="justify-end gap-2">
        <NativeSelect
          onChange={(v) => setOrderType(v.target.value as "last_open" | "name")}
        >
          <option value="last_open">最終閲覧順</option>
          <option value="name">ゲーム名順</option>
        </NativeSelect>
      </Flex>
      {parsedGameList.length === 0 ? (
        <p>
          作成済みのゲームはありません。
          <Link href="/rules">形式一覧</Link>
          ページから新しいゲームを作ることが出来ます。
        </p>
      ) : (
        <Box
          className="grid gap-3 pt-3"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {parsedGameList.map((game) => (
            <Paper
              shadow="xs"
              className="flex justify-between gap-3 p-3"
              key={game.id}
              title={game.name}
            >
              <Box>
                <Title
                  className="overflow-x-scroll whitespace-nowrap"
                  order={4}
                >
                  {game.name}
                </Title>
                <p>
                  {game.type} ／ {game.player_count}人
                </p>
                <p>進行状況: {game.state}</p>
              </Box>
              <Flex className="items-center justify-between">
                <Box>{cdate(game.last_open).format("MM/DD HH:mm")}</Box>
                <ButtonLink
                  href={`/games/${game.id}/config`}
                  leftSection={<AdjustmentsHorizontal />}
                  size="sm"
                >
                  開く
                </ButtonLink>
              </Flex>
            </Paper>
          ))}
        </Box>
      )}
    </>
  );
}
