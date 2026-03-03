import type { Metadata } from "next";

import { DEFAULT_CURRENT_PROFILE } from "@/utils/current-profile";

import GameList from "./_components/GameList/GameList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "作成したゲーム",
  alternates: {
    canonical: "https://score-watcher.com/games",
  },
};

const GamesPage = async () => {
  return <GameList currentProfile={DEFAULT_CURRENT_PROFILE} />;
};

export default GamesPage;
