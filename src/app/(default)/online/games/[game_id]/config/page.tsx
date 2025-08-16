import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { parseResponse } from "hono/client";

import Config from "./_components/Config/Config";

import { getUser } from "@/utils/auth/auth-helpers";
import { createApiClientOnServer } from "@/utils/hono/server";

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

  const gameData = await parseResponse(
    apiClient.games[":gameId"].$get({ param: { gameId: game_id } })
  );
  const playersData = await parseResponse(
    apiClient.players.$get({ query: {} })
  );

  if ("error" in gameData || "error" in playersData) {
    return "データ取得に失敗しました";
  }

  return <Config user={user} game={gameData.data} players={playersData} />;
};

export default ConfigPage;
