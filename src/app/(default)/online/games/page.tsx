import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { parseResponse } from "hono/client";

import GameList from "./_components/GameList/GameList";

import { getUser } from "@/utils/auth/auth-helpers";
import { createApiClientOnServer } from "@/utils/hono/server-client";

type Game = {
  id: string;
  name: string;
  ruleType: string;
  updatedAt: Date;
};

type ApiGame = {
  id: string;
  name: string;
  ruleType: string;
  updatedAt: string;
};

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

  let games: Game[] = [];
  let logCounts: Record<string, number> = {};
  let playerCounts: Record<string, number> = {};

  try {
    const gamesData = await parseResponse(apiClient["games"].$get({}));
    if ("games" in gamesData) {
      games = gamesData.games.map((game: ApiGame) => ({
        ...game,
        updatedAt: new Date(game.updatedAt),
      }));
    }

    const gameIds = games.map((game) => game.id);

    if (gameIds.length > 0) {
      try {
        const [logCountsData, playerCountsData] = await Promise.all([
          parseResponse(
            apiClient["games"]["log-counts"].$post({ json: { gameIds } })
          ),
          parseResponse(
            apiClient["games"]["player-counts"].$post({ json: { gameIds } })
          ),
        ]);

        if ("logCounts" in logCountsData) {
          logCounts = logCountsData.logCounts;
        }
        if ("playerCounts" in playerCountsData) {
          playerCounts = playerCountsData.playerCounts;
        }
      } catch (countsError) {
        console.error("Failed to fetch counts:", countsError);
        // カウント取得に失敗してもゲーム一覧は表示する
      }
    }
  } catch (error) {
    console.error("Failed to fetch cloud games:", error);
  }

  return (
    <GameList
      user={user}
      games={games}
      logCounts={logCounts}
      playerCounts={playerCounts}
    />
  );
};

export default GamesPage;
