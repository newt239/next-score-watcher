import { cookies } from "next/headers";

import Config from "./_components/Config/Config";

export default function ConfigPage({
  params,
}: {
  params: { game_id: string };
}) {
  const cookieStore = cookies();
  const currentProfileCookie = cookieStore.get("scorew_current_profile");
  const currentProfile = currentProfileCookie?.value || "score_watcher";

  return <Config game_id={params.game_id} currentProfile={currentProfile} />;
}
