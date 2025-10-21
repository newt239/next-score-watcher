import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { parseResponse } from "hono/client";

import ManagePlayer from "./_components/ManagePlayer";

import { createApiClientOnServer } from "@/utils/hono/server";

export const metadata: Metadata = {
  title: "プレイヤー管理",
  alternates: {
    canonical: "https://score-watcher.com/online/players",
  },
};

const OnlinePlayerPage = async () => {
  const apiClient = await createApiClientOnServer();

  const initialPlayers = await parseResponse(
    apiClient.players.$get({ query: {} })
  );
  if ("error" in initialPlayers) {
    return notFound();
  }

  return <ManagePlayer initialPlayers={initialPlayers} />;
};

export default OnlinePlayerPage;
