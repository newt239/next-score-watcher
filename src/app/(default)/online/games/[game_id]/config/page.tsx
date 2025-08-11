import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { parseResponse } from "hono/client";

import Config from "./_components/Config/Config";

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
    return "データ取得に失敗しました";
  }

  const game = gameData.game;
  const players = playersData.data.players;
  const logs = logsData.logs.filter(
    (log) => log.system === 0 && log.available === 1
  );

  return (
    <Config
      gameId={game_id}
      user={user}
      initialGame={{ ...game, settings: {} }}
      initialPlayers={players}
      initialLogs={logs}
    />
  );
};

export default ConfigPage;
