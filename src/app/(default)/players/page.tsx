import { Metadata } from "next";
import { cookies } from "next/headers";

import ManagePlayer from "./_components/ManagePlayer";

export const metadata: Metadata = {
  title: "プレイヤー管理",
  alternates: {
    canonical: "https://score-watcher.com/players",
  },
};

export default function PlayerPage() {
  const cookieStore = cookies();
  const currentProfileCookie = cookieStore.get("scorew_current_profile");
  const currentProfile = currentProfileCookie?.value || "score_watcher";

  return <ManagePlayer currentProfile={currentProfile} />;
}
