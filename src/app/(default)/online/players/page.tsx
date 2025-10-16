import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { parseResponse } from "hono/client";

import ManagePlayer from "./_components/ManagePlayer";

import { getUser } from "@/utils/auth/auth-helpers";
import { createApiClientOnServer } from "@/utils/hono/server";

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

  const apiClient = await createApiClientOnServer();

  const initialPlayers = await parseResponse(
    apiClient.players.$get({ query: {} })
  );
  if ("error" in initialPlayers) {
    return <div>Error: {initialPlayers.error}</div>;
  }

  return <ManagePlayer initialPlayers={initialPlayers} userId={user.id} />;
};

export default OnlinePlayerPage;
