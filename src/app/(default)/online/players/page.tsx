import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import OnlineManagePlayer from "./_components/OnlineManagePlayer";

import type { ApiPlayerDataType } from "@/models/players";

import { getUser } from "@/utils/auth/auth-helpers";
import { createApiClientOnServer } from "@/utils/hono/server-client";

export const metadata: Metadata = {
  title: "オンラインプレイヤー管理",
  alternates: {
    canonical: "https://score-watcher.com/online/players",
  },
};

const OnlinePlayerPage = async () => {
  const user = await getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const cookieStore = await cookies();
  const currentProfileCookie = cookieStore.get("scorew_current_profile");
  const currentProfile = currentProfileCookie?.value || "score_watcher";

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

  return (
    <OnlineManagePlayer
      currentProfile={currentProfile}
      initialPlayers={initialPlayers}
    />
  );
};

export default OnlinePlayerPage;
