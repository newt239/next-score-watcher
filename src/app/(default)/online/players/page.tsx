import type { Metadata } from "next";
import { redirect } from "next/navigation";

import ManagePlayer from "./_components/ManagePlayer";

import type { ApiPlayerDataType } from "@/models/players";

import { getUser } from "@/utils/auth/auth-helpers";
import { createApiClientOnServer } from "@/utils/hono/server-client";

export const metadata: Metadata = {
  title: "プレイヤー管理",
  alternates: {
    canonical: "https://score-watcher.com/online/players",
  },
};

const OnlinePlayerPage = async () => {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  // API Routes経由でプレイヤー一覧を取得
  const apiClient = await createApiClientOnServer();

  let initialPlayers: ApiPlayerDataType[] = [];
  try {
    const response = await apiClient.players.$get({ query: {} });
    if (response.ok) {
      const data = await response.json();
      initialPlayers = data.data.players || [];
    }
  } catch (error) {
    console.error("Failed to fetch initial players:", error);
  }

  return <ManagePlayer initialPlayers={initialPlayers} />;
};

export default OnlinePlayerPage;
