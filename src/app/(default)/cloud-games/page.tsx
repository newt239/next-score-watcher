import type { Metadata } from "next";

import CloudGameList from "./_components/CloudGameList/CloudGameList";

import { authClient } from "@/utils/auth/auth-client";
import apiClient from "@/utils/hono/client";

type Game = {
  id: string;
  name: string;
  ruleType: string;
  updatedAt: Date;
};

export const metadata: Metadata = {
  title: "クラウドゲーム",
  robots: {
    index: false,
  },
};

const CloudGamesPage = async () => {
  const session = await authClient.getSession();
  const user = session?.data?.user || null;

  let games: Game[] = [];
  let logCounts: Record<string, number> = {};
  let playerCounts: Record<string, number> = {};

  if (user?.id) {
    try {
      const gamesResponse = await apiClient["cloud-games"].$get(
        {},
        {
          headers: { "x-user-id": user.id },
        }
      );
      const gamesData = await gamesResponse.json();
      if ("games" in gamesData) {
        games = gamesData.games.map((game) => ({
          ...game,
          updatedAt: new Date(game.updatedAt),
        }));
      }

      const gameIds = games.map((game) => game.id);

      if (gameIds.length > 0) {
        const [logCountsResponse, playerCountsResponse] = await Promise.all([
          apiClient["cloud-games"]["log-counts"].$post(
            { json: { gameIds } },
            {
              headers: { "x-user-id": user.id },
            }
          ),
          apiClient["cloud-games"]["player-counts"].$post(
            { json: { gameIds } },
            {
              headers: { "x-user-id": user.id },
            }
          ),
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
    <CloudGameList
      user={user}
      games={games}
      logCounts={logCounts}
      playerCounts={playerCounts}
    />
  );
};

export default CloudGamesPage;
