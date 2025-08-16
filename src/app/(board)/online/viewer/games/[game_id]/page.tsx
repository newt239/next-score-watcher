import type { Metadata } from "next";

import ViewerBoard from "./_components/ViewerBoard/ViewerBoard";

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
  try {
    const response = await apiClient.viewer.games[":gameId"].board.$get({
      param: { gameId: game_id },
    });

    if (response.ok) {
      const result = await response.json();
      if ("data" in result) {
        return <ViewerBoard gameId={game_id} initialData={result.data} />;
      }
    } else {
      const errorResult = await response.json();
      const errorMessage =
        "error" in errorResult ? errorResult.error : "エラーが発生しました";
      if (response.status === 404) {
        return (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h1>ゲームが見つかりません</h1>
            <p>このゲームは存在しないか、非公開に設定されています。</p>
          </div>
        );
      } else if (response.status === 202) {
        return (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h1>データを準備中です</h1>
            <p>しばらくしてから再度お試しください。</p>
          </div>
        );
      } else {
        throw new Error(errorMessage);
      }
    }
  } catch (error) {
    console.error("Failed to fetch viewer data:", error);
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1>エラーが発生しました</h1>
        <p>データの取得に失敗しました。しばらくしてから再度お試しください。</p>
      </div>
    );
  }
};

export default ViewerPage;
