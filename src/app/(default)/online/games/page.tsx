import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { parseResponse } from "hono/client";

import GameList from "./_components/GameList/GameList";

import { getUser } from "@/utils/auth/auth-helpers";
import { createApiClientOnServer } from "@/utils/hono/server";

export const metadata: Metadata = {
  title: "ゲーム一覧",
  robots: {
    index: false,
  },
};

const GamesPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const apiClient = await createApiClientOnServer();

  const gamesData = await parseResponse(apiClient["games"].$get());

  if ("error" in gamesData) {
    return "データ取得に失敗しました";
  }

  const games = gamesData.games;

  return <GameList games={games} />;
};

export default GamesPage;
