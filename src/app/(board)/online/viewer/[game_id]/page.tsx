import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ViewerBoard from "./_components/ViewerBoard/ViewerBoard";
import ViewerHeader from "./_components/ViewerHeader/ViewerHeader";
import styles from "./page.module.css";

import { createApiClientOnServer } from "@/utils/hono/server";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "観戦モード - Score Watcher",
  description: "クイズゲームの観戦モード",
  robots: {
    index: false,
  },
};

const ViewerPage = async ({
  params,
}: {
  params: Promise<{ game_id: string }>;
}) => {
  const { game_id } = await params;

  const apiClient = await createApiClientOnServer();

  // 認証不要のViewer APIを使用してデータを取得
  const response = await apiClient.viewer.games[":gameId"].board.$get({
    param: { gameId: game_id },
  });
  const result = await response.json();

  if (!response.ok || "error" in result) {
    return notFound();
  }

  return (
    <div className={styles.container}>
      <ViewerHeader />
      <main className={styles.main}>
        <ViewerBoard gameId={game_id} initialData={result.data} />
      </main>
    </div>
  );
};

export default ViewerPage;
