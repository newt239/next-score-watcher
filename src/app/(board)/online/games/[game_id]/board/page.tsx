import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { parseResponse } from "hono/client";

import Board from "./_components/Board/Board";

import { getUser } from "@/utils/auth/auth-helpers";
import { createApiClientOnServer } from "@/utils/hono/server-client";

// ページを動的レンダリングとして明示的に設定
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "クラウド得点表示",
  robots: {
    index: false,
  },
};

const BoardPage = async ({
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

  const [gameData, playersData, logsData, settingsData] = await Promise.all([
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
      apiClient.games[":gameId"].settings.$get({
        param: { gameId: game_id },
      })
    ),
  ]);

  if (
    "error" in gameData ||
    "error" in playersData ||
    "error" in logsData ||
    "error" in settingsData
  ) {
    return null;
  }

  // プレイヤーデータをGameDBPlayerProps形式に変換
  const convertedPlayers = playersData.players.map((p: unknown) => {
    const player = p as {
      id: string;
      name: string;
      initialCorrectCount?: number;
      initialWrongCount?: number;
    };
    return {
      id: player.id,
      name: player.name,
      initial_correct: player.initialCorrectCount || 0,
      initial_wrong: player.initialWrongCount || 0,
      base_correct_point: 1,
      base_wrong_point: 1,
    };
  });

  // ログデータをLogDBProps形式に変換
  const convertedLogs = logsData.logs.map((log: unknown) => {
    const typedLog = log as { system: number; available: number };
    return {
      ...typedLog,
      system: typedLog.system as 0 | 1,
      available: typedLog.available as 0 | 1,
    };
  });

  // ゲームオブジェクトからplayersを除外
  const { players: _, ...gameWithoutPlayers } = gameData.game;

  return (
    <Board
      gameId={game_id}
      user={user}
      initialGame={gameWithoutPlayers}
      initialPlayers={convertedPlayers}
      initialLogs={convertedLogs}
      initialSettings={settingsData.settings}
    />
  );
};

export default BoardPage;
