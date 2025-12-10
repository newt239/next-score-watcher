import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { parseResponse } from "hono/client";

import PlayersConfig from "./_components/PlayersConfig";

import { createApiClientOnServer } from "@/utils/hono/server";

export const metadata: Metadata = {
  title: "プレイヤー設定",
};

type PlayerPageProps = {
  params: Promise<{ game_id: string }>;
};

/**
 * プレイヤー設定ページ
 */
const PlayerPage = async ({ params }: PlayerPageProps) => {
  const { game_id } = await params;

  const apiClient = await createApiClientOnServer();

  const gameData = await parseResponse(
    apiClient.games[":gameId"].$get({ param: { gameId: game_id } })
  );
  const playersData = await parseResponse(apiClient.players.$get({ query: {} }));

  if ("error" in gameData || "error" in playersData) {
    return notFound();
  }

  return (
    <PlayersConfig
      game_id={game_id}
      rule={gameData.data.ruleType}
      players={playersData}
      gamePlayers={gameData.data.players}
    />
  );
};

export default PlayerPage;
