import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { parseResponse } from "hono/client";

import ConfigHeader from "./_components/ConfigHeader/ConfigHeader";
import ConfigTabs from "./_components/ConfigTabs/ConfigTabs";

import NotFound from "@/app/(default)/_components/NotFound";
import { getUser } from "@/utils/auth/auth-helpers";
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
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const apiClient = await createApiClientOnServer();

  const gameData = await parseResponse(
    apiClient.games[":gameId"].$get({ param: { gameId: game_id } })
  );

  if ("error" in gameData) {
    return <NotFound />;
  }

  const game = gameData.data;

  return (
    <>
      <ConfigHeader
        ruleType={game.ruleType}
        playerCount={game.players.length}
        logCount={game.logs.length}
      />
      <ConfigTabs gameId={game_id}>{children}</ConfigTabs>
    </>
  );
};

export default ConfigLayout;
