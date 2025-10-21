import type { Metadata } from "next";

import RuleList from "./_components/RuleList/RuleList";

export const metadata: Metadata = {
  title: "形式一覧",
  alternates: {
    canonical: "https://score-watcher.com/cloud-rules",
  },
  robots: {
    index: false,
  },
};

const RulesPage = async () => {
  return <RuleList />;
};

export default RulesPage;
