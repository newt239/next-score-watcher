import type { Metadata } from "next";

import { DEFAULT_CURRENT_PROFILE } from "@/utils/current-profile";

import RuleList from "./_components/RuleList/RuleList";

export const metadata: Metadata = {
  title: "形式一覧",
  alternates: {
    canonical: "https://score-watcher.com/rules",
  },
};

const RulesPage = async () => {
  return <RuleList currentProfile={DEFAULT_CURRENT_PROFILE} />;
};

export default RulesPage;
