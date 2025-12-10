import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { parseResponse } from "hono/client";

import ConfigHeader from "./_components/ConfigHeader/ConfigHeader";
import ConfigTabs from "./_components/ConfigTabs/ConfigTabs";
import { GameStateProvider } from "./_hooks/useGameState";

import { createApiClientOnServer } from "@/utils/hono/server";

export const metadata: Metadata = {
  title: "ゲーム設定",
  robots: {
    index: false,
  },
};

type ConfigLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ game_id: string }>;
};

/**
 * 設定ページの共通レイアウト
 * サーバーサイドでゲーム情報を取得し、各コンポーネントに分割
 */
const ConfigLayout = async ({ children, params }: ConfigLayoutProps) => {
  const { game_id } = await params;

  const apiClient = await createApiClientOnServer();
  const gameData = await parseResponse(
    apiClient.games[":gameId"].$get({ param: { gameId: game_id } })
  );

  if ("error" in gameData) {
    return notFound();
  }

  return (
    <GameStateProvider gameId={game_id} initialGame={gameData.data}>
      <ConfigHeader
        gameId={game_id}
        ruleType={gameData.data.ruleType}
        playerCount={gameData.data.players.length}
        logCount={gameData.data.logs.length}
      />
      <ConfigTabs gameId={game_id}>{children}</ConfigTabs>
    </GameStateProvider>
  );
};

export default ConfigLayout;
