import type { Metadata } from "next";
import { cookies } from "next/headers";

import Config from "./_components/Config/Config";

export const metadata: Metadata = {
  title: "ゲーム設定",
  robots: {
    index: false,
  },
};

const ConfigPage = async ({ params }: { params: Promise<{ game_id: string }> }) => {
  const { game_id } = await params;
  const cookieStore = await cookies();
  const currentProfileCookie = cookieStore.get("scorew_current_profile");
  const currentProfile = currentProfileCookie?.value || "score_watcher";

  return <Config game_id={game_id} currentProfile={currentProfile} />;
};

export default ConfigPage;
