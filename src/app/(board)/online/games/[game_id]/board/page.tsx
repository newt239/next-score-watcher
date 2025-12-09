import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { parseResponse } from "hono/client";

import Board from "./_components/Board/Board";

import { getUser } from "@/utils/auth/auth-helpers";
import { createApiClientOnServer } from "@/utils/hono/server";

// ページを動的レンダリングとして明示的に設定
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "クラウド得点表示",
  robots: {
    index: false,
  },
};

const BoardPage = async ({ params }: { params: Promise<{ game_id: string }> }) => {
  const { game_id } = await params;
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const apiClient = await createApiClientOnServer();

  const [gameData, playersData, logsData, preferencesData] = await Promise.all([
    parseResponse(
      apiClient.games[":gameId"].$get({
        param: { gameId: game_id },
      })
    ),
    parseResponse(
      apiClient.games[":gameId"].players.$get({
        param: { gameId: game_id },
      })
    ),
    parseResponse(
      apiClient.games[":gameId"].logs.$get({
        param: { gameId: game_id },
      })
    ),
    parseResponse(
      apiClient["user"][":user_id"].preferences.$get({
        param: { user_id: user.id },
      })
    ),
  ]);

  if ("error" in gameData || "error" in playersData || "error" in logsData) {
    return null;
  }

  // preferencesがエラーの場合はnullで渡す
  const preferences = "error" in preferencesData ? null : preferencesData.preferences;

  return (
    <Board
      gameId={game_id}
      user={user}
      initialGame={gameData.data}
      initialPreferences={preferences}
    />
  );
};

export default BoardPage;
