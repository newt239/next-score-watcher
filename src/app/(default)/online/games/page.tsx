import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Group, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { parseResponse } from "hono/client";

import GameListControl from "./_components/GameListControl/GameListControl";
import GameListGrid from "./_components/GameListGrid/GameListGrid";
import GameListTable from "./_components/GameListTable/GameListTable";

import ButtonLink from "@/app/_components/ButtonLink";
import Link from "@/app/_components/Link";
import { createApiClientOnServer } from "@/utils/hono/server";

export const metadata: Metadata = {
  title: "ゲーム一覧",
  robots: {
    index: false,
  },
};

type GamesPageProps = {
  searchParams: Promise<{
    display?: string;
    order?: string;
  }>;
};

/**
 * ゲーム一覧ページ
 * @param searchParams - URLパラメータ
 * @returns ゲーム一覧ページ
 */
const GamesPage = async ({ searchParams }: GamesPageProps) => {
  const params = await searchParams;
  const displayMode: "grid" | "table" =
    params.display === "table" ? "table" : "grid";
  const orderType: "last_open" | "name" =
    params.order === "name" ? "name" : "last_open";

  const apiClient = await createApiClientOnServer();
  const gamesData = await parseResponse(apiClient["games"].$get());

  if ("error" in gamesData) {
    return notFound();
  }

  const orderedGameList = gamesData.games.sort((prev, cur) => {
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
      <GameListControl />
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

export default GamesPage;
