"use client";

import { useState } from "react";

import { Box, Card, Flex, Group, NativeSelect, Title } from "@mantine/core";
import { cdate } from "cdate";
import { useLiveQuery } from "dexie-react-hooks";
import { AdjustmentsHorizontal } from "tabler-icons-react";

import classes from "./GameList.module.css";

import ButtonLink from "@/app/_components/ButtonLink";
import Link from "@/app/_components/Link";
import db from "@/utils/db";
import { getRuleStringByType } from "@/utils/rules";

const GameList: React.FC = () => {
  const games = useLiveQuery(
    () => db().games.orderBy("last_open").reverse().toArray(),
    []
  );
  const logs = useLiveQuery(() => db().logs.toArray(), []);
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
      <Group justify="end">
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
      ) : (
        <Box className={classes.game_list_grid}>
          {parsedGameList.map((game) => (
            <Card shadow="xs" key={game.id} title={game.name}>
              <Card.Section
                className={classes.game_name}
                withBorder
                inheritPadding
              >
                {game.name}
              </Card.Section>
              <Card.Section className={classes.game_description}>
                <p>
                  {game.type} ／ {game.player_count}人
                </p>
                <p>進行状況: {game.state}</p>
              </Card.Section>
              <Flex className={classes.game_footer}>
                <Box>{cdate(game.last_open).format("MM/DD HH:mm")}</Box>
                <ButtonLink
                  href={`/games/${game.id}/config`}
                  leftSection={<AdjustmentsHorizontal />}
                  size="sm"
                >
                  開く
                </ButtonLink>
              </Flex>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
};

export default GameList;
