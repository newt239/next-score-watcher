import type { Metadata } from "next";

import { DEFAULT_CURRENT_PROFILE } from "@/utils/current-profile";

import Config from "./_components/Config/Config";

export const metadata: Metadata = {
  title: "ゲーム設定",
  robots: {
    index: false,
  },
};

const ConfigPage = async ({ params }: { params: Promise<{ game_id: string }> }) => {
  const { game_id } = await params;

  return <Config game_id={game_id} currentProfile={DEFAULT_CURRENT_PROFILE} />;
};

export default ConfigPage;
