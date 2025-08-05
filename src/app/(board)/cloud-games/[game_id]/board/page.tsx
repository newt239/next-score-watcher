import type { Metadata } from "next";

import CloudBoard from "./_components/CloudBoard/CloudBoard";

// ページを動的レンダリングとして明示的に設定
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "クラウド得点表示",
  robots: {
    index: false,
  },
};

const CloudBoardPage = async ({
  params,
}: {
  params: Promise<{ game_id: string }>;
}) => {
  const { game_id } = await params;

  return <CloudBoard game_id={game_id} />;
};

export default CloudBoardPage;
