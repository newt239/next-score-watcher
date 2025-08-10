import type { Metadata } from "next";

import Config from "./_components/Config/Config";

import { getUser } from "@/utils/auth/auth-helpers";

export const metadata: Metadata = {
  title: "ゲーム設定",
  robots: {
    index: false,
  },
};

const ConfigPage = async ({
  params,
}: {
  params: Promise<{ game_id: string }>;
}) => {
  const { game_id } = await params;
  const user = await getUser();

  return <Config game_id={game_id} user={user} />;
};

export default ConfigPage;
