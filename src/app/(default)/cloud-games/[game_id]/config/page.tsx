import type { Metadata } from "next";

import CloudConfig from "./_components/CloudConfig/CloudConfig";

export const metadata: Metadata = {
  title: "クラウドゲーム設定",
  robots: {
    index: false,
  },
};

const CloudConfigPage = async ({
  params,
}: {
  params: Promise<{ game_id: string }>;
}) => {
  const { game_id } = await params;

  return <CloudConfig game_id={game_id} />;
};

export default CloudConfigPage;
