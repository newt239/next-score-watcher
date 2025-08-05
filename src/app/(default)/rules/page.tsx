import { Metadata } from "next";
import { cookies } from "next/headers";

import RuleList from "./_components/RuleList/RuleList";

export const metadata: Metadata = {
  title: "形式一覧",
  alternates: {
    canonical: "https://score-watcher.com/rules",
  },
};

const RulesPage = async () => {
  const cookieStore = await cookies();
  const currentProfileCookie = cookieStore.get("scorew_current_profile");
  const currentProfile = currentProfileCookie?.value || "score_watcher";
  return <RuleList currentProfile={currentProfile} />;
};

export default RulesPage;
