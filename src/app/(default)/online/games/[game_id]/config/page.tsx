import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { parseResponse } from "hono/client";

import Config from "./_components/Config/Config";

import type { OnlineGameLogType, OnlinePlayerDBProps } from "@/models/games";

import { getUser } from "@/utils/auth/auth-helpers";
import { createApiClientOnServer } from "@/utils/hono/server-client";

export const metadata: Metadata = {
  title: "ゲーム設定",
  robots: {
    index: false,
  },
};

const ConfigPage = async ({
  params,
}: {
  params: Promise<{ game_id: string }>;
}) => {
  const { game_id } = await params;
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const apiClient = await createApiClientOnServer();

  const [gameData, playersData, logsData] = await Promise.all([
    parseResponse(
      apiClient["games"][":gameId"].$get({ param: { gameId: game_id } })
    ),
    parseResponse(apiClient["players"].$get({ query: {} })),
    parseResponse(
      apiClient["games"][":gameId"]["logs"].$get({
        param: { gameId: game_id },
      })
    ),
  ]);

  if ("error" in gameData || "error" in playersData || "error" in logsData) {
    redirect("/online/games");
  }

  // プレイヤーデータの抽出
  let allPlayers: OnlinePlayerDBProps[] = [];
  if ("players" in playersData && Array.isArray(playersData.players)) {
    allPlayers = playersData.players;
  } else if (
    "success" in playersData &&
    playersData.success &&
    "data" in playersData
  ) {
    const data = playersData.data;
    if (data && typeof data === "object" && "players" in data) {
      allPlayers = data.players as OnlinePlayerDBProps[];
    } else if (Array.isArray(data)) {
      allPlayers = data as OnlinePlayerDBProps[];
    }
  }

  // ログデータの抽出とフィルタリング
  let filteredLogs: OnlineGameLogType[] = [];
  if ("logs" in logsData && Array.isArray(logsData.logs)) {
    filteredLogs = logsData.logs
      .filter((log: unknown) => {
        const typedLog = log as { system: number; available: number };
        return typedLog.system === 0 && typedLog.available === 1;
      })
      .map((log: unknown) => {
        return log as OnlineGameLogType;
      });
  }

  return (
    <Config
      gameId={game_id}
      user={user}
      initialGame={{ ...gameData.game, settings: {} }}
      initialPlayers={allPlayers}
      initialLogs={filteredLogs}
    />
  );
};

export default ConfigPage;
