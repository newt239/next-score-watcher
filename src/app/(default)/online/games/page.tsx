import type { Metadata } from "next";

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

  let games: Game[] = [];
  let logCounts: Record<string, number> = {};
  let playerCounts: Record<string, number> = {};

  if (user?.id) {
    try {
      const apiClient = await createApiClientOnServer();
      const gamesResponse = await apiClient["games"].$get({});
      const gamesData = await gamesResponse.json();
      if ("games" in gamesData) {
        games = gamesData.games.map((game: ApiGame) => ({
          ...game,
          updatedAt: new Date(game.updatedAt),
        }));
      }

      const gameIds = games.map((game) => game.id);

      if (gameIds.length > 0) {
        const [logCountsResponse, playerCountsResponse] = await Promise.all([
          apiClient["games"]["log-counts"].$post({ json: { gameIds } }),
          apiClient["games"]["player-counts"].$post({ json: { gameIds } }),
        ]);

        const logCountsData = await logCountsResponse.json();
        const playerCountsData = await playerCountsResponse.json();

        if ("logCounts" in logCountsData) {
          logCounts = logCountsData.logCounts;
        }
        if ("playerCounts" in playerCountsData) {
          playerCounts = playerCountsData.playerCounts;
        }
      }
    } catch (error) {
      console.error("Failed to fetch cloud games:", error);
    }
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
