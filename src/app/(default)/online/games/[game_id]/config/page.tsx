import type { Metadata } from "next";

import CloudConfig from "./_components/CloudConfig/CloudConfig";

import { getUser } from "@/utils/auth/auth-helpers";

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
  const user = await getUser();

  return <CloudConfig game_id={game_id} user={user} />;
};

export default CloudConfigPage;
