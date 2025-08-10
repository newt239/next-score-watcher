import type { Metadata } from "next";

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

  // サーバー側で初期データを取得（AGENTS.mdの方針）
  const apiClient = await createApiClientOnServer();
  const initial = {
    game: null as unknown,
    players: [] as unknown[],
    logs: [] as unknown[],
    settings: null as unknown,
  };

  try {
    const [gameRes, playersRes, logsRes, settingsRes] = await Promise.all([
      apiClient["games"][":gameId"].$get({ param: { gameId: game_id } }),
      apiClient["games"][":gameId"]["players"].$get({
        param: { gameId: game_id },
      }),
      apiClient["games"][":gameId"]["logs"].$get({
        param: { gameId: game_id },
      }),
      apiClient["games"][":gameId"]["settings"].$get({
        param: { gameId: game_id },
      }),
    ]);

    if (gameRes.ok) {
      const json = await gameRes.json();
      if (json && "game" in json) initial.game = json.game;
    }
    if (playersRes.ok) {
      const json = await playersRes.json();
      if (json && "players" in json) initial.players = json.players;
    }
    if (logsRes.ok) {
      const json = await logsRes.json();
      if (json && "logs" in json) initial.logs = json.logs;
    }
    if (settingsRes.ok) {
      const json = await settingsRes.json();
      if (json && "settings" in json) initial.settings = json.settings;
    }
  } catch (e) {
    console.error("Failed to fetch initial board data:", e);
  }

  return (
    <Board
      game_id={game_id}
      user={user}
      initialGame={initial.game}
      initialPlayers={initial.players}
      initialLogs={initial.logs}
      initialSettings={initial.settings}
    />
  );
};

export default BoardPage;
