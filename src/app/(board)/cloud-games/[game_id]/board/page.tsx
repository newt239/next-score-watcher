import type { Metadata } from "next";

import CloudBoard from "./_components/CloudBoard/CloudBoard";

import { getUser } from "@/utils/auth/auth-helpers";

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
  const user = await getUser();

  return <CloudBoard game_id={game_id} user={user} />;
};

export default CloudBoardPage;
