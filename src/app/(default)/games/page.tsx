import { Metadata } from "next";

import GameList from "./_components/GameList";

export const metadata: Metadata = {
  title: "作成したゲーム",
};

export default function GamesPage() {
  return (
    <>
      <GameList />
    </>
  );
}
