import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { parseResponse } from "hono/client";

import OtherConfig from "./_components/OtherConfig";

import { createApiClientOnServer } from "@/utils/hono/server";

export const metadata: Metadata = {
  title: "その他の設定",
};

type OtherPageProps = {
  params: Promise<{ game_id: string }>;
};

/**
 * その他の設定ページ
 */
const OtherPage = async ({ params }: OtherPageProps) => {
  const { game_id } = await params;

  const apiClient = await createApiClientOnServer();
  const gameData = await parseResponse(
    apiClient.games[":gameId"].$get({ param: { gameId: game_id } })
  );

  if ("error" in gameData) {
    return notFound();
  }

  const game = gameData.data;

  return (
    <OtherConfig
      gameId={game.id}
      gameName={game.name}
      ruleType={game.ruleType}
      discordWebhookUrl={game.discordWebhookUrl || ""}
      isPublic={game.isPublic}
    />
  );
};

export default OtherPage;
