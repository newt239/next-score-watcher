import { Metadata } from "next";
import { cookies } from "next/headers";

import Board from "./_components/Board/Board";

import { getUser } from "@/utils/auth-helpers";

export const metadata: Metadata = {
  title: "得点表示",
  robots: {
    index: false,
  },
};

export default async function BoardPage({
  params,
}: {
  params: Promise<{ game_id: string }>;
}) {
  const { game_id } = await params;
  const cookieStore = await cookies();
  const currentProfileCookie = cookieStore.get("scorew_current_profile");
  const currentProfile = currentProfileCookie?.value || "score_watcher";

  const user = await getUser();

  return (
    <Board
      game_id={game_id}
      current_profile={currentProfile}
      userId={user?.id}
    />
  );
}
