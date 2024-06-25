import { Metadata } from "next";
import { cookies } from "next/headers";

import Board from "./_components/Board";

export const metadata: Metadata = {
  title: "得点表示",
};

export default function BoardPage({ params }: { params: { game_id: string } }) {
  const cookieStore = cookies();
  const currentProfileCookie = cookieStore.get("scorew_current_profile");
  const currentProfile = currentProfileCookie?.value || "score_watcher";

  return <Board game_id={params.game_id} current_profile={currentProfile} />;
}
