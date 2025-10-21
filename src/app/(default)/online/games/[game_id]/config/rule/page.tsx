import type { Metadata } from "next";

import { parseResponse } from "hono/client";

import RuleSettings from "./_components/RuleSettings";

import { createApiClientOnServer } from "@/utils/hono/server";

export const metadata: Metadata = {
  title: "形式設定",
};

type RulePageProps = {
  params: Promise<{ game_id: string }>;
};

/**
 * 形式設定ページ
 */
const RulePage = async ({ params }: RulePageProps) => {
  const { game_id } = await params;

  const apiClient = await createApiClientOnServer();

  const gameData = await parseResponse(
    apiClient.games[":gameId"].$get({ param: { gameId: game_id } })
  );

  if ("error" in gameData) {
    return "ゲーム情報の取得に失敗しました";
  }

  return (
    <RuleSettings game={gameData.data} ruleType={gameData.data.ruleType} />
  );
};

export default RulePage;
