import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { parseResponse } from "hono/client";

import PlayersConfig from "./_components/PlayersConfig";

import { getUser } from "@/utils/auth/auth-helpers";
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
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const apiClient = await createApiClientOnServer();

  const gameData = await parseResponse(
    apiClient.games[":gameId"].$get({ param: { gameId: game_id } })
  );
  const playersData = await parseResponse(
    apiClient.players.$get({ query: {} })
  );

  if ("error" in gameData || "error" in playersData) {
    return "データ取得に失敗しました";
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
