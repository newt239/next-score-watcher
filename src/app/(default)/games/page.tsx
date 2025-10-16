import type { Metadata } from "next";
import { cookies } from "next/headers";

import GameList from "./_components/GameList/GameList";

export const metadata: Metadata = {
  title: "作成したゲーム",
  alternates: {
    canonical: "https://score-watcher.com/games",
  },
};

const GamesPage = async () => {
  const cookieStore = await cookies();
  const currentProfileCookie = cookieStore.get("scorew_current_profile");
  const currentProfile = currentProfileCookie?.value || "score_watcher";

  return <GameList currentProfile={currentProfile} />;
};

export default GamesPage;
